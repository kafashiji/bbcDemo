<script setup>
import  Uploeder from '@/pageview/platform/BBvcUpload.vue';
import { ref, reactive, computed } from 'vue';
import HYRequest from '../../service/Request'
import router from '@/router';
import {
  PlayIcon,
  Trash2Icon,
  EditIcon,
  PackageOpenIcon,
  ChevronDownIcon,
  CheckIcon
} from 'lucide-vue-next';

const searchKeyword = ref('');// 响应式状态：搜索关键词
const videoToDelete = ref(null);// 响应式状态：待删除的视频对象
const editingVideo = ref(null);// 响应式状态：正在编辑的视频对象
const newTag = ref('');// 响应式状态：新的标签
const sortBy = ref('uploadTime');// 响应式状态：当前排序方式
const isSortDropdownOpen = ref(false);// 响应式状态：排序下拉菜单是否打开
const storedData = JSON.parse(localStorage.getItem('user'))// 从本地存储中获取用户数据
const filteredVideo1 = ref([])// 响应式状态：视频列表
const editForm = reactive({
  title: '',
  videoUrl: '',
  description: '',
  tags: [],
  thumbnail: '',
  uid: null
});// 响应式状态：编辑表单数据




// 响应式状态：视频列表
const sortOptions = [
  { value: 'uploadTime', label: '最新上传' },
  { value: 'name', label: '名称排序' },
  { value: 'views', label: '播放量' },
];

// 计算属性：当前排序方式的标签
const currentSortLabel = computed(() => {
  return sortOptions.find(opt => opt.value === sortBy.value)?.label || '排序方式';
});

// 计算属性：过滤后的视频列表

const filteredVideo =() => {
  HYRequest.get({url: `/user/${storedData.id}/videos/search?keyword=${searchKeyword.value}`,}).then(res =>{
    if(res.success){
      console.log("关键词",searchKeyword.value)
      console.log("部分",res.data)
      filteredVideo1.value = res.data
      console.log("过滤后的视频列表",filteredVideo1.value);
    }else{
      console.log("没有数据")
    }
  })
}
filteredVideo()

// 计算属性：排序后的视频列表
const sortedVideos = computed(() => {
  return [...filteredVideo1.value].sort((a, b) => {
    switch (sortBy.value) {
      case 'name': return a.videoTitle.localeCompare(b.videoTitle);
      case 'views': return b.viewCount - a.viewCount;
      default: return new Date(b.createdAt) - new Date(a.createdAt);
    }
  });
});

// 方法：处理排序方式改变
const handleSortChange = (value) => {
  sortBy.value = value;
  isSortDropdownOpen.value = false;
};

// 方法：格式化日期
const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  });
};


//----------------------------------------------------------------------------------------------------------------------------------------

// 方法：播放视频
const playVideo = (video) => {
  console.log('播放视频:', video.title);
};

// 方法：打开编辑模态框
const openEditModal = (video) => {
  editingVideo.value = video;
  Object.assign(editForm, {
    title: video.videoTitle,
    videoUrl: video.videoUrl,
    description: video.videoProfile,
    tags: Array.isArray(video.videoTag) ? [...video.videoTag] : [],
    thumbnail: video.videoImg,
    uid: video.id
  });
  console.log("编辑视频", editForm.tags);
};

// 方法：处理封面上传
const fee = ref(null)
const handleCoverUpload = (e) => {
  const file = e.target.files[0];
  console.log(file);
  if (file && file.type.startsWith('image/')) {
    fee.value = file
    console.log("fee",fee.value)
    const reader = new FileReader();
    reader.onload = (e) => {
      editForm.thumbnail = e.target.result;
    };
    reader.readAsDataURL(file); 
  }
};

// 方法：处理视频上传成功后的回调
const handleVideoUploaded = (newUrl) => {
  if (editingVideo.value) {
    editingVideo.value.videoUrl = newUrl;
    editForm.videoUrl = newUrl;
  }
};

// 处理视频删除成功后的回调
const handleVideoDeleted = () => {
  if (editingVideo.value) {
    editingVideo.value.videoUrl = '';
    editForm.videoUrl = '';
  }
};

// 方法：添加标签
const addTag = () => {
  const tag = newTag.value.trim();
  if (tag && !editForm.tags.includes(tag)) {
    editForm.tags.push(tag);
    newTag.value = '';
  }
};

// 方法：移除标签
const removeTag = (index) => {
  editForm.tags.splice(index, 1);
};

