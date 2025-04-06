<template>
  <div class="common-layout">
    <div style="width: 1810px;margin: 0 auto;overflow: hidden;">
      <el-container>
        <el-container>
          <el-header class="accHeader" style="display: flex; align-items: center; gap: 15px;">
            <div class="accInfo">
              <div class="acctitle" >{{ filtedVideo.videoTitle }}</div>
              <div class="imfor">{{ filtedVideo.viewCount }}播放 · {{ filtedVideo.createdAt }}</div>
            </div>
          </el-header>
          <el-main>
            <VideoPlayer :src="filtedVideo.videoUrl" :mime-type="mimeType" :poster-url="p"/>
          </el-main>
          <el-footer></el-footer>
        </el-container>
        <el-aside width="300px">
          <div class="Accavatar" style="display: flex; align-items: center; gap: 10px;">
            <el-avatar :size="50" :src="filtedVideo.videoAvatar" />
            <div class="upID">{{ filtedVideo.videoAccName }}</div>
          </div>
          <!-- <div style="margin-top: 40px;">
           <CCcard :item="item" v-for="(item) in bcVideos.slice(0,25)" :key="item" class="card hover-card" @click="openVideoDetail(item)" ></CCcard>
          </div> -->
        </el-aside>
      </el-container>
    </div>
  </div>
</template>


<script setup>
import { ref, onMounted ,watch} from 'vue'
import CCcard from '@/components/CCcard.vue'
import VideoPlayer from '../components/pageVideo.vue'
import { defineProps } from 'vue'
import { useRouter } from 'vue-router'
import HYRequest from '../service/Request'  

const router = useRouter()
const filtedVideo = ref({ 
        userId: 11,
        videoUrl: "https://kafashiji.oss-cn-beijing.aliyuncs.com/1c0ffa2b-4cc3-4757-9bb1-68cc822ebbf3.mp4",
        createdAt: "2025-04-06T19:11:22",
        videoTitle: "sfsdfk",
        videoImg: "https://kafashiji.oss-cn-beijing.aliyuncs.com/f5005158-683d-47ef-b921-4cb54aa1cf9a.png",
        videoProfile: "dsafasd",
        viewCount: 0,
        videoAccName: "离散",
        videoAvatar: "https://kafashiji.oss-cn-beijing.aliyuncs.com/f26e9feb-520e-43d4-a56e-30d93c963118.jpg"
 // 初始空对象避免undefined
});
const videoId = ref(Number(router.currentRoute.value.params.id))
console.log(videoId.value)

const HisId = () => {
  HYRequest.get({url: `/video/${videoId.value}`,}).then(res =>{
    if(res.success){
      console.log("该视频的信息",res)
      filtedVideo.value=res.data
      console.log("该视频的信息",filtedVideo.value.videoTitle)// 数据更新会自动触发视图刷新
    }else{
      console.log('获取数据失败')
    }
  })
}
onMounted(() => {
  HisId()
});

