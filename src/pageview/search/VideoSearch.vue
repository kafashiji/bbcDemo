<template>
  <div class="search-container">
    <!-- 加载状态 -->
    <div v-if="loading" class="loading-container">
      <el-progress :percentage="50" status="success" :indeterminate="true" />
    </div>

    <!-- 搜索结果 -->
    <div class="video-results">
      <div v-if="videos.length === 0" class="empty-state">
        <el-empty description="未找到相关视频" />
      </div>
  
    <!-- 修改为flex容器 -->
      <div class="cards-container">
        <CCcard 
          v-for="item in paginatedVideos" 
          :key="item.id"  
          :item="item"
          class="card hover-card" 
          @click="openVideoDetail(item)"
        ></CCcard>
      </div>
      <!-- 分页 -->
      <el-pagination
      v-model:current-page="currentPage"
      :page-size="pageSize"
      :total="totalVideos"
      :pager-count="7" 
      layout="prev, pager, next, jumper"
      background
      hide-on-single-page
      @current-change="handlePageChange"
    />
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'


// 路由参数处理
const route = useRoute()
const router = useRouter()
const searchQuery = ref(route.query.q || '')
const loading = ref(false)

// 分页参数
const currentPage = ref(1)
const pageSize = ref(20)


const videos = ref([])
const totalVideos = ref(0)

const paginatedVideos = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value;
  const end = start + pageSize.value;
  return videos.value.slice(start, end);
});

const openVideoDetail = (video) => {
  router.push({
    name: 'Video', // 使用命名路由
    params: { id: video.id },
    query: { from: 'home' }, // 可选查询参数
    // state: { videoData: video } // 通过state传递完整数据（可选）
  })
}
// 模拟数据

// 搜索逻辑（需替换为真实API）
const performSearch = async () => {
  try {
    loading.value = true
    // 模拟API调用
    await new Promise(resolve => setTimeout(resolve, 800))
    // 示例数据
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
    totalVideos.value = 48
  } finally {
    loading.value = false
  }
}

// 路由参数监听
watch(() => route.query.q, (newVal) => {
  if (newVal !== searchQuery.value) {
    searchQuery.value = newVal
    performSearch()
  }
})

// 初始化搜索
onMounted(() => {
  if (searchQuery.value) performSearch()
})

// 分页处理
const handlePageChange = (page) => {
  currentPage.value = page
  router.replace({
    query: { ...route.query, page }
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