// 方法：保存视频更改
const handleVideo = (videoURL) => {
  if(videoURL == null){
    editForm.videoUrl = editingVideo.value.videoUrl;
    console.log('url:', editForm.videoUrl);
    return  editForm.videoUrl
  }else{
    editForm.videoUrl = videoURL;
    console.log('url:', editForm.videoUrl);
    return  editForm.videoUrl
  }
}

// 方法：保存视频更改
const saveVideoChanges = async () => {
  try {
    // 参数校验：必须要有视频URL（可以是原有或新上传的）
    if (!editForm.videoUrl) {
      ElMessage.warning("请先上传视频文件");
      return;
    }
    const formData = new FormData();
    formData.append('file', fee.value);
    if (fee.value) {
      HYRequest.post({
      url: '/upload',
      headers: { 'Content-Type': 'application/json' },
      data: formData
    }).then(res => {
      console.log("res", res)
      if(res == null){
        ElMessage.warning("上传失败")
      }else{
        console.log("封面图片上传成功", res)
        console.log("当前视频id",editingVideo.value.id)
        // 发送更新请求
        HYRequest.put({
          url: `/video/${editingVideo.value.id}`,
          headers: { 'Content-Type': 'application/json' },
          params: {
                "videoTitle": editForm.title,
                "videoProfile": editForm.description,
                "videoImg": res,
                "videoUrl":editForm.videoUrl,
              }
            }).then(
              ElMessage.success("更新成功"),
              filteredVideo()
            )
      }
    });
    }else{
      // 发送更新请求
      HYRequest.put({
        url: `/video/${editingVideo.value.id}`,
        headers: { 'Content-Type': 'application/json' },
        params: {
              "videoTitle": editForm.title,
              "videoProfile": editForm.description,
              "videoImg": editingVideo.value.videoImg,
              "videoUrl":editForm.videoUrl,
            }
          }).then(res => {
            if(res.success){
              console.log("更新视频成功", res)
              ElMessage.success("更新成功")
              filteredVideo()
            }
          }

            
          )
    }

    // 处理封面图片上传

  } catch (err) {
    console.error("保存失败:", err);
    ElMessage.error("更新失败，请检查网络连接");
  }
};

// 方法：关闭编辑模态框
const closeEditModal = () => {
  editingVideo.value = null;
  newTag.value = '';
};

// 方法：确认删除视频
const confirmDelete = (video) => {
  videoToDelete.value = video;
};


// 方法：删除视频
const deleteVideo = () => {
  /**
   * 过滤 videos 数组，移除指定 ID 的视频。
   * 删除后将 videoToDelete 值设置为 null。
   */
  HYRequest.put({
    url: `/video/${videoToDelete.value.id}`,
    params: {
      "videoDelete": 0
    }
  }).then(res => {
    console.log("删除视频", res)
    if(!res.success){
      ElMessage.warning("删除失败")
      setTimeout(() => {
        router.push('/plaform');
      }, 3000);
    }else{
      ElMessage.success("删除成功")
      videoToDelete.value = null;
      filteredVideo()
    }
  })
};
</script>

