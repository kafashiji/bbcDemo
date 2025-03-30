<template>
  <div class="container">
    <!-- 用户信息 -->
    <div class="user-info">
      <div class="banner">
        <img :src="user.banner" alt="banner">
      </div>
      <div class="profile">
        <img :src="user.avatar" class="profile-avatar">
        <h2>{{ user.name }}</h2>
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

    <!-- 视频发布 -->
      <div v-if="activeTab === '发布'" class="video-upload">
      </div>
      <!-- 收藏内容 -->
      <div v-if="activeTab === '收藏'" class="favorites">
        <div>
            <CCcard :item="item" v-for="(item) in favorites.slice(0,25)" :key="item" class="card"/>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const openAccountInfo=()=>{
  router.push('/accenter')
}
// 用户数据
const user = reactive({
  name: '感觉妥了只眼姬',
  avatar: 'https://dummyimage.com/100x100',
  banner: 'https://dummyimage.com/1200x300',
  followers: 12345,
  following: 678
})

// 选项卡功能
const tabs = ['发布', '收藏']
const activeTab = ref('发布')


// 收藏数据
const favorites = reactive([
  {
    upId: '旅行家小明',
    title: '【4K】绝美风景',
    img: 'https://dummyimage.com/',
    plays: '12.3万',
    date: '3天前'
  },
  {
    upId: '旅行家小明',
    title: '【4K】绝美风景',
    img: 'https://dummyimage.com/',
    plays: '12.3万',
    date: '3天前'
  }
])
</script>

<style scoped>
.icon{
  margin-left: -10px;
  margin-top: 5px;
  fill: #939696;
}
.card{
  width: 280px;
  height: 220px;
  float: left;
  margin: 10px 20px 20px 0;
  border-radius: 10px !important;
  position: relative;
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

.banner img {
  width: 100%;
  height: 300px;
  object-fit: cover;
  border-radius: 8px;
}

.profile {
  position: absolute;
  bottom: -60px;
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
  margin-top: 100px;
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
</style>	