<!-- src/views/UserCenter.vue -->
<template>
  <div class="user-center-container">
    <!-- 侧边导航栏 -->
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

    <!-- 主内容区 -->
    <div class="main-content">
      <!--
        * 本组件用于显示当前路由的内容。
        * 它使用 router-view 来显示与当前路由关联的组件。
        * 它还使用 transition 来动画化路由之间的更改。
        * @slot Component - 要显示的组件。
        * @prop {object} user - 用户对象。
        * @emits update-user - 当用户对象更新时发出。
        -->
      <router-view v-slot="{ Component }">
        <transition name="fade" mode="out-in">
          <component :is="Component" :user="user" @update-user="handleUpdateUser"/>
        </transition>
      </router-view>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'


// 用户数据
const user = ref({
  username: 'user123',
  nickname: 'Vue开发者',
  avatar: 'https://kafashiji.oss-cn-beijing.aliyuncs.com/a29b340b-d02c-499c-abd6-c4dc01cffbb6_base_resized(1).jpg',
  email: 'vue@example.com',
  createTime: new Date()
})

// 更新用户数据
const handleUpdateUser = (newData) => {
  user.value = { ...user.value, ...newData }
}

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