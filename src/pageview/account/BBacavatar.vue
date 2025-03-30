<!-- 头像设置 -->
<!-- src/views/AvatarSettings.vue -->
<template>
  <div class="avatar-settings">
    
    <div class="avatar-uploader">
      <!-- Element Plus Upload 组件，用于上传头像 -->
        <!--  action 属性设置为 #，表示不自动上传到服务器 -->
        <!--  不显示文件列表 -->
        <!--  禁用自动上传 -->
        <!--  文件改变时的回调函数 -->
      <el-upload
        action="#"  
        :show-file-list="false"  
        :auto-upload="false"  
        :on-change="handleFileChange"  
      >
        <!-- 头像显示区域 -->
        <el-avatar :size="120" :src="previewAvatar || user.avatar" style="margin-left: 39px;"/>  <!--  显示头像，优先显示预览头像，如果没有则显示用户头像 -->
        <template #tip>
          <!-- 提示信息 -->
          <div class="upload-tip" >支持JPG/PNG格式，大小不超过2MB</div>
        </template>
      </el-upload>
      
      <!-- 确认修改按钮 -->
      <el-button 
        type="primary"  
        :loading="uploading"  
        @click="handleUpload"  
      >
      <!--  设置按钮类型为主要按钮 -->
      <!--  根据 uploading 状态显示加载动画 -->
      <!--  点击按钮时触发 handleUpload 方法 -->
        确认修改
      </el-button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { ElMessage } from 'element-plus';

// 定义 props，接收父组件传递的 user 对象
const props = defineProps(['user'])
// 定义 emits，用于触发父组件的 update-user 事件
const emit = defineEmits(['update-user'])

// 定义响应式变量 previewAvatar，用于存储预览头像的 URL
const previewAvatar = ref('')
// 定义响应式变量 uploading，用于表示是否正在上传
const uploading = ref(false)
// 定义变量 uploadFile，用于存储上传的文件
let uploadFile = null

// 文件改变时的回调函数
const handleFileChange = (file) => {
  // 检查文件类型是否为 JPG 或 PNG
  const isImage = ['image/jpeg', 'image/png'].includes(file.raw.type)
  // 检查文件大小是否小于 2MB
  const isLt2M = file.size / 1024 / 1024 < 2

  // 如果不是图片文件，则显示错误消息并返回
  if (!isImage) {
    ElMessage.error('只能上传图片文件')
    return
  }
  // 如果图片大小超过 2MB，则显示错误消息并返回
  if (!isLt2M) {
    ElMessage.error('图片大小不能超过2MB')
    return
  }
  // 创建预览头像的 URL
  previewAvatar.value = URL.createObjectURL(file.raw)
  // 存储上传的文件
  uploadFile = file.raw
}

// 上传头像的方法
const handleUpload = async () => {
  // 如果没有选择文件，则返回
  if (!uploadFile) return
  
  // 设置 uploading 为 true，显示加载动画
  uploading.value = true
  // 模拟上传
  setTimeout(() => {
    // 获取新的头像 URL
    const newAvatar = previewAvatar.value
    // 触发父组件的 update-user 事件，传递新的头像 URL
    emit('update-user', { avatar: newAvatar })
    // 设置 uploading 为 false，隐藏加载动画
    uploading.value = false
    // 显示成功消息
    ElMessage.success('头像更新成功')
  }, 1000)
}
</script>
<style scoped>
.avatar-settings {
  max-width: 600px;
  margin: 20px auto;
  padding: 30px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

.page-title {
  color: #2c3e50;
  text-align: center;
  margin-bottom: 30px;
  font-size: 24px;
  font-weight: 600;
}

.avatar-uploader {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 25px;
}

/* 上传区域悬停效果 */
.avatar-uploader :deep(.el-upload) {
  position: relative;
  cursor: pointer;
  transition: transform 0.3s ease;
}

.avatar-uploader :deep(.el-upload:hover) {
  transform: scale(1.05);
}

/* 头像边框动画 */
.avatar-uploader :deep(.el-avatar) {
  border: 2px solid #e6ebf5;
  transition: 
    border-color 0.3s ease,
    box-shadow 0.3s ease;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
}

.avatar-uploader :deep(.el-upload:hover .el-avatar) {
  border-color: #409eff;
  box-shadow: 0 4px 12px rgba(64, 158, 255, 0.2);
}

/* 提示文字样式 */
.upload-tip {
  color: #909399;
  font-size: 12px;
  margin-top: 10px;
  text-align: center;
}

/* 按钮样式优化 */
.el-button {
  width: 120px;
  transition: 
    background-color 0.3s ease,
    transform 0.2s ease;
}

.el-button:hover {
  transform: translateY(-2px);
}

/* 加载状态下的按钮 */
.el-button.is-loading {
  opacity: 0.8;
}
</style>