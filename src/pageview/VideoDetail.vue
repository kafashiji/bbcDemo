<template>
  <div v-if="filtedVideo">
    <div class="common-layout">
      <div class="container">

        <div class="accInfo">
          <div class="acctitle">{{ filtedVideo.videoTitle }}</div>
          <div class="imfor">{{ formatViewCount(filtedVideo.viewCount) }}点击 · {{ formatTimeAgo(filtedVideo.createdAt) }}
          </div>
        </div>


          <VideoPlayer :src="filtedVideo.videoUrl" :mime-type="mimeType" :poster-url="p" :key="filtedVideo.videoUrl"/>

          <div class="triplet" style="display: flex; justify-content: start; padding: 20px 0;height: 30px; box-shadow: 0px 1px 3px  rgba(1, 1, 1, 0.1);">

            <div  class="Like" style="height: 40px;width: 180px; display: flex;align-items: center;" :class="{ 'active': myLike.videoLike === 1 }"  @click="addLike" >
              <img src="../assets/Liked.png" alt=""
                style="width: 30px; height: 30px; margin-left: 30px;margin-right: 5px;" />
              <div class="likeCount" style="height: 20px;font-size: 19px;color:  #ACAAAA;"> 
                {{formatViewCount(likeVideo.length) }}
              </div>
            </div>

            <div  class="Collect" style="height: 40px; display: flex;align-items: center;margin-left: 20px;" :class="{ 'active': myCollect.collect === 1 }" @click="addCollect">

              <img src="../assets/Collect​.svg" alt=""
                style="width: 30px; height: 30px; margin-left: 30px;margin-right: 5px;" />
              <div class="likeCount" style="height: 20px;font-size: 19px;color:  #ACAAAA;"> 
                {{formatViewCount(collectVideo.length) }}
              </div>
            </div>
          </div>


        <div style="border-bottom:1px #e3e5e7 solid; padding-bottom: 20px;">
          <div ref="contentEl" class="des" :style="{
            marginTop: '20px',
            height: hihtlll ? 'auto' : '40px',
            overflow: hihtlll ? 'visible' : 'hidden',
            fontSize: '17px',
            lineHeight: '25px',
            color: '#6d6e70'
          }">
            {{ filtedVideo.videoProfile }}
          </div>

          <div v-show="showToggle" @click="hihtlll = !hihtlll" style="color: #3891cc; margin-top: 3px;">
            {{ hihtlll ? '收起' : '展开' }}
          </div>
        </div>

        <div style="display: flex;">
          <div style="font-size: 25px;margin-bottom: 10px;">评论</div>
          <div style="color: #9499a0;margin: 7px 30px 0px 6px;">{{ comment.length }}</div>
        </div>
        <div style="display: flex; justify-content:space-between; width: 100%;">
          <div style="width: 10%">
            <el-avatar :size="80" :src="storedData.avatarUrl" Lazy/>
          </div>

          <div style="width: 90%">
            <textarea v-model="publishtext.description" rows="3" placeholder="请输入评论" maxlength="200"
              style="resize: none !important;"></textarea>
            <div style="display: flex; justify-content: space-between;width: 100%;">
              <div class="confirm-btn" @click="publish" >发表评论</div>
              <div class="char-count">{{ publishtext.description.length }}/200</div>
            </div>
          </div>
        </div>
        

        
        <div class="comment" style="margin-top: 15px;display: flex;padding: 10px;border-bottom:1px #e3e5e7 solid;"
          v-for="item in sortedVideos" :key="item" v-memo="[item.id]">
          <el-avatar :size="60" :src="item.avatar" style="margin-left: 70px;" lazy/>
          <div style="width: 80%;">
            <div style="color: #138dbd;margin-left: 10px;">{{ item.userName }}</div>
            <div style="min-height: 20px; padding: 10px;color: #18191C;font-size: 15px;line-height: 21px;">{{
              item.comment }}</div>
            <div style="font-size: 13px;color: #9499a0;margin-left: 13px;">{{ formatTimeAgo(item.timestamp) }}</div>
          </div>
        </div>

      </div>

      <div class="aside">

        <div class="Accavatar" style="display: flex; align-items: center; gap: 10px;">
          <el-avatar :size="50" :src="filtedVideo.videoAvatar" Lazy/>
          <div class="upID">{{ filtedVideo.videoAccName }}</div>
        </div>

        <div style="margin-top: 40px;">

          <CCcard :item="item" v-for="(item) in filtedVideo1" :key="item" class="card hover-card"
            @click="openVideoDetail(item)" >
          </CCcard>

        </div>

      </div>
    </div>

  </div>
