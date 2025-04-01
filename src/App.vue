
<template>
    <el-menu
    :default-active="activeIndex"
    class="el-menu-demo"
    mode="horizontal"
    @select="handleSelect"
    :router="true"
  >
    <span class="logo">BBC</span>
    <el-menu-item index="/">首页</el-menu-item>
    <el-menu-item index="/account">用户</el-menu-item>
    <el-menu-item index="/platform">稿件管理</el-menu-item>
    <el-menu-item index="/upload">稿件上传</el-menu-item>
    <div class="searcher-container">
      <el-input
        v-model="searchText"
        placeholder="请输入稿件关键词"
        clearable
        @keyup.enter="handleSearch"
        @clear="handleClear"
      >
        <template #prefix>
          <el-icon><search /></el-icon>
        </template>
      </el-input>
    </div>
    <div class="headerAvatar">
      <el-avatar
        src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png"
        @click="handleAvatarClick"
      />
      <!-- 后续增加头像跳转以及封装 -->
    </div>
  </el-menu>
  <router-view/>
  <LoginDialog ref="loginDialog" />
  <RegisterV ref="registerV" />
</template>

<script setup>
import { ref, provide } from 'vue'
import { useRouter } from 'vue-router'
import { Search } from '@element-plus/icons-vue'
import LoginDialog from './pageview/login/loginV.vue'
import RegisterV from './pageview/login/registerV.vue'

const searchText = ref('')
const loginDialog = ref(null) // 保持与模板ref同名
const registerV = ref(null)   // 接收注册组件实例

provide('dialogRefs', {
  login: loginDialog,
  register: registerV
})

const handleSearch = () => {
  if (searchText.value.trim()) {
    // 实现搜索逻辑（示例：路由跳转+参数传递）
    router.push({
      path: '/Vsearch',
      query: { q: searchText.value.trim() }
    })
  }
}

const handleClear = () => {
  // 可添加清除后的回调逻辑
}

const router = useRouter()
const activeIndex = ref('1')

const handleAvatarClick = () => {
  if (!localStorage.getItem('user')) {
    loginDialog.value?.open()// 未登录弹出登录页
  }
  else{
    router.push('/account')
  }
}

const handleSelect = (key , keyPath) => {
  console.log(key, keyPath)
}
</script>
<style scoped>
/* 搜索框容器定位 */
.searcher-container {
  position: absolute;
  left: 50%; /* 水平定位起点 */
  transform: translateX(-50%); /* 向左回退自身宽度的一半 */
  top: 50%; /* 垂直定位起点 */
  transform: translate(-50%, -50%); /* 合并水平和垂直居中 */
  width: 400px; /* 保持原有宽度 */
}

/* 输入框动效 */
.el-input__wrapper {
  transition: all 0.3s ease;
  border-radius: 20px !important;
  background: rgba(255,255,255,0.1) !important;
}

.el-input__wrapper:hover {
  box-shadow: 0 0 0 1px #3891cc inset !important;
  background: rgba(255,255,255,0.2) !important;
}

.logo {
  font-size: 40px;
  font-weight: bold;
  color: #3891cc;
  margin-left: 5px;
}
.headerAvatar {
  position: absolute;
  right: 40px;
  top: -2px;
}
.headerAvatar {
  display: inline-block;
  padding-top: 12px;        /* 预留上升空间 */
  margin-bottom: 12px;      /* 补偿布局偏移 */
  overflow: visible !important; /* 确保投影可见 */
}

/* 头像动画设置 */
.headerAvatar .el-avatar {
  transition: 
    transform 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94),
    filter 0.3s ease;       /* 为投影添加过渡 */
  will-change: transform, filter;
}

/* 悬停复合效果 */
.headerAvatar .el-avatar:hover {
  transform: translateY(-10px) scale(1.08);  /* 上升10px + 放大8% */
  filter: drop-shadow(0 8px 12px rgba(0, 0, 0, 0.15));
}

/* 如果元素有边框需要同步放大 */
.headerAvatar .el-avatar::after {
  content: "";
  position: absolute;
  inset: 0;
  border-radius: inherit;
  transition: inherit;
}
</style>