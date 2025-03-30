<template>
  <div class="upload-container">
    <!-- 主要内容区域 -->
    <div class="content-wrapper">
      <!-- 预览状态（优先显示） -->
      <div v-if="videoUrl" class="preview-wrapper">
        <video :src="videoUrl" controls class="video-preview"></video>
        <button class="delete-button" @click="handleDelete">
          <TrashIcon class="icon" />
          删除视频
        </button>
      </div>

      <!-- 上传状态 -->
      <div 
        v-else
        class="upload-area"
        :class="{ 'drag-over': isDragging }"
        @dragover.prevent="handleDragOver"
        @dragleave="handleDragLeave"
        @drop.prevent="handleDrop"
        @click="triggerFileInput"
      >
        <!-- 文件输入和上传内容保持不变 -->
        <input
          ref="fileInput"
          type="file"
          accept="video/*"
          hidden
          @change="handleFileChange"
        />
        <div class="upload-content">
          <template v-if="!selectedFile">
            <UploadCloudIcon class="upload-icon" />
            <div class="instructions">
              <p class="drag-text">拖放视频文件到这里</p>
              <p class="click-text">或 <span>点击选择文件</span></p>
            </div>
          </template>
          
          <div v-else class="file-preview">
            <VideoIcon class="file-icon" />
            <div class="file-details">
              <p class="file-name">{{ selectedFile.name }}</p>
              <p class="file-size">{{ formatFileSize(selectedFile.size) }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 上传进度 -->
    <div v-if="isUploading" class="progress-container">
      <div 
        class="progress-bar"
        :style="{ width: `${uploadProgress}%` }"
      ></div>
      <span class="progress-text">{{ uploadProgress }}%</span>
    </div>

    <!-- 操作按钮 -->
    <div v-if="selectedFile && !isUploading && !videoUrl" class="action-buttons">
      <button class="confirm-button" @click="startUpload">开始上传</button>
      <button class="cancel-button" @click="clearSelection">取消</button>
    </div>

    <!-- 状态提示 -->
    <transition name="fade">
      <div v-if="errorMessage" class="status-message error">{{ errorMessage }}</div>
    </transition>
    <transition name="fade">
      <div v-if="uploadSuccess" class="status-message success">上传成功!</div>
    </transition>
  </div>
</template>

<script setup>
import { ref, watch} from 'vue'
import { UploadCloudIcon, TrashIcon, VideoIcon } from 'lucide-vue-next'

// 定义组件的 props
const props = defineProps({
  maxSize: {
    type: Number,
    default: 1024 * 1024 * 500 // 500MB，允许上传的最大文件大小
  },
  allowedTypes: {
    type: Array,
    default: () => ['video/mp4', 'video/webm', 'video/avi'] // 允许上传的文件类型
  },
  // 新增 existingVideo 属性，用于展示已存在的视频
  existingVideo: {
    type: String,
  },
})

// 定义组件的 emits
const emit = defineEmits(['video-deleted'])
const videoUrl = ref(props.existingVideo) // 初始化时使用现有视频

// 监听 existingVideo 属性的变化
watch(() => props.existingVideo, (newVal) => {
  if (newVal) {
    videoUrl.value = newVal // 当 existingVideo 变化时，更新 videoUrl
  }
})
// 响应式状态
const isDragging = ref(false) // 是否正在拖拽文件
const selectedFile = ref(null) // 用户选择的文件
const isUploading = ref(false) // 是否正在上传
const uploadProgress = ref(0) // 上传进度
const errorMessage = ref('') // 错误消息
const uploadSuccess = ref(false) // 上传是否成功
const fileInput = ref(null) // 文件输入框的 ref

// 文件选择处理函数
const handleFileChange = (e) => {
  const file = e.target.files[0] // 获取用户选择的文件
  validateFile(file) // 验证文件
}

// 文件验证函数
const validateFile = (file) => {
  errorMessage.value = '' // 清空错误消息
  
  if (!file) return // 如果没有选择文件，则返回

  // 类型验证
  if (!props.allowedTypes.includes(file.type)) {
    errorMessage.value = '不支持的文件格式' // 设置错误消息
    return false // 验证失败
  }

  // 大小验证
  if (file.size > props.maxSize) {
    errorMessage.value = `文件大小超过限制（最大 ${props.maxSize / 1024 / 1024}MB）` // 设置错误消息
    return false // 验证失败
  }

  selectedFile.value = file // 将选择的文件赋值给 selectedFile
  return true // 验证成功
}

// 拖拽处理函数
const handleDragOver = () => {
  isDragging.value = true // 设置 isDragging 为 true
}

const handleDragLeave = () => {
  isDragging.value = false // 设置 isDragging 为 false
}

// 文件拖放处理函数
const handleDrop = (e) => {
  isDragging.value = false // 设置 isDragging 为 false
  const file = e.dataTransfer.files[0] // 获取拖放的文件
  validateFile(file) // 验证文件
}

// 触发文件选择函数
const triggerFileInput = () => {
  fileInput.value.click() // 触发文件输入框的点击事件
}

// 开始上传函数
const startUpload = async () => {
  if (!selectedFile.value) return // 如果没有选择文件，则返回

  isUploading.value = true // 设置 isUploading 为 true
  errorMessage.value = '' // 清空错误消息
  uploadSuccess.value = false // 设置 uploadSuccess 为 false

  // 模拟上传过程
  const interval = setInterval(() => {
    if (uploadProgress.value < 95) {
      uploadProgress.value += 5 // 增加上传进度
    } else {
      clearInterval(interval) // 清除定时器
    }
  }, 200)

  // 模拟上传完成
  setTimeout(() => {
    clearInterval(interval) // 清除定时器
    uploadProgress.value = 100 // 设置上传进度为 100
    isUploading.value = false // 设置 isUploading 为 false
    uploadSuccess.value = true // 设置 uploadSuccess 为 true
    videoUrl.value = URL.createObjectURL(selectedFile.value) // 创建视频 URL
    
    // 3秒后隐藏成功提示
    setTimeout(() => {
      uploadSuccess.value = false // 隐藏成功提示
    }, 3000)
  }, 2500)
  videoUrl.value = 'new_uploaded_video_url' // 替换为实际URL
  emit('video-uploaded', videoUrl.value) // 通知父组件
}

// 删除视频函数
const handleDelete = () => {
  // 释放资源
  if (props.existingVideo) {
    // 如果存在服务器视频，通知父组件
    emit('video-deleted')
  } else {
    URL.revokeObjectURL(videoUrl.value)// 本地视频处理保持不变
  }
  // 重置状态
  videoUrl.value = null // 清空视频 URL
  selectedFile.value = null // 清空选择的文件
  uploadProgress.value = 0 // 重置上传进度
  errorMessage.value = '' // 清空错误消息
  
  // 重置文件输入
  if (fileInput.value) {
    fileInput.value.value = '' // 清空文件输入框的值
  }
}

// 取消选择函数
const clearSelection = () => {
  selectedFile.value = null // 清空选择的文件
  uploadProgress.value = 0 // 重置上传进度
  errorMessage.value = '' // 清空错误消息
}

// 文件大小格式化函数
const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes' // 如果文件大小为 0，则返回 0 Bytes
  const k = 1024 // 1KB = 1024 Bytes
  const sizes = ['Bytes', 'KB', 'MB', 'GB'] // 文件大小单位
  const i = Math.floor(Math.log(bytes) / Math.log(k)) // 计算文件大小单位的索引
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i] // 格式化文件大小
}
</script>