watch(() => router.currentRoute.value.params.id, (newId) => {
  videoId.value = Number(newId);
  HisId();
});
// const bcVideos = ref([
//   // ...更多视频数据
// ])
// const openVideoDetail = (video) => {
//   router.push({
//     name: 'Video', // 确保路由配置中有这个名称
//     params: { id: video.id }, // 可选：通过状态传递完整数据
//   })
// }
// const bcinfo = ref({})
// onMounted(() => {
//   bcVideos.value = [
//     { upId: "kcc", id: 1001, title: 'Vue3教程', plays: '12万', date: '2小时前', img: 'https://kafashiji.oss-cn-beijing.aliyuncs.com/%E5%B1%8F%E5%B9%95%E6%88%AA%E5%9B%BE%202023-10-01%20011020.png' },
//     { upId: "kcc", id: 1002, title: 'TypeScript入门', plays: '8.5万', date: '1天前', img: 'https://kafashiji.oss-cn-beijing.aliyuncs.com/%E5%B1%8F%E5%B9%95%E6%88%AA%E5%9B%BE%202023-10-01%20011020.png' },
//     { upId: "kcc", id: 1003, title: 'React Hooks', plays: '5.2万', date: '3天前', img: 'https://kafashiji.oss-cn-beijing.aliyuncs.com/DHWL.png' },
//     { upId: "kcc", id: 1004, title: 'Webpack5教程', plays: '3.6万', date: '5天前', img: 'https://kafashiji.oss-cn-beijing.aliyuncs.com/%E5%B1%8F%E5%B9%95%E6%88%AA%E5%9B%BE%202023-10-01%20011020.png' },
//     { upId: "kcc", id: 1005, title: 'Node.js实战', plays: '1.2万', date: '1周前', img: 'https://kafashiji.oss-cn-beijing.aliyuncs.com/%E5%B1%8F%E5%B9%95%E6%88%AA%E5%9B%BE%202023-10-01%20011020.png' },
//     { upId: "kcc", id: 1006, title: 'Node.js实战', plays: '1.2万', date: '1周前', img: 'https://kafashiji.oss-cn-beijing.aliyuncs.com/%E5%B1%8F%E5%B9%95%E6%88%AA%E5%9B%BE%202023-10-01%20011020.png' },
//     { upId: "kcc", id: 1007, title: 'Node.js实战', plays: '1.2万', date: '1周前', img: 'https://kafashiji.oss-cn-beijing.aliyuncs.com/%E5%B1%8F%E5%B9%95%E6%88%AA%E5%9B%BE%202023-10-01%20011020.png' },
//     { upId: "kcc", id: 1008, title: 'Node.js实战', plays: '1.2万', date: '1周前', img: 'https://kafashiji.oss-cn-beijing.aliyuncs.com/%E5%B1%8F%E5%B9%95%E6%88%AA%E5%9B%BE%202023-10-01%20011020.png' },
//     { upId: "kcc", id: 1009, title: 'Node.js实战', plays: '1.2万', date: '1周前', img: 'https://kafashiji.oss-cn-beijing.aliyuncs.com/%E5%B1%8F%E5%B9%95%E6%88%AA%E5%9B%BE%202023-10-01%20011020.png' },
//     { upId: "kcc", id: 1010, title: 'Node.js实战', plays: '1.2万', date: '1周前', img: 'https://kafashiji.oss-cn-beijing.aliyuncs.com/%E5%B1%8F%E5%B9%95%E6%88%AA%E5%9B%BE%202023-10-01%20011020.png' },
//   ]
//   // 获取数据
//   updateVideoInfo()// fetchVideos()
// })
// const props = defineProps({
//   id: {
//     type: Number,
//     required: true
//   },
//   from: {
//     type: String,
//     default: 'unknown'
//   }
// });

