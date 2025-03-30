<template>
  <div class="video-upload-page">
    <!-- 上传表单 -->
    <form @submit.prevent="handleSubmit" class="upload-form">
      <div class="form-columns">
        <!-- 左侧：视频封面上传 -->
        <div class="form-left">
          <div class="cover-upload">
            <!-- 封面预览 -->
            <img :src="form.thumbnail" class="cover-preview" alt="" />
            <!-- 上传封面按钮 -->
            <label class="upload-label">
              <input
                type="file"
                accept="image/*"
                @change="handleCoverUpload"
                hidden
              />
              上传封面
            </label>
            <!-- 封面尺寸提示 -->
            <p class="upload-tip">建议尺寸：1280×720px</p>
          </div>
        </div>

        <!-- 右侧：表单字段 -->
        <div class="form-right">
          <!-- 视频标题 -->
          <div class="form-group">
            <label>视频标题 <span class="required">*</span></label>
            <input
              v-model="form.title"
              type="text"
              required
              placeholder="请输入视频标题"
              style="width: 90%;"
            />
          </div>

          <!-- 视频文件上传 -->
          <div class="form-group">
            <label>视频上传</label>
                <Uploeder
                @video-uploaded="handleVideoUploaded"
                @video-deleted="handleVideoDeleted"
                ></Uploeder>
          </div>

          <!-- 视频简介 -->
          <div class="form-group">
            <label>视频简介</label>
            <textarea
              v-model="form.description"
              rows="4"
              placeholder="请输入视频描述..."
              maxlength="300"
              style="resize: none !important;width: 90%;"
            ></textarea>
            <!-- 字数统计 -->
            <div class="char-count">{{ form.description.length }}/300</div>
          </div>

          <!-- 标签管理 -->
          <div class="form-group">
            <label>内容标签</label>
            <div class="tags-input">
              <!-- 循环渲染已添加的标签 -->
              <span
                v-for="(tag, index) in form.tags"
                :key="index"
                class="tag"
                
              >
                {{ tag }}
                <!-- 移除标签按钮 -->
                <button type="button" @click="removeTag(index)">×</button>
              </span>
              <!-- 新增标签输入框 -->
              <input
                type="text"
                v-model="newTag"
                placeholder="输入标签后按回车"
                @keydown.enter.prevent="addTag"
                style="margin-top: -3px;"
              />
            </div>
          </div>
        </div>
      </div>

      <!-- 操作按钮 -->
      <div class="form-actions">
        <!-- 重置按钮 -->
        <button type="button" class="cancel-btn" @click="resetForm">重置</button>
        <!-- 提交按钮 -->
        <button type="submit" class="submit-btn">提交</button>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue';
import  Uploeder from '@/pageview/platform/BBvcUpload.vue';

// 表单数据
const form = reactive({
  title: '',
  videoFile: null,
  description: '',
  tags: [],
  thumbnail: ''
});

// 新增标签
const newTag = ref('');

// 处理封面上传
const handleCoverUpload = (e) => {
  const file = e.target.files[0];
  if (file && file.type.startsWith('image/')) {
    const reader = new FileReader();
    reader.onload = (e) => {
      form.thumbnail = e.target.result;
    };
    reader.readAsDataURL(file);
  }
};

// 处理视频上传
const handleVideoUpload = (e) => {
  const file = e.target.files[0];
  if (file && file.type.startsWith('video/')) {
    form.videoFile = file;
  }
};

// 添加标签
const addTag = () => {
  const tag = newTag.value.trim();
  if (tag && !form.tags.includes(tag)) {
    form.tags.push(tag);
    newTag.value = '';
  }
};

// 移除标签
const removeTag = (index) => {
  form.tags.splice(index, 1);
};

// 重置表单
const resetForm = () => {
  form.title = '';
  form.videoFile = null;
  form.description = '';
  form.tags = [];
  form.thumbnail = '';
  newTag.value = '';
};

// 处理表单提交
const handleSubmit = () => {
  const formData = new FormData();
  formData.append('title', form.title);
  formData.append('videoFile', form.videoFile);
  formData.append('description', form.description);
  formData.append('tags', form.tags.join(','));
  formData.append('thumbnail', form.thumbnail);

  // 这里可以添加将 formData 发送到服务器的逻辑
  console.log('Form Data:', Object.fromEntries(formData.entries()));
  alert('视频上传成功！');
  resetForm();
};
</script>

<style scoped>
/* 基础样式 */
.video-upload-page {
  max-width: 800px;
  margin: 2rem auto;
  padding: 0 32px;
  color: #1a1a1a;
}

h1 {
  font-size: 24px;
  font-weight: 600;
  margin-bottom: 2rem;
}

/* 上传表单 */
.upload-form {
  background: white;
  border-radius: 16px;
  box-shadow: 0 8px 32px rgba(0,0,0,0.1);
  padding: 24px;
}

.form-columns {
  display: grid;
  grid-template-columns: 240px 1fr;
  gap: 32px;
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

/* 操作按钮 */
.form-actions {
  display: flex;
  gap: 12px;
  justify-content: flex-end;
  padding: 20px 0;
  border-top: 1px solid #eee;
}

.cancel-btn,
.submit-btn {
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

.submit-btn {
  background: #2196f3;
  color: white;
}

.submit-btn:hover {
  background: #1976d2;
}
</style>