<style scoped>
.upload-container {
  max-width: 800px;
  margin: 2rem auto;
  padding: 20px;
  height: 200px;
  margin-left: -20px;
  margin-top: 0;
}

.content-wrapper {
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.upload-area {
  height: 200px;
  border: 2px dashed #cccccc;
  background-color: #f8f9fa;
  transition: all 0.3s ease;
  cursor: pointer;
  position: relative;
}

.drag-over {
  border-color: #2196F3;
  background-color: rgba(33, 150, 243, 0.1);
}

.upload-content {
  height: 200px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 5px 2rem 2rem 2rem;
  color: #666;
  
}

.upload-icon {
  width: 64px;
  height: 64px;
  color: #a0aec0;
  margin-bottom: 1.5rem;
}

.instructions {
  text-align: center;
}

.drag-text {
  font-size: 1.1rem;
  margin-bottom: 0.5rem;
}

.click-text span {
  color: #2196F3;
  font-weight: 500;
  cursor: pointer;
}

.file-preview {
  display: flex;
  align-items: center;
  gap: 1rem;
  width: 100%;
  padding: 1rem;
  background: #ffffff;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.file-icon {
  width: 48px;
  height: 48px;
  color: #4a5568;
}

.file-details {
  flex: 1;
}

.file-name {
  font-weight: 500;
  margin-bottom: 0.25rem;
}

.file-size {
  color: #718096;
  font-size: 0.9em;
}

.preview-wrapper {
  position: relative;
  height: 200px;
  background: #000000;
  
}

.video-preview {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.delete-button {
  position: absolute;
  top: 20px;
  
  right: 20px;
  padding: 8px 16px;
  background: rgba(255, 68, 68, 0.9);
  color: white;
  border: none;
  border-radius: 6px;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: background 0.2s;
}

.delete-button:hover {
  background: #ff4444;
}

.delete-button .icon {
  width: 18px;
  height: 18px;
  top: 0px;
}

.progress-container {
  margin-top: 1.5rem;
  height: 24px;
  background: #edf2f7;
  border-radius: 12px;
  overflow: hidden;
  position: relative;
}

.progress-bar {
  height: 100%;
  background: #2196F3;
  transition: width 0.3s ease;
}

.progress-text {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  color: white;
  font-size: 0.9em;
  font-weight: 500;
}

.action-buttons {
  margin-top: 1.5rem;
  display: flex;
  gap: 1rem;
  justify-content: center;
}

.confirm-button {
  background: #2196F3;
  color: white;
  padding: 10px 24px;
  border-radius: 6px;
  border: none;
  cursor: pointer;
  transition: background 0.2s;
}

.confirm-button:hover {
  background: #1976d2;
}

.cancel-button {
  background: #e2e8f0;
  color: #4a5568;
  padding: 10px 24px;
  border-radius: 6px;
  border: none;
  cursor: pointer;
  transition: background 0.2s;
}

.cancel-button:hover {
  background: #cbd5e0;
}

.status-message {
  margin-top: 1rem;
  padding: 10px;
  border-radius: 6px;
  text-align: center;
}

.error {
  background: #fff5f5;
  color: #c53030;
}

.success {
  background: #f0fff4;
  color: #2f855a;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>