<template>

    <el-menu
      :default-active="activeIndex"
      class="el-menu-demo"
      mode="horizontal"
      @select="handleSelect"
    >
      <span class="logo">BBC</span>
      <el-menu-item index="/" @click="handleHomeClick">首页</el-menu-item>
      <el-menu-item index="/account" @click="handleAccountClick($event)">用户</el-menu-item>
      <el-menu-item index="/platform" @click="handleVedioMaClick($event)">稿件管理</el-menu-item>
      <el-menu-item index="/upload" @click="handleVedioUploadClick($event)">稿件上传</el-menu-item>
      
      <div class="searcher-container">
        <el-input
          v-model="searchText"
          placeholder="请输入稿件关键词"
          clearable
          @keyup.enter="handleSearch"
          @clear="handleClear"
          style="height: 45px;border-radius: 8px;"
        >
          <template #prefix>
            <el-icon><Search /></el-icon>
          </template>
        </el-input>
      </div>

      <div class="headerAvatar">
        <el-avatar
          :class="{ 'avatar-active': showTooltip }"
          :src="Myavatar"
          @click="handleAvatarClick"
          @mouseenter="handleAvatarEnter"
          @mouseleave="handleAvatarLeave"
        />
      </div>
    </el-menu>

  <router-view />

  <transition name="tooltip">
    <div 
      v-if="showTooltip"
      class="tooltip"
      @mouseenter="cancelHide"
      @mouseleave="startHide"
    >
      <button 
        class="btn"
        @click="handleLogout"
      >
        退出登录
      </button>
    </div>
  </transition>

  <LoginDialog ref="loginDialog" />
  <RegisterV ref="registerV" />
</template>

<script setup>
import { ref, provide } from 'vue'
import { useRouter } from 'vue-router'
import { Search } from '@element-plus/icons-vue'
import LoginDialog from './pageview/login/loginV.vue'
import RegisterV from './pageview/login/registerV.vue'
import { ElMessage } from 'element-plus'
import { debounce } from 'lodash-es'
import { onUnmounted } from 'vue'

onUnmounted(() => {
  handleSearch.cancel()
})
const storedData = JSON.parse(localStorage.getItem('user'))
const Myavatar = ref('')
  if(storedData) {
  Myavatar.value = storedData.avatarUrl
} else {
  Myavatar.value = 'https://kafashiji.oss-cn-beijing.aliyuncs.com/%E5%B1%8F%E5%B9%95%E6%88%AA%E5%9B%BE%202025-04-01%20210250.png' // 默认头像URL
}



const router = useRouter()
const searchText = ref('')
const loginDialog = ref(null)
const registerV = ref(null)
const activeIndex = ref('1')
const showTooltip = ref(false)
let hideTimer = null
const animationDuration = 300 // 必须与CSS动画时间保持一致

// 头像悬停逻辑
const enterTimer = ref(null)

// 修改后的头像悬停逻辑
const handleAvatarEnter = () => {
  if (!localStorage.getItem('user')) {
    clearTimeout(enterTimer.value)
    showTooltip.value = false
    return
  }
  
  // 清除已有定时器防止重复触发
  clearTimeout(enterTimer.value)
  
  // 设置1秒延迟定时器
  enterTimer.value = setTimeout(() => {
    showTooltip.value = true
  }, 100)
}

const handleAvatarLeave = () => {
  // 清除进入定时器
  clearTimeout(enterTimer.value)
  
  // 如果已经显示则启动隐藏
  if (showTooltip.value) {
    startHide()
  }
}

// 弹窗悬停逻辑
const startHide = () => {
  hideTimer = setTimeout(() => {
    showTooltip.value = false
  }, animationDuration)
}

const cancelHide = () => {
  clearTimeout(hideTimer)
}

// 退出登录
const handleLogout = () => {
  localStorage.clear()
  showTooltip.value = false
  Myavatar.value = 'https://kafashiji.oss-cn-beijing.aliyuncs.com/%E5%B1%8F%E5%B9%95%E6%88%AA%E5%9B%BE%202025-04-01%20210250.png'
  router.replace("/")
}