</template>


<script setup>
import { ref, onMounted, watch ,computed ,onBeforeUnmount,shallowRef} from 'vue'
import CCcard from '@/components/CCcard.vue'
import VideoPlayer from '../components/pageVideo.vue'
import { useRouter } from 'vue-router'
import HYRequest from '../service/Request'


// 使用shallowRef替代ref减少深度监听（适用于复杂对象）
const filtedVideo = shallowRef({});
// 使用readonly包裹不需要修改的响应式数据
const storedData = ref(JSON.parse(localStorage.getItem('user')));
const router = useRouter()
const contentEl = ref();      // 获取DOM元素    // 展开状态
const showToggle = ref(false);
const hihtlll = ref(false);
const text = ref()
const videoId = ref(Number(router.currentRoute.value.params.id))
const publishtext = ref({
  description: ''
})
const republishtext = ref({
  description: ''
})
const myCollect =ref({})
const myLike =ref({})
const comment = ref([
  {
    id: 0,
    userId: "0",
    comment: null,
    timestamp: null,
    userName: null,
    avatar: null,
    videoId: 0
  }
])
const filtedVideo1 = ref([
  {
    userId: 0,
    videoUrl: "",
    createdAt: "",
    videoTitle: "",
    videoImg: "",
    videoProfile: "",
    viewCount: 0,
    videoAccName: "",
    videoAvatar: ""
    // 初始空对象避免undefined
  }
]);//up的视频
const collectVideo = ref([])
const likeVideo = ref([])


const publish = () => {
  const content = publishtext.value.description;
  console.log("fas",content)
  // 空白评论验证
  if (content.trim() === '') {
    ElMessage.warning('评论内容不能为空!');
    publishtext.value.description=republishtext.value.description
    return;
  }
  if (content.length > 0 && content[0] === ' ') {
    ElMessage.warning('评论内容不能为空!');
    return;
  }
  HYRequest.post({
    url:"/comment",
    data:{
      "userId": storedData.value.id,
      "comment": content,
      "userName": storedData.value.accName,
      "avatar": storedData.value.avatarUrl,
      "videoId": videoId.value
    }
  }).then(res => {
            if (res.success) {
              fatchComments()
              ElMessage.success("已发布")
              publishtext.value.description=republishtext.value.description
            }else{
              ElMessage.warning(res.errorMsg)
            }
          })// 数据更新会自动触发视图刷新
}

function debounce(func, delay = 300) {
  let timeoutId;
  return function(...args) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      func.apply(this, args);
    }, delay);
  };
}
const addLike =() =>{
  debouncedSubmitLike()
}
const submitLike =() =>{
  
  HYRequest.put({
    url: '/updateLike',
    data:{
      "userId": storedData.value.id,
      "videoId": videoId.value,
    }
  }).then(res =>{
    console.log(res.data[0])
        if(res.data[0].videoLike == 1){
          console.log(res.data)
          ElMessage.success("点赞")
          myLike.value.videoLike = res.data[0].videoLike;       // 重新获取视频详情数据
          likeVideo.value=res.data[1]
          console.log(likeVideo.value.length) 
        }
        if(res.data[0].videoLike == 0){
          ElMessage.success("点赞已取消")
          myLike.value.videoLike = res.data[0].videoLike;       // 重新获取视频详情数据
          likeVideo.value=res.data[1]
          console.log(likeVideo.value.length)
        }
      })
}
const debouncedSubmitLike = debounce(submitLike);

