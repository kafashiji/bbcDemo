<!--网站首页详情-->
<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import CCcard from '@/components/CCcard.vue'
import HYRequest from '../service/Request'
import LoginDialog from './login/loginV.vue'
import RegisterV from './login/registerV.vue'

// 模拟视频数据（实际应从接口获取）
const router = useRouter()
const videos = ref([

  // ...更多视频数据
])
const videos1 = ref([

  // ...更多视频数据
])
const loginDialog = ref(null)
const registerV = ref(null)
const openVideoDetail = (video) => {
  if (!localStorage.getItem('user')) {
    loginDialog.value?.open()
    return
  } else {
    router.push({
    name: 'Video', // 使用命名路由
    params: { id: video.id },
    query: { from: 'home' }, // 可选查询参数
  })
  }
}
onMounted(() => {
  indexVideo()
  indexVideo1()
  // 获取数据
  
})

const carouselItems = ref([
  { id: 1, url: 'https://kafashiji.oss-cn-beijing.aliyuncs.com/a29b340b-d02c-499c-abd6-c4dc01cffbb6_base_resized(1).jpg' },
  { id: 2, url: 'https://kafashiji.oss-cn-beijing.aliyuncs.com/%E5%B1%8F%E5%B9%95%E6%88%AA%E5%9B%BE%202023-10-01%20011020.png' },
  { id: 3, url: 'https://kafashiji.oss-cn-beijing.aliyuncs.com/%E5%B1%8F%E5%B9%95%E6%88%AA%E5%9B%BE%202023-10-01%20011020.png' },
])

const indexVideo1 =() =>{
  HYRequest.get({url:"/indexVideo"}).then(res=>{
        //  Fisher-Yates洗牌算法
    videos1.value = res.data
  })
}
const indexVideo = () =>{
  HYRequest.get({url:"/indexVideo"}).then(res=>{
        //  Fisher-Yates洗牌算法
    videos.value = shuffleArray([...res.data])
  })

    function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }
}

</script>
<template>
<div class="hander"></div>
    <div style="width: 90%;margin: 10px auto; overflow: hidden; margin-left: 7%;">
                <!-- 轮播图 -->
      <div style="display: flex; width: 100%; justify-content: start;margin-bottom: 20px;">
        <!-- 轮播图和视频排版-->
        <div style="margin-right: 20px;">
          <el-carousel height="462px" style="width: 718px;" v-if="carouselItems.length > 0">
            <el-carousel-item v-for="(item, index) in carouselItems" :key="index">
              <img :src="item.url" class="carousel-image" alt="轮播图" @click="handleCarouselClick(item)" />
            </el-carousel-item>
          </el-carousel>
          
          <div v-else class="empty-carousel">
            <el-carousel height="462px" style="width: 524px;">
              <el-carousel-item v-for="item in 3" :key="item">
                <h3>暂无数据</h3>
              </el-carousel-item>
            </el-carousel>
          </div><!-- 无数据时的占位 -->
        </div>
        <!-- 视频列表 -->
        <div>
          <CCcard :item="item" v-for="(item) in videos1.slice(0,6)" :key="item" class="card1 hover-card"  @click="openVideoDetail(item)" ></CCcard>
        </div>
      </div>
      <!-- 视频列表2 -->
      <div >
        <CCcard :item="item" v-for="(item) in videos.slice(0,25)" :key="item" class="card hover-card"  @click="openVideoDetail(item)" ></CCcard>
      </div>
    </div>
    <LoginDialog ref="loginDialog" />
    <RegisterV ref="registerV" />
</template>
<style scoped>
.hander{
  width: 100%;
  height: 140px;
  background-image: url('https://kafashiji.oss-cn-beijing.aliyuncs.com/1681880694252.jpg');
  background-size: cover; /* 图片自适应容器 */
  background-position: center; /* 图片居中显示 */
  border-radius: 8px;
  margin-top: -70px;
}

.hover-card {
  /* 初始状态 */
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  transform: translateY(0);
  position: relative;
  border: 1px solid #f0f0f0; /* 可选：添加替代阴影的边框 */
  z-index: 1;
}

.hover-card:hover {
  /* 保持上浮效果 */
  transform: translateY(-6px);
  
  /* 移除阴影 */
  box-shadow: none;
  
  /* 提升悬停层级 */
  z-index: 2;
  
  /* 可选：悬停时加深边框 */
  border-color: #e0e0e0;
}
.videoup{
  width: 15px;
  height: 15px;
  margin-top: 5px;
  margin-left: -8px;
  float: left;
}
.card-stats{
  margin-top: 5px;
  font-size: 10px;
  margin-left: -8px;
  color: #899ab1;
}
.card-title{
  margin-top: 150px;
  font-size: 16px;
  margin-left: -8px;
}
.card{
  width: 310px;
  height: 220px;
  float: left;
  margin: 0 20px 20px 0;
  border-radius: 10px !important;
  padding: 0px ;
}
.card1{
  width: 285px;
  height: 220px;
  float: left;
  margin: 0 20px 20px 0;
  border-radius: 10px !important;
  padding: 0px ;
}
.el-carousel__item:nth-child(2n) {
  background-color: #99a9bf;
}

.el-carousel__item:nth-child(2n + 1) {
  background-color: #d3dce6;
}


.imgc{
  width: 250px;
  height: 160px;
  position: absolute;
  top: 0;
  left: 0;
}
.carousel-image{
  width: 724px;
  height: 462px;
  cursor: pointer;
  object-fit: cover !important;
}
.el-card:hover {
  transform: translateY(-10px);
}

.el-row:last-child {
  margin-bottom: 0;
}

.el-col {
  border-radius: 4px;
}

.grid-content {
  border-radius: 4px;
  min-height: 36px;
}

::-webkit-scrollbar {
  display: none;
}
</style>