// 头像点击逻辑
const handleAvatarClick = () => {
  if (!localStorage.getItem('user')) {
    loginDialog.value?.open()
  } else {
    router.push('/account')
  }
}
const handleAccountClick = (e) => {
  if (!localStorage.getItem('user')) {
    loginDialog.value?.open()
    e.preventDefault(); // 阻止默认路由跳转
    return
  }else {
    router.push('/account'); // 手动控制跳转
  }
}
const handleHomeClick = () => {
  router.push('/')
}
const handleVedioMaClick = (e) => {
  if (!localStorage.getItem('user')) {
    loginDialog.value?.open()
    e.preventDefault(); // 阻止默认路由跳转
    return
  }
  router.push('/platform')
}
const handleVedioUploadClick = (e) => {
  if (!localStorage.getItem('user')) {
    loginDialog.value?.open()
    e.preventDefault(); // 阻止默认路由跳转
    return
  } else {
    router.push('/upload')
  }
}

// 搜索功能
const handleSearch = debounce(() => {
  if (searchText.value.trim()) {

    router.push({
      path: '/Vsearch',
      query: { q: searchText.value.trim() }
    })
  }else{
    ElMessage.success("请输入内容")
  }
},300)




provide('dialogRefs', {
  login: loginDialog,
  register: registerV
})
</script>

<style scoped>
/* 覆盖 el-menu 的默认背景和边框 */
::v-deep(.el-input__wrapper) {
  border-radius: 12px;
  box-shadow: 0 0 0 1px var(--el-input-border-color) !important;
}
.el-menu {
  background-color: transparent !important; /* 背景透明 */
  border: none !important; /* 去除边框 */
  color: #4d4c4c;
}

/* 可选：去除菜单栏底部的阴影 */
.el-menu.el-menu--horizontal {
  border-bottom: none !important;
  box-shadow: none !important;
}
/* 菜单项悬停效果 */
.el-menu-item:hover {
  background-color: rgba(255, 255, 255, 0.1) !important; /* 半透明悬停效果 */
}


::v-deep(.el-menu--horizontal .el-menu-item.is-active) {
  background-color: transparent !important;
  border-bottom: none !important;
  color: #666 !important; /* 可选：自定义选中文字颜色 */
}

/* 激活状态 */
.el-menu-item.is-active {
  background-color: transparent !important;
  color: inherit !important;
  border-bottom: none !important;
}
/* 所有菜单项激活态清除 */
::v-deep(.no-active-style) .el-menu-item.is-active,
::v-deep(.no-active-style) .el-menu-item.is-active:hover,
::v-deep(.no-active-style) .el-submenu.is-active .el-submenu__title {
  color: #666 !important;  /* 设置为普通状态颜色 */
  background: transparent !important;
  border: none !important;
}
/* 可选：取消悬停背景色 */
::v-deep(.el-menu-item:hover) {
  background-color: transparent !important;
}
.el-menu-item,
.el-submenu__title,
.el-menu--popup {
  transition: none !important;
  -webkit-transition: none !important;
  -moz-transition: none !important;
  -o-transition: none !important;
}
.el-menu--horizontal .el-menu-item:not(.is-disabled):hover,
.el-menu--horizontal .el-menu-item:not(.is-disabled):focus {
  transition: none !important;
}
/* 头像动画 */
.headerAvatar {
  position: absolute;
  right: 87px;
  top: 50%;
  transform: translateY(-50%);
  z-index: 1000;
}

.el-avatar {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  transform-origin: center bottom;
  cursor: pointer;
}

.avatar-active {
  transform: scale(1.8) translateY(20px);
  filter: drop-shadow(0 8px 12px rgba(0, 0, 0, 0.15));
}

/* 弹窗样式 */
.tooltip {
  position: fixed;
  top: 70px;
  right: 16px;
  width: 180px;
  height: 240px;
  padding: 16px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 18px 12px rgba(0,0,0,0.15);
  z-index: 999;
  display: flex;
  align-items: center;
  justify-content: end;
  flex-direction: column;
}

/* 弹窗过渡动画 */
.tooltip-enter-active,
.tooltip-leave-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.tooltip-enter-from,
.tooltip-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

/* 按钮样式 */
.btn {
  width: 100%;
  padding: 12px;
  background: #409EFF;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 14px;
  cursor: pointer;
  transition: background 0.2s;
}

.btn:hover {
  background: #66b1ff;
}

/* 搜索框定位 */
.searcher-container {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  top: 50%;
  transform: translate(-50%, -50%);
  width: 400px;
}

.logo {
  font-size: 40px;
  font-weight: bold;
  color: #3891cc;
  margin-left: 5px;
  margin-right: 30px;
}

</style>