const addCollect =() =>{
  debouncedSubmitCollect()
}
const submitCollect =() =>{
  const storedData = ref(JSON.parse(localStorage.getItem('user')))
  console.log(storedData.value.id)
  HYRequest.put({
        url: '/updateCollect',
        data: {
          "userId": storedData.value.id,
          "videoId": videoId.value,
          "createdAt": filtedVideo.value.createdAt,
          "videoTitle": filtedVideo.value.videoTitle,
          "videoImg": filtedVideo.value.videoImg,
          "viewCount": filtedVideo.value.viewCount,
          "videoAccName": filtedVideo.value.videoAccName,
          "avatar": filtedVideo.value.videoAvatar,
          "videoUrl": filtedVideo.value.videoUrl,
          "videoProfile": filtedVideo.value.videoProfile,
          "videoDelete": 1,
          "collect": 0 // 默认头像URL
        }
      }).then(res =>{
        console.log("收藏状态",res)
        if(res.data[0].collect == 1){
          console.log("收藏状态",res.data[0])
          ElMessage.success("已收藏")
          // filtedVideo.value = res.data
          myCollect.value.collect = res.data[0].collect;
          collectVideo.value = res.data[1]       // 重新获取视频详情数据
          // fatchCollect(); 
        }
        if(res.data[0].collect == 0){
          ElMessage.success("收藏取消")
          myCollect.value.collect = res.data[0].collect;
          collectVideo.value = res.data[1]       // 重新获取视频详情数据
          // fatchCollect(); 
        }
      })
}
const debouncedSubmitCollect = debounce(submitCollect);
// 检测内容高度
const checkContentHeight = () => {
  if (text.value.length) {
    // 获取内容的实际高度（包括padding）
    const contentHeight = text.value.length;
    showToggle.value = contentHeight > 150 ? contentHeight : null;

  }
  console.log('first', text.value)
};
watch(() => checkContentHeight);
const formatTimeAgo = (dateString) => {
  const now = new Date();
  const createdAt = new Date(dateString);
  const timeDiff = now - createdAt;

  // 1. 处理小于1分钟的情况
  if (timeDiff < 60 * 1000) return '刚刚';

  // 2. 处理分钟级（1-59分钟）
  const minutesDiff = Math.floor(timeDiff / (60 * 1000));
  if (minutesDiff < 60) return `${minutesDiff}分钟前`;

  // 3. 处理小时级（1-23小时）
  const hoursDiff = Math.floor(minutesDiff / 60);
  if (hoursDiff < 24) return `${hoursDiff}小时前`;

  // 4. 处理天级（1-6天）
  const daysDiff = Math.floor(hoursDiff / 24);
  if (daysDiff < 7) return `${daysDiff}天前`;

  // 5. 处理整周情况（精确匹配7天）
  if (daysDiff === 7) return '一周前';

  // 6. 处理跨年判断（精确到日期的年变化）
  const isOverYear = new Date(createdAt.getTime()) > 
    new Date(now.getFullYear() - 1, now.getMonth(), now.getDate() + 1);

  // 7. 超过一年显示完整年月日
  if (!isOverYear) {
    const year = createdAt.getFullYear();
    const month = createdAt.getMonth() + 1;
    const date = createdAt.getDate();
    return `${year}年${month}月${date}日`;
  }

  // 8. 处理月日格式（当年内超过一周）
  const month = createdAt.getMonth() + 1;
  const date = createdAt.getDate();
  return `${month}月${date}日`;
};
const formatViewCount = (count) => {
  const num = Number(count)
  if (num >= 10000) {
    const converted = (num / 10000).toFixed(1)
    // 处理 1.0万 显示为 1万
    return converted.replace(/\.0$/, '') + '万'
  }
  return num.toString()
}
const openVideoDetail = (video) => {
  router.push({
    name: 'Video', // 确保路由配置中有这个名称
    params: { id: video.id }, // 可选：通过状态传递完整数据
  })
}

const HisId = () => {
  HYRequest.get({ url: `/video/${videoId.value}`, }).then(res => {
    if (res.success) {
      console.log("该视频的信息", res)
      filtedVideo.value = res.data
      text.value = filtedVideo.value.videoProfile
      checkContentHeight()
      fatchasidevideo()
      // nowVideoCollect()
      // nowVideoLike()
    } else {
      console.log('获取数据失败')
    }
  })
}
const addViewCount = () => {
  const currentVideoId = videoId.value // 捕获当前videoId
  HYRequest.get({
    url: `/addcount/${currentVideoId}`
  }).then(res => {
    // 只有当响应成功且videoId未变化时才更新
    if (res.success && videoId.value === currentVideoId) {
      HisId()
    }
  }).catch(error => {
    console.error('Error adding view count:', error)
  })
}

const fatchComments =() => {


          HYRequest.get({ url: `/comment/${videoId.value}`, }).then(res => {
            if (res.success) {
              comment.value = res.data
              console.log("评论", comment.value)
            }
          }) // 数据更新会自动触发视图刷新

}

const fatchasidevideo =()=>{
    HYRequest.get({ url: `/user/${filtedVideo.value.userId}/videos/search`, }).then(res => {
        if (res.success) {
          filtedVideo1.value = res.data
          } else {
          console.log('获取数据失败')
        }
      })
}
const fatchCollect=()=>{
  HYRequest.get({ url: `/collectVideo/${videoId.value}`, }).then(res =>{
    collectVideo.value=res.data
    console.log("收藏数", res)
  })
}
const fatchLike=()=>{
  HYRequest.get({ url: `/likeVideo/${videoId.value}`, }).then(res =>{
    likeVideo.value=res.data
    console.log("点赞数", res)
  })
}