<template>
  <div class="video-manager">
    <!-- 头部：视频管理标题、搜索框和排序选择 -->
    <div class="header">
      <!-- 视频管理标题，显示过滤后的视频数量 -->
      <h1>视频管理 ({{ filteredVideo1.length }})</h1>
      <div class="controls">
        <!-- 搜索框 -->
        <input
          v-model.lazy.trim="searchKeyword"
          type="text"
          placeholder="搜索视频..."
          class="search-input"
          @keyup.enter="filteredVideo"
        />

        <!-- 排序下拉菜单 -->
        <div class="sort-dropdown">
          <!-- 排序按钮，点击打开/关闭下拉菜单 -->
          <button
            class="dropdown-trigger"
            @click="isSortDropdownOpen = !isSortDropdownOpen"
          >
            <!-- 显示当前排序方式的标签 -->
            {{ currentSortLabel }}
            <!-- 向下箭头图标 -->
            <chevron-down-icon :size="16" class="ml-2" />
          </button>

          <!-- 下拉菜单内容 -->
          <div
            v-if="isSortDropdownOpen"
            class="dropdown-menu"
            v-click-outside="() => isSortDropdownOpen = false"
          >
            <!-- 循环渲染排序选项 -->
            <div
              v-for="option in sortOptions"
              :key="option.value"
              class="dropdown-item"
              :class="{ active: sortBy === option.value }"
              @click="handleSortChange(option.value)"
            >
              <!-- 排序选项标签 -->
              {{ option.label }}
              <!-- 如果当前选项被选中，显示选中图标 -->
              <check-icon
                v-if="sortBy === option.value"
                :size="16"
                class="ml-auto"
              />
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 视频列表：如果存在视频则展示视频网格，否则展示空状态 -->
    <div v-if="filteredVideo1.length > 0" class="video-grid">
      <!-- 循环渲染视频卡片 -->
      <div
        v-for="video in sortedVideos"
        :key="video.id"
        class="video-card"
      >
        <!-- 视频缩略图，点击播放视频 -->
        <div class="thumbnail" @click="playVideo(video)">
          <!-- 视频缩略图图片 -->
          <img :src="video.videoImg" :alt="video.title" class="thumbnail-img" />
          <!-- 鼠标悬停时的遮罩层，显示播放图标 -->
          <div class="hover-overlay">
            <play-icon :size="48" class="play-icon" />
          </div>
        </div>

        <!-- 视频信息 -->
        <div class="video-info">
          <!-- 视频标题 -->
          <h3 class="video-title">{{ video.videoTitle }}</h3>

          <!-- 视频元信息：播放量和上传日期 -->
          <div class="meta">
            <!-- 播放量 -->
            <span class="views">{{ video.viewCount }} 次播放</span>
            <!-- 上传日期 -->
            <span class="date">{{ formatDate(video.createdAt) }}</span>
          </div>

          <!-- 视频标签：展示视频相关的标签 -->
          <!-- <div class="tags">
            
            <span v-for="tag in video.videoTag" :key="tag" class="tag">{{ tag }}</span>
          </div> -->
        </div>

        <!-- 视频操作：编辑和删除按钮 -->
        <div class="video-actions">
          <!-- 编辑按钮，点击打开编辑模态框 -->
          <button @click.stop="openEditModal(video)" class="action-btn">
            <edit-icon :size="18" />
          </button>
          <!-- 删除按钮，点击弹出删除确认对话框 -->
          <button @click.stop="confirmDelete(video)" class="action-btn delete-btn">
            <trash2-icon :size="18" />
          </button>
        </div>
      </div>
    </div>

    <!-- 空状态：当没有视频时显示 -->
    <div v-else class="empty-state">
      <!-- 空状态图标 -->
      <package-open-icon :size="64" class="empty-icon" />
      <!-- 空状态提示文字 -->
      <p>暂无视频内容</p>
    </div>

    <!-- 编辑模态框：用于编辑视频信息 -->
    <div v-if="editingVideo" class="edit-modal" @click.self="closeEditModal">
      <div class="edit-content">


        <form @submit.prevent="saveVideoChanges">
          <div class="edit-columns">
            <!-- 左侧：封面编辑 -->
            <div class="edit-left">
              <div class="cover-upload">
                <!-- 封面预览 -->
                <img :src="editForm.thumbnail" class="cover-preview" alt="封面" />
                <!-- 更换封面按钮 -->
                <label class="upload-label">
                  <input
                    type="file"
                    accept="image/*"
                    @change="handleCoverUpload"
                    hidden
                  />
                  更换封面
                </label>
                <!-- 封面尺寸提示 -->
                <p class="upload-tip">建议尺寸：1280×720px</p>
              </div>
            </div>

            <!-- 右侧：表单字段 -->
            <div class="edit-right">
              <!-- 标题 -->
              <div class="form-group">
                <label>视频标题 <span class="required">*</span></label>
                <input
                  v-model="editForm.title"
                  type="text"
                  required
                  placeholder="请输入视频标题"
                  style="width: 90%;"
                />
              </div>


              <div class="form-group">
                <label>视频上传</label>
                <Uploeder
                :existingVideo="editingVideo?.videoUrl"  
                @video-deleted="handleVideoDeleted"
                @video-uploaded="handleVideoUploaded"
                @videoURL="handleVideo"
                ></Uploeder>
              </div>

              <!-- 简介 -->
              <div class="form-group">
                <label>视频简介</label>
                <textarea
                  v-model="editForm.description"
                  rows="4"
                  placeholder="请输入视频描述..."
                  maxlength="300"
                  style="resize: none !important;width: 90%;"
                ></textarea>
                <!-- 字数统计 -->
                <div class="char-count">{{ (editForm.description || '').length }}/300</div>
              </div>

              <!-- 标签管理 -->
              <!-- <div class="form-group">
                <label>内容标签</label>
                <div class="tags-input">
                  
                  <span
                    v-for="(tag, index) in editForm.tags"
                    :key="index"
                    class="tag"
                  >
                    {{ tag }}
                    
                    <button type="button" @click="removeTag(index)">×</button>
                  </span>
                  
                  <input
                    type="text"
                    v-model="newTag"
                    placeholder="输入标签后按回车"
                    @keydown.enter.prevent="addTag"
                    style="margin-top: -3px;"
                  />
                </div>
              </div> -->
            </div>
          </div>

          <!-- 操作按钮 -->
          <div class="form-actions">
            <!-- 取消按钮，关闭编辑模态框 -->
            <button type="button" class="cancel-btn" @click="closeEditModal">取消</button>
            <!-- 保存按钮，保存视频更改 -->
            <button type="submit" class="save-btn">保存更改</button>
          </div>
        </form>
      </div>
    </div>

    <!-- 删除确认对话框：在删除视频前进行确认 -->
    <div v-if="videoToDelete" class="confirm-dialog">
      <div class="dialog-content">
        <!-- 确认删除标题 -->
        <h3>确认删除视频？</h3>
        <!-- 确认删除内容，显示视频标题 -->
        <p>《{{ videoToDelete.videoTitle }}》将被永久删除</p>
        <div class="dialog-actions">
          <!-- 取消按钮，关闭对话框 -->
          <button @click="videoToDelete = null" class="cancel-btn">取消</button>
          <!-- 确认删除按钮，执行删除操作 -->
          <button @click="deleteVideo" class="confirm-btn">确认删除</button>
        </div>
      </div>
    </div>
  </div>