// // 使用对象存储视频 URL
// const videoUrls = {
//   1001: 'https://kafashiji.oss-cn-beijing.aliyuncs.com/%E3%80%90P1%E3%80%91%E3%80%90%E7%B4%A0%E7%A5%A5%E8%AF%AF%E8%A7%A3%E5%90%91%E3%80%91%E5%8F%88%E5%B9%BB%E6%83%B3%E4%BA%86%EF%BC%8C%E5%B9%BB%E6%83%B3%E3%80%8C%E5%90%8E%E6%9D%A5%E7%9A%84%E6%88%91%E4%BB%AC%E3%80%8D%E8%83%BD%E5%9C%A8%E4%B8%80%E8%B5%B7.1.mp4',
//   1002: 'https://kafashiji.oss-cn-beijing.aliyuncs.com/%E3%80%90P1%E3%80%91%E2%9A%A1soyorin%E7%88%B1%E9%9F%B3%E6%9D%A5%E7%BB%99%E4%BD%A0%E6%B4%97%E8%84%91%E4%BA%86%E2%9A%A1.mp4',
//   1003: 'https://kafashiji.oss-cn-beijing.aliyuncs.com/%E3%80%90P1%E3%80%91%E6%88%91%E7%9A%84%E8%B4%A5%E7%8A%AC%E6%81%8B%E7%88%B1%E7%89%A9%E8%AF%AD%E6%9E%9C%E7%84%B6%E6%9C%89%E9%97%AE%E9%A2%98.mp4',
//   1004: 'https://kafashiji.oss-cn-beijing.aliyuncs.com/%E3%80%90P1%E3%80%91%5B%E9%9B%80%E9%AD%82%5D%E5%A5%BD%E6%B6%88%E6%81%AF%EF%BC%9A%E8%A6%81%E9%A3%9E%E4%BA%86%EF%BC%81%E5%9D%8F%E6%B6%88%E6%81%AF%EF%BC%9A%E7%9C%9F%E9%A3%9E%E4%BA%86%EF%BC%81%EF%BC%81%EF%BC%81.mp4',
//   1005: 'https://kafashiji.oss-cn-beijing.aliyuncs.com/%E3%80%90P1%E3%80%91%E3%80%8A%E5%A5%BD%E4%BA%86%EF%BC%8CB1%E3%80%8B.mp4',
//   1006: 'https://kafashiji.oss-cn-beijing.aliyuncs.com/%E3%80%90P1%E3%80%91%E3%80%90%E7%B4%A0%E7%A5%A5%E8%AF%AF%E8%A7%A3%E5%90%91%E3%80%91%E5%8F%88%E5%B9%BB%E6%83%B3%E4%BA%86%EF%BC%8C%E5%B9%BB%E6%83%B3%E3%80%8C%E5%90%8E%E6%9D%A5%E7%9A%84%E6%88%91%E4%BB%AC%E3%80%8D%E8%83%BD%E5%9C%A8%E4%B8%80%E8%B5%B7.1.mp4',
//   1007: 'https://kafashiji.oss-cn-beijing.aliyuncs.com/%E3%80%90P1%E3%80%91%E2%9A%A1soyorin%E7%88%B1%E9%9F%B3%E6%9D%A5%E7%BB%99%E4%BD%A0%E6%B4%97%E8%84%91%E4%BA%86%E2%9A%A1.mp4',
//   1008: 'https://kafashiji.oss-cn-beijing.aliyuncs.com/%E3%80%90P1%E3%80%91%E6%88%91%E7%9A%84%E8%B4%A5%E7%8A%AC%E6%81%8B%E7%88%B1%E7%89%A9%E8%AF%AD%E6%9E%9C%E7%84%B6%E6%9C%89%E9%97%AE%E9%A2%98.mp4',
//   1009: 'https://kafashiji.oss-cn-beijing.aliyuncs.com/%E3%80%90P1%E3%80%91%5B%E9%9B%80%E9%AD%82%5D%E5%A5%BD%E6%B6%88%E6%81%AF%EF%BC%9A%E8%A6%81%E9%A3%9E%E4%BA%86%EF%BC%81%E5%9D%8F%E6%B6%88%E6%81%AF%EF%BC%9A%E7%9C%9F%E9%A3%9E%E4%BA%86%EF%BC%81%EF%BC%81%EF%BC%81.mp4',
//   1010: 'https://kafashiji.oss-cn-beijing.aliyuncs.com/%E3%80%90P1%E3%80%91%E3%80%8A%E5%A5%BD%E4%BA%86%EF%BC%8CB1%E3%80%8B.mp4'
// }

// const videoUrl = ref('')
// const mimeType = ref('video/mp4') // 默认 MIME 类型
// // 从路由参数获取 videoId
// videoUrl.value = videoUrls[props.id]

// // console.log(videoUrl.value)
// // console.log(props.id)
// // console.log(bcinfo)
// watch(() => props.id, () => {
//   updateVideoInfo()
// })
// const updateVideoInfo = () => {
//   const videoId = Number(props.id) // 将id转为数字
//   bcinfo.value = bcVideos.value.find(item => item.id === videoId)
//   videoUrl.value = videoUrls[props.id] // 或使用 String(videoId) 如果键是数字
// }
</script>

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

.card{
  width: 250px;
  height: 220px;
  float: left;
  margin: 0 20px 20px 0;
  border-radius: 10px !important;
}
.upID {
  font-size: 24px;
  font-weight: 500;
  margin-top: -40px;
  margin-left: 10px;
}
.imfor {
  color: #999;
  font-size: 14px;
  margin-top: 2px;
}

.acctitle {
  font-size: 20px;
  font-weight: 500;
  margin-top: 20px;
}

.accInfo {
  display: flex;
  flex-direction: column;
  gap: 4px;
  margin-left: 90px;
}

.accHeader {
  height: 100px;
}

.Accavatar {
  margin-top: 28PX;
}

.container {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}

</style>