const nowVideoLike =() =>{
  const storedData = ref(JSON.parse(localStorage.getItem('user')));
  HYRequest.get({
    url:'/LikeVideo',
    params: {  // 使用params传递
      userId: storedData.value.id,
      videoId: videoId.value 
    }
  }).then(res=>{
    myLike.value.videoLike=res.data.videoLike
    console.log("cscsc",myLike.value.videoLike)
  })
}
const nowVideoCollect =() =>{
  const storedData = ref(JSON.parse(localStorage.getItem('user')));
  HYRequest.get({
    url:'/collectVideo',
    params: {  // 使用params传递
      userId: storedData.value.id,
      videoId: videoId.value 
    }
  }).then(res=>{
    myCollect.value.collect=res.data.collect
  })
}

watch(() => router.currentRoute.value.params.id, (newId) => {
  videoId.value = Number(newId)
  fatchLike()
  nowVideoCollect()
  nowVideoLike()
  fatchComments()
  fatchCollect()
  addViewCount() // 路由变化时触发观看次数增加
})
const sortedVideos = computed(() => {
  return [...comment.value].sort((a, b) => {
      return new Date(b.timestamp) - new Date(a.timestamp);
  })
})
// 组件卸载时清理缓存
onBeforeUnmount(() => {
  filtedVideo.value = null;
});

onMounted(() => {
  fatchLike()
  nowVideoCollect()
  nowVideoLike()
  fatchComments()// 数据更新会自动触发视图刷新
  fatchCollect()
  addViewCount()
})
</script>

<style scoped>
/* 激活状态样式 */
.Like.active {
  /* 父容器添加过渡效果 */
  transition: all 0.3s;
}

/* 所有子元素变蓝 */
.Like.active * {
  color: #2196F3 !important;  /* 覆盖文字颜色 */
}

/* SVG 图标变色方案 */
.Like.active img {
  /* 蓝色滤镜（精确匹配 #2196F3） */
  filter: invert(50%) sepia(90%) saturate(3000%) hue-rotate(200deg);

}
.Collect.active {
  /* 父容器添加过渡效果 */
  transition: all 0.3s;
}

/* 所有子元素变蓝 */
.Collect.active * {
  color: #2196F3 !important;  /* 覆盖文字颜色 */
}

/* SVG 图标变色方案 */
.Collect.active img {
  /* 蓝色滤镜（精确匹配 #2196F3） */
  filter: invert(50%) sepia(90%) saturate(3000%) hue-rotate(200deg);
  
  /* 可选方案：直接更换 SVG 源文件 */
  /* content: url('../assets/Collect-active.svg'); */
}

.char-count {
  color: #999;
  font-size: 14px;
  margin-top: 4px;
}

textarea {
  width: 97%;
  padding: 10px 14px;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  font-size: 14px;
  transition: all 0.2s;
  line-height: 20px;
  background-color: #f1f2f3;
  color: #18191c;
}

textarea:focus {
  outline: none;
  border-color: #2196f3;
  box-shadow: 0 0 0 3px rgba(33, 150, 243, 0.1);
}

.confirm-btn {
  text-align: center;
  line-height: 40px;
  border-radius: 5px;
  transition: all 0.2s;
  border: none;
  cursor: pointer;
  background: #3891cc;
  color: white;
  height: 40px;
  width: 10%;
  margin-top: 10px;
}

.confirm-btn:hover {
  background: #3b6492;
}

.common-layout {
  width: 1760px;
  margin: 0 auto;
  overflow: hidden;
  display: flex;
  justify-content: space-between;
}

.container {
  width: 60%;
  margin: 0 auto;
  padding: 20px;
  background: #fff;
  border-radius: 12px;
}

.aside {
  width: 20%;
  margin-left: 20px;
  padding: 20px;
  background: #fff;
  border-radius: 12px;

}

.hover-card {
  /* 初始状态 */
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  transform: translateY(0);
  position: relative;
  border: 1px solid #f0f0f0;
  /* 可选：添加替代阴影的边框 */
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

.card {
  width: 300px;
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
  color: #138dbd;
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
  height: 100px;
}


.Accavatar {
  margin-top: 28PX;
}
/* 确保 Video.js 控件样式 */
</style>