</template>



<style scoped>

/* 基础样式 */
.video-manager {
  max-width: 1200px;
  margin: 2rem auto;
  padding: 0 32px;
  color: #1a1a1a;
}

/* 头部 */
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  padding: 16px 0;
  border-bottom: 1px solid #eee;
}

h1 {
  font-size: 24px;
  font-weight: 600;
  margin: 0;
}

/* 控制栏 */
.controls {
  display: flex;
  gap: 16px;
  align-items: center;
}

.search-input {
  padding: 10px 16px;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  width: 280px;
  font-size: 14px;
  transition: all 0.2s;
  background: #f8f9fa;
}

.search-input:focus {
  outline: none;
  border-color: #2196f3;
  box-shadow: 0 0 0 3px rgba(33, 150, 243, 0.1);
}

/* 排序下拉 */
.sort-dropdown {
  position: relative;
  user-select: none;
}

.dropdown-trigger {
  display: flex;
  align-items: center;
  padding: 8px 16px;
  background: white;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s;
  min-width: 120px;
  justify-content: space-between;
}

.dropdown-trigger:hover {
  border-color: #2196f3;
}

.dropdown-menu {
  position: absolute;
  top: calc(100% + 8px);
  right: 0;
  width: 100%;
  background: white;
  border: 1px solid #f0f0f0;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  z-index: 100;
  overflow: hidden;
}

.dropdown-item {
  display: flex;
  align-items: center;
  padding: 12px 16px;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s;
}

.dropdown-item:hover {
  background: #f8f9fa;
}

.dropdown-item.active {
  font-weight: 500;
  color: #2196f3;
  background: #f5fbff;
}

/* 视频网格 */
.video-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 32px;
}

.video-card {
  background: white;
  border-radius: 12px;
  box-shadow: 0 3px 12px rgba(0,0,0,0.08);
  overflow: hidden;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}

.video-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 6px 16px rgba(0,0,0,0.12);
}

/* 缩略图 */
.thumbnail {
  position: relative;
  aspect-ratio: 16/9;
  background: #f8f9fa;
  overflow: hidden;
}

.thumbnail-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s;
}

.video-card:hover .thumbnail-img {
  transform: scale(1.03);
}

.hover-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0,0,0,0.5);
  opacity: 0;
  transition: opacity 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
}

.thumbnail:hover .hover-overlay {
  opacity: 1;
}

.play-icon {
  color: rgba(255,255,255,0.9);
  filter: drop-shadow(0 2px 4px rgba(0,0,0,0.2));
}

/* 视频信息 */
.video-info {
  padding: 15px 20px 5px 20px;
}

.video-title {
  margin: 0 0 12px;
  font-size: 16px;
  font-weight: 600;
  line-height: 1.3;
}

.meta {
  display: flex;
  justify-content: space-between;
  color: #666;
  font-size: 12px;
  margin-bottom: 14px;
}

.tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-left: -5px;
  height: 28px;
}

.tag {
  background: #f0f2f5;
  color: #666;
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 12px;
  transition: all 0.2s;
}

