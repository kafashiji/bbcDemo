<template>
  <div class="container">
    <!-- 用户信息 -->
    <div class="user-info">
      <div class="banner">
      </div>
      <div class="profile">
        <img :src="userAvatar" class="profile-avatar">
        <h2>{{ userAccname }}</h2>
        <div @click="openAccountInfo()">
          <svg t="1742277041460" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="1705" width="20" height="20"><path d="M574.4 80v96H176v671.936h672v-392.32h96v456.32a32 32 0 0 1-32 32H112a32 32 0 0 1-32-32V112a32 32 0 0 1 32-32h462.4zM891.52 63.872l67.84 67.904-429.696 429.12-67.84-67.968L891.52 63.872z" p-id="1706" ></path>
          </svg>
        </div>
      </div>
    </div>
    <div style="width: 1200px;">
    <!-- 选项卡 -->
      <div class="tabs">
        <button 
          v-for="tab in tabs" 
          :key="tab"
          :class="{ active: activeTab === tab }"
          @click="activeTab = tab"
        >
          {{ tab }}
        </button>
      </div>
      <transition name="tab-slide" mode="out-in">
        <div v-if="activeTab === '发布'" class="favorites">
          <CCcard :item="item" 
            v-for="(item) in sortedVideos" 
            :key="item" class="card" 
            @click="openVideoDetail(item)" 
          >
          </CCcard>
        </div>
        <!-- 收藏内容 -->
        <div v-else class="favorites">
          <CCcard :item="item" 
            v-for="(item) in sortedVideos1" 
            :key="item" class="card"
            @click="openVideoDetail1(item)"
          >
          </CCcard>
        </div>
      </transition>

    </div>
  </div>
</template>

<script setup>
import { reactive, ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import CCcard from '@/components/CCcard.vue'
import HYRequest from '../../service/Request' 

const router = useRouter()
const storedData = reactive(JSON.parse(localStorage.getItem('user')))
const userAvatar = storedData.avatarUrl
const userAccname = storedData.accName
const tabs = ['发布', '收藏']
const activeTab = ref('发布')
const filteredVideo1 = ref([])
// 收藏数据
const favorites = ref([])
const openAccountInfo=()=>{
  router.push('/accenter')
} 
const openVideoDetail = (video) => {
  router.push({
    name: 'Video', // 确保路由配置中有这个名称
    params: { id: video.id }, // 可选：通过状态传递完整数据
  })
}
const openVideoDetail1 = (video) => {
  router.push({
    name: 'Video', // 确保路由配置中有这个名称
    params: { id: video.videoId }, // 可选：通过状态传递完整数据
  })
}



const CollectVideo =() =>{
  HYRequest.get({url: `/collect/${storedData.id}`}).then(res =>{
    if(res.success){
      favorites.value = res.data // 数据更新会自动触发视图刷新
      console.log("收藏1",res)
    }
  })
}
// 原有代码保持不变
const filteredVideo =() =>{
  HYRequest.get({url: `/user/${storedData.id}/videos/search`,}).then(res =>{
    if(res.success){
      filteredVideo1.value = res.data // 数据更新会自动触发视图刷新
    }
  })
}


const sortedVideos = computed(() => {
  return [...filteredVideo1.value].sort((a, b) => {

      return new Date(b.createdAt) - new Date(a.createdAt);
  })
})
const sortedVideos1 = computed(() => {
  return [...favorites.value].sort((a, b) => {
      console.log("收藏",favorites.value)
      return new Date(b.viewCount) - new Date(a.viewCount);
  })
})

onMounted(() => {
  filteredVideo()
  CollectVideo()
})



</script>

<style scoped>
.icon{
  margin-left: -10px;
  margin-top: 5px;
  fill: #939696;
}
.card {
  /* 原有样式 */
  width: 280px;
  height: 220px;
  float: left;
  margin: 10px 20px 20px 0;
  border-radius: 10px !important;
  position: relative;
  
  /* 新增动画相关属性 */
  transition: transform 0.3s ease, box-shadow 0.3s ease; /* 添加过渡效果 */
  transform: translateY(0); /* 初始位置 */
  box-shadow: 0 2px 6px rgba(0,0,0,0.1); /* 初始阴影 */
}

.card:hover {
  transform: translateY(-5px); /* 上浮5像素 */
  box-shadow: 0 8px 16px rgba(0,0,0,0.15); /* 悬浮时加强阴影 */
}
h2{
  color: #138dbd;
}
.favorites{
  width: 1200px;
  overflow: hidden;
}
.container {
  max-width: 1200px;
  margin: 0 auto;
}

.user-avatar img {
  width: 40px;
  height: 40px;
  border-radius: 50%;
}

.user-info {
  position: relative;
  margin-top: 20px;
}

.banner {
  width: 1200px;
  height: 300px;
  background-image: url('https://kafashiji.oss-cn-beijing.aliyuncs.com/1681880694252.jpg');
  background-size: cover; /* 图片自适应容器 */
  background-position: center; /* 图片居中显示 */
  border-radius: 8px;
  /* 新增背景相关属性 */
  background-repeat: no-repeat;
  position: relative; /* 为子元素定位做准备 */
}

.profile {
  position: absolute;
  bottom: -20px;
  left: 20px;
  display: flex;
  align-items: center;
  gap: 20px;
}

.profile-avatar {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  border: 3px solid white;
}

.tabs {
  margin-top: 30px;
  border-bottom: 2px solid #eee;
}

.tabs button {
  padding: 1rem 2rem;
  background: none;
  border: none;
  cursor: pointer;
}

.tabs button.active {
  border-bottom: 3px solid #00aeec;
  color: #00aeec;
}

.video-upload {
  padding: 2rem;
}

.form-group {
  margin-bottom: 1rem;
}

.form-group input, 
.form-group textarea {
  width: 100%;
  padding: 0.5rem;
}

.favorite-item {
  width: 250px;
  height: 220px;
  float: left;
  margin: 0 20px 20px 0;
  border-radius: 10px !important;
}

.cover {
  width: 200px;
  height: 120px;
  border-radius: 4px;
}
.tab-slide-enter-active,
.tab-slide-leave-active {
  transition: all 0.3s cubic-bezier(0.55, 0, 0.1, 1);
  position: absolute;
}

.tab-slide-enter-from {
  opacity: 0;
  transform: translateX(30px);
}

.tab-slide-leave-to {
  opacity: 0;
  transform: translateX(-30px);
}

.favorites {
  position: relative;
  min-height: 300px; /* 保持内容区域高度避免闪烁 */
}

/* 添加按钮过渡效果 */
.tabs button {
  transition: 
    border-color 0.3s ease,
    color 0.3s ease,
    transform 0.2s ease;
  position: relative;
  overflow: hidden;
}

.tabs button::after {
  content: '';
  position: absolute;
  bottom: -3px;
  left: 0;
  width: 0;
  height: 3px;
  background: #00aeec;
  transition: width 0.3s ease;
}

.tabs button.active::after {
  width: 100%;
}

.tabs button:hover {
  transform: translateY(-2px);
}
</style>	