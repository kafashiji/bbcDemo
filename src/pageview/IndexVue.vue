<!--网站首页详情-->
<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import CCcard from '@/components/CCcard.vue'
// 模拟视频数据（实际应从接口获取）
const router = useRouter()
const videos = ref([

  // ...更多视频数据
])
const openVideoDetail = (video) => {
  router.push({
    name: 'Video', // 使用命名路由
    params: { id: video.id },
    query: { from: 'home' }, // 可选查询参数
    // state: { videoData: video } // 通过state传递完整数据（可选）
    
  })
}
onMounted(() => {
  videos.value = [
  { upId:"kcc",id: 1001, title: 'Vue3教程', plays: '12万', date: '2小时前' ,img:'https://kafashiji.oss-cn-beijing.aliyuncs.com/%E5%B1%8F%E5%B9%95%E6%88%AA%E5%9B%BE%202023-10-01%20011020.png'},
  { upId:"kcc",id: 1002, title: 'TypeScript入门', plays: '8.5万', date: '1天前', img:'https://kafashiji.oss-cn-beijing.aliyuncs.com/%E5%B1%8F%E5%B9%95%E6%88%AA%E5%9B%BE%202023-10-01%20011020.png' },
  { upId:"kcc",id: 1003, title: 'React Hooks', plays: '5.2万', date: '3天前', img:'https://kafashiji.oss-cn-beijing.aliyuncs.com/DHWL.png' },
  { upId:"kcc",id: 1004, title: 'Webpack5教程', plays: '3.6万', date: '5天前', img:'https://kafashiji.oss-cn-beijing.aliyuncs.com/%E5%B1%8F%E5%B9%95%E6%88%AA%E5%9B%BE%202023-10-01%20011020.png' },
  { upId:"kcc",id: 1005, title: 'Node.js实战', plays: '1.2万', date: '1周前', img:'https://kafashiji.oss-cn-beijing.aliyuncs.com/%E5%B1%8F%E5%B9%95%E6%88%AA%E5%9B%BE%202023-10-01%20011020.png' },
  { upId:"kcc",id: 1006, title: 'Node.js实战', plays: '1.2万', date: '1周前', img:'https://kafashiji.oss-cn-beijing.aliyuncs.com/%E5%B1%8F%E5%B9%95%E6%88%AA%E5%9B%BE%202023-10-01%20011020.png' },
  { upId:"kcc",id: 1007, title: 'Node.js实战', plays: '1.2万', date: '1周前', img:'https://kafashiji.oss-cn-beijing.aliyuncs.com/%E5%B1%8F%E5%B9%95%E6%88%AA%E5%9B%BE%202023-10-01%20011020.png' },
  { upId:"kcc",id: 1008, title: 'Node.js实战', plays: '1.2万', date: '1周前', img:'https://kafashiji.oss-cn-beijing.aliyuncs.com/%E5%B1%8F%E5%B9%95%E6%88%AA%E5%9B%BE%202023-10-01%20011020.png' },
  { upId:"kcc",id: 1009, title: 'Node.js实战', plays: '1.2万', date: '1周前', img:'https://kafashiji.oss-cn-beijing.aliyuncs.com/%E5%B1%8F%E5%B9%95%E6%88%AA%E5%9B%BE%202023-10-01%20011020.png' },
  { upId:"kcc",id: 1010, title: 'Node.js实战', plays: '1.2万', date: '1周前', img:'https://kafashiji.oss-cn-beijing.aliyuncs.com/%E5%B1%8F%E5%B9%95%E6%88%AA%E5%9B%BE%202023-10-01%20011020.png' },
]
  console.log(videos.value);
  // 获取数据
  // fetchVideos()
})

const carouselItems = ref([
  { id: 1, url: 'https://kafashiji.oss-cn-beijing.aliyuncs.com/a29b340b-d02c-499c-abd6-c4dc01cffbb6_base_resized(1).jpg' },
  { id: 2, url: 'https://kafashiji.oss-cn-beijing.aliyuncs.com/%E5%B1%8F%E5%B9%95%E6%88%AA%E5%9B%BE%202023-10-01%20011020.png' },
  { id: 3, url: 'https://kafashiji.oss-cn-beijing.aliyuncs.com/%E5%B1%8F%E5%B9%95%E6%88%AA%E5%9B%BE%202023-10-01%20011020.png' },
])