/* 操作按钮 */
.video-actions {
  display: flex;
  gap: 8px;
  padding: 12px 20px;
  border-top: 1px solid #f0f0f0;
  background: #fafafa;
}

.action-btn {
  padding: 8px;
  border: none;
  background: none;
  cursor: pointer;
  color: #666;
  border-radius: 6px;
  transition: all 0.2s;
}

.action-btn:hover {
  background: #f0f0f0;
  color: #2196f3;
}

.delete-btn:hover {
  color: #ff4444;
}

/* 编辑模态框 */
.edit-modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0,0,0,0.4);
  display: flex;
  justify-content: center;
  align-items: center;
  backdrop-filter: blur(2px);
}

.edit-content {
  background: white;
  width: 800px;
  border-radius: 16px;
  box-shadow: 0 8px 32px rgba(0,0,0,0.2);
  overflow: hidden;
}

.edit-columns {
  display: grid;
  grid-template-columns: 240px 1fr;
  gap: 32px;
  padding: 24px;
}

/* 封面上传 */
.cover-upload {
  border: 2px dashed #e0e0e0;
  border-radius: 12px;
  padding: 24px;
  text-align: center;
  transition: border-color 0.2s;
}

.cover-upload:hover {
  border-color: #2196f3;
}

.cover-preview {
  width: 100%;
  height: 160px;
  object-fit: cover;
  border-radius: 8px;
  margin-bottom: 16px;
  background: #f8f9fa;
}

.upload-label {
  display: inline-block;
  padding: 8px 20px;
  background: #f0f2f5;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s;
  font-size: 14px;
}

.upload-label:hover {
  background: #e4e6eb;
}

.upload-tip {
  color: #999;
  font-size: 12px;
  margin: 10px 0 0;
}

/* 表单元素 */
.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  font-weight: 500;
  font-size: 14px;
  color: #333;
}

.form-group input,
.form-group textarea {
  width: 100%;
  padding: 10px 14px;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  font-size: 14px;
  transition: all 0.2s;
}

.form-group input:focus,
.form-group textarea:focus {
  outline: none;
  border-color: #2196f3;
  box-shadow: 0 0 0 3px rgba(33, 150, 243, 0.1);
}

.char-count {
  text-align: right;
  color: #999;
  font-size: 12px;
  margin-top: 4px;
}

/* 标签输入 */
.tags-input {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  padding: 8px;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  height: 24px;
  width: 93%;
}

.tags-input .tag {
  background: #e9ecef;
  padding: 6px 12px;
  border-radius: 20px;
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
}

.tags-input .tag button {
  background: none;
  border: none;
  color: #666;
  cursor: pointer;
  padding: 0;
  margin-left: 4px;
}

.tags-input input {
  border: none;
  padding: 8px;
  flex: 1;
  min-width: 100px;
  font-size: 14px;
}

/* 按钮 */
.form-actions {
  display: flex;
  gap: 12px;
  justify-content: flex-end;
  padding: 20px 24px;
  border-top: 1px solid #eee;
}

.cancel-btn,
.save-btn {
  padding: 10px 28px;
  border-radius: 8px;
  font-weight: 500;
  transition: all 0.2s;
  border: none;
  cursor: pointer;
}

.cancel-btn {
  background: #f8f9fa;
  color: #666;
}

.cancel-btn:hover {
  background: #f0f2f5;
}

.save-btn {
  background: #2196f3;
  color: white;
}

.save-btn:hover {
  background: #1976d2;
}

/* 空状态 */
.empty-state {
  text-align: center;
  padding: 80px 0;
  color: #666;
}

.empty-icon {
  color: #bdbdbd;
  margin-bottom: 20px;
}

/* 删除确认对话框 */
.confirm-dialog {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  backdrop-filter: blur(3px);
}

.dialog-content {
  background: white;
  border-radius: 16px;
  padding: 32px;
  width: 400px;
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.2);
}

.dialog-content h3 {
  margin: 0 0 12px;
  font-size: 20px;
}

.dialog-content p {
  margin: 0 0 28px;
  color: #666;
}

.dialog-actions {
  display: flex;
  gap: 12px;
  justify-content: flex-end;
}

.confirm-btn {
  padding: 10px 28px;
  border-radius: 8px;
  font-weight: 500;
  transition: all 0.2s;
  border: none;
  cursor: pointer;
  background: #ff4444;
  color: white;
}

.confirm-btn:hover {
  background: #ff3333;
}

/* 动画 */
@keyframes dialog-fade-in {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes dialog-scale-in {
  from { transform: scale(0.95); }
  to { transform: scale(1); }
}
</style>