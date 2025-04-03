<!-- src/views/UserCenter.vue -->
<template>
  <div class="user-center-container">
    <!-- 添加加载状态判断 -->
    <template v-if="!isLoading">
      <div class="sidebar">  
      <el-menu
        router
        :default-active="$route.path"
        class="nav-menu"
      >
        <el-menu-item index="/accenter/info">
          
          <span>个人信息</span>
        </el-menu-item>
        
        <el-menu-item index="/accenter/avatar">
          
          <span>头像设置</span>
        </el-menu-item>
        
        <el-menu-item index="/accenter/security">
          
          <span>账号安全</span>
        </el-menu-item>
      </el-menu>
    </div>
      <div class="main-content">
        <router-view v-slot="{ Component }">
          <component 
            :is="Component" 
            :user="userNum" 
            @update-user="handleUpdateUser"
            v-if="userNum"
          />
        </router-view>
      </div>
    </template>
    <div v-else class="loading-container">Loading...</div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import HYRequest from '../../service/Request' // 或使用你现有的HYRequest

const isLoading = ref(true)
const userNum = ref(null) // 初始化为 null 而不是空对象

const storedData = JSON.parse(localStorage.getItem('user'))//JSON.parse() 方法用于将 JSON 字符串转换为 JavaScript 对象。
// console.log("storedData",`/bbc_account/${storedData.id}`)
const fetchUserData = async () => {
  try {
    const res = await HYRequest.get({ url: `/bbc_account/${storedData.id}` })
    if (res.success) {
      userNum.value = res.data
    } else {
      ElMessage.error(res.errorMsg)
    }
  } catch (error) {
    ElMessage.error('网络请求失败')
  } finally {
    isLoading.value = false
  }
}

onMounted(fetchUserData)
</script>

<style scoped>
.user-center-container {
  display: flex;
  background: #f5f7fa;
  width: 1000px;
  margin: 0 auto;
  height: 600px;
}

.sidebar {
  width: 260px;
  background: #fff;
  box-shadow: 2px 0 8px rgba(0,0,0,0.1);
}

.user-card {
  padding: 30px 20px;
  text-align: center;
  border-bottom: 1px solid #eee;
  
  
}
h3 {
    margin: 10px 0 0;
  }
.nav-menu {
  border-right: none;
  margin-top: 20px;
  
}
:deep(.el-menu-item) {
    height: 50px;
    line-height: 50px;
  }

.main-content {
  flex: 1;
  padding: 30px;
}
</style>