</script>
<template>
  <div style="width: 100%; margin: 0 auto;">
    <div style="width: 1380px;margin: 10px auto; overflow: hidden;">
                <!-- 轮播图 -->
      <div style="display: flex; width: 100%; justify-content: start;margin-bottom: 20px;">
        <!-- 轮播图和视频排版-->
        <div style="margin-right: 20px;">
          <el-carousel height="462px" style="width: 524px;" v-if="carouselItems.length > 0">
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
          <template v-for="( _ , index) in 2" :key="index">
            <el-row :gutter="20" class="card-row">
              <el-col v-for="(item, index) in videos.slice((index)*3, (index+1)*3)" :key="index" :span="4.8" class="card-col">
                <el-card shadow="hover">
                  <div class="card-info">
                    <el-image class="imgc" :src="item.img"/>
                    <div class="card-title">{{item.title}}</div>
                    <svg  xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 24 24" width="24" height="24" fill="currentColor" class="videoup"><!--[--><path d="M6.15 8.24805C6.5642 8.24805 6.9 8.58383 6.9 8.99805L6.9 12.7741C6.9 13.5881 7.55988 14.248 8.3739 14.248C9.18791 14.248 9.8478 13.5881 9.8478 12.7741L9.8478 8.99805C9.8478 8.58383 10.1836 8.24805 10.5978 8.24805C11.012 8.24805 11.3478 8.58383 11.3478 8.99805L11.3478 12.7741C11.3478 14.41655 10.01635 15.748 8.3739 15.748C6.73146 15.748 5.4 14.41655 5.4 12.7741L5.4 8.99805C5.4 8.58383 5.73578 8.24805 6.15 8.24805z" fill="currentColor"></path><path d="M12.6522 8.99805C12.6522 8.58383 12.98795 8.24805 13.4022 8.24805L15.725 8.24805C17.31285 8.24805 18.6 9.53522 18.6 11.123C18.6 12.71085 17.31285 13.998 15.725 13.998L14.1522 13.998L14.1522 14.998C14.1522 15.4122 13.8164 15.748 13.4022 15.748C12.98795 15.748 12.6522 15.4122 12.6522 14.998L12.6522 8.99805zM14.1522 12.498L15.725 12.498C16.4844 12.498 17.1 11.8824 17.1 11.123C17.1 10.36365 16.4844 9.74804 15.725 9.74804L14.1522 9.74804L14.1522 12.498z" fill="currentColor"></path><path d="M12 4.99805C9.48178 4.99805 7.283 5.12616 5.73089 5.25202C4.65221 5.33949 3.81611 6.16352 3.72 7.23254C3.60607 8.4998 3.5 10.171 3.5 11.998C3.5 13.8251 3.60607 15.4963 3.72 16.76355C3.81611 17.83255 4.65221 18.6566 5.73089 18.7441C7.283 18.8699 9.48178 18.998 12 18.998C14.5185 18.998 16.7174 18.8699 18.2696 18.74405C19.3481 18.65655 20.184 17.8328 20.2801 16.76405C20.394 15.4973 20.5 13.82645 20.5 11.998C20.5 10.16965 20.394 8.49877 20.2801 7.23205C20.184 6.1633 19.3481 5.33952 18.2696 5.25205C16.7174 5.12618 14.5185 4.99805 12 4.99805zM5.60965 3.75693C7.19232 3.62859 9.43258 3.49805 12 3.49805C14.5677 3.49805 16.8081 3.62861 18.3908 3.75696C20.1881 3.90272 21.6118 5.29278 21.7741 7.09773C21.8909 8.3969 22 10.11405 22 11.998C22 13.88205 21.8909 15.5992 21.7741 16.8984C21.6118 18.7033 20.1881 20.09335 18.3908 20.23915C16.8081 20.3675 14.5677 20.498 12 20.498C9.43258 20.498 7.19232 20.3675 5.60965 20.2392C3.81206 20.0934 2.38831 18.70295 2.22603 16.8979C2.10918 15.5982 2 13.8808 2 11.998C2 10.1153 2.10918 8.39787 2.22603 7.09823C2.38831 5.29312 3.81206 3.90269 5.60965 3.75693z" fill="currentColor"></path><!--]--></svg>
                    <div class="card-stats">
                      {{item.upId}} {{item.plays}}播放 · {{item.date}}
                    </div>
                  </div>
                </el-card>
              </el-col>
            </el-row>
          </template>
        </div>
      </div>
      <!-- 视频列表2 -->
      <div >
        <CCcard :item="item" v-for="(item) in videos.slice(0,25)" :key="item" class="card hover-card"  @click="openVideoDetail(item)" ></CCcard>
      </div>
    </div>
  </div>
</template>
<style scoped>
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
  width: 250px;
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

.el-row {
  margin-bottom: 20px;
}

.el-card {
  width: 250px;
  height: 220px;
  float: left;
  position: relative;
}
.imgc{
  width: 250px;
  height: 160px;
  position: absolute;
  top: 0;
  left: 0;
}
.carousel-image{
  width: 524px;
  height: 462px;
  cursor: pointer;
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