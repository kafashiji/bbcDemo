<template>
  <div class="search-container">
    <!-- 加载状态 -->
    <div v-if="loading" class="loading-container">
      <el-progress :percentage="50" status="success" :indeterminate="true" />
    </div>

    <!-- 搜索结果 -->
    <div class="video-results">
      <div v-if="videos1.length === 0" class="empty-state">
        <el-empty description="未找到相关视频" />
      </div>
  
    <!-- 修改为flex容器 -->
      <div class="cards-container">
        <CCcard 
          v-for="item in videos1" 
          :key="item"  
          :item="item"
          class="card hover-card" 
          @click="openVideoDetail(item)"
        ></CCcard>
      </div>
      <!-- 分页 -->
      <el-pagination
        v-model:current-page="currentPage"
        :page-size="pageSize"
        :total="videos1.length"
        :pager-count="7" 
        layout="prev, pager, next, jumper"
        background
        hide-on-single-page
        @current-change="handlePageChange"
      />
    </div>
  </div>
  <LoginDialog ref="loginDialog" />
  <RegisterV ref="registerV" />
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import HYRequest from '../../service/Request.js'
import LoginDialog from '../login/loginV.vue'
import RegisterV from '../login/registerV.vue'

// 路由参数处理
const loginDialog = ref(null)
const registerV = ref(null)
const route = useRoute()
const router = useRouter()
const searchQuery = computed(() => route.query.q || '');
const loading = ref(false)
const totalpage = ref({})
// 分页参数
const currentPage = ref(1)
const pageSize = ref(25)

const videos1 = ref([])


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


const performSearch1 =() =>{
  console.log(searchQuery.value)
  HYRequest.get({
    url: "/searchVideoTop",
    params:{
      keyword:searchQuery.value
    }
  }).then(res=>{
    totalpage.value=res.totalPages
    videos1.value = res.content
    console.log("搜索结果",videos1.value.length)
  })
}
// 路由参数监听
watch(() => route.query.q, () => {

    performSearch1()

})

// 初始化搜索
onMounted(() => {
  if (searchQuery.value) performSearch1()
})

// 分页处理
const handlePageChange = (page) => {
  currentPage.value = page
  console.log("1",currentPage.value)
  HYRequest.get({
    url: "/searchVideoTop",
    params:{
      keyword:searchQuery.value,
      page:currentPage.value
    }
  }).then(res=>{
    videos1.value = res.content
    console.log("搜索结果2",videos1.value.length)
  })
}
</script>

<style scoped>
.search-container{
  width: 1380px;
  height: 1000px;
  
  margin: 0px auto;
  margin-top: 50px;
}
/* 新增flex容器样式 */
.cards-container {
  display: flex;
  flex-wrap: wrap;
  gap: 20px; /* 卡片间距 */
  justify-content: flex-start;
}

/* 修改卡片样式 */
.card {
  flex: 0 0 calc(20% - 16px); /* 5列布局计算 */
  height: 220px;
  border-radius: 10px !important;
  box-sizing: border-box; /* 确保尺寸计算准确 */
  margin: 0 !important; /* 移除原有margin */
}

/* 响应式适配 */
@media (max-width: 1200px) {
  .card {
    flex: 0 0 calc(25% - 15px); /* 屏幕变小时显示4列 */
  }
}

@media (max-width: 992px) {
  .card {
    flex: 0 0 calc(33.33% - 13px); /* 显示3列 */
  }
}

@media (max-width: 768px) {
  .card {
    flex: 0 0 calc(50% - 10px); /* 显示2列 */
  }
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
</style>