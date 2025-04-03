<!-- src/views/ProfileInfo.vue -->
<template>
  <div class="profile-info">
    <h2 class="page-title">个人信息</h2>
    
    <el-form :model="form" label-width="100px">
      <el-form-item label="用户ID" label-width="100px">
        <el-input v-model="form.id" disabled style="width: 150px;"/>
      </el-form-item>
      
      <el-form-item label="昵称">
        <el-input v-model="form.accName" style="width: 200px;"/>
      </el-form-item>
      
      <el-form-item label="我的签名">
        <el-input 
          v-model="form.signature" 
          type="textarea"
          class="signature-input"
          placeholder="请输入个性签名"
          style="height: 100px;"/>
      </el-form-item>
      
      <el-form-item>
        <el-button type="primary" @click="handleSubmit">保存修改</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script setup>
import {reactive} from 'vue'
import HYRequest from '../../service/Request'

const storedData = JSON.parse(localStorage.getItem('user'))
const form = reactive(storedData)

const handleSubmit = () => {
  console.log(form);
  
  HYRequest.put({
  url: `/bbc_account/${form.id}` ,
  params: {
    "signature": form.signature,
    "AccName": form.accName,
  }}).then(res => {
    console.log("res", res)
    if(!res.success){
      ElMessage.warning(res.errorMsg)
    }else{
      localStorage.setItem('user', JSON.stringify(res.data))
      ElMessage.success("修改成功")
    }
  })
}
</script>

<style scoped>
/* 签名输入框专属样式 */
.signature-input :deep(.el-textarea__inner) {
  color: #999;
  vertical-align: top;
  white-space: pre-wrap;
  word-wrap: break-word;
  line-height: 1.6;
  padding: 12px 15px;
  /* 禁止调整大小 */
  resize: none !important;
  /* 固定高度 */
  height: 100px;
  /* 添加滚动条 */
  overflow-y: auto;
}

/* 修改placeholder颜色 */
.signature-input :deep(.el-textarea__inner)::placeholder {
  color: #c0c4cc;
}

/* 聚焦状态样式 */
.signature-input :deep(.el-textarea.is-focus .el-textarea__inner) {
  box-shadow: 0 0 0 1px var(--el-color-primary) inset;
}
.profile-info {
  max-width: 800px;
  margin: 20px auto;
  padding: 30px;
  background: #fff;
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

/* 表单容器优化 */
.el-form {
  padding: 20px;
}

/* 表单项间距优化 */
.el-form-item {
  margin-bottom: 24px;
}

/* 输入框动效 */
.el-input {
  transition: 
    border-color 0.3s ease,
    box-shadow 0.3s ease;
}

.el-input:hover :deep(.el-input__wrapper) {
  box-shadow: 0 0 0 1px var(--el-color-primary) !important;
}

/* 多行输入框样式 */
.el-textarea :deep(.el-textarea__inner) {
  min-height: 100px;
  resize: vertical;
  line-height: 1.5;
  padding: 12px;
}

/* 按钮容器定位 */
.el-form-item:last-child {
  margin-top: 36px;
  display: flex;
  justify-content: flex-end;
}

/* 按钮动效 */
.el-button {
  padding: 12px 36px;
  transition: 
    transform 0.2s ease,
    box-shadow 0.3s ease;
}

.el-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(64, 158, 255, 0.3);
}

/* 响应式优化 */
@media (max-width: 768px) {
  .profile-info {
    margin: 10px;
    padding: 20px;
  }
  
  .el-form {
    padding: 10px;
  }
  
  .el-input {
    width: 100% !important;
  }
}

/* 禁用状态样式优化 */
.el-input.is-disabled :deep(.el-input__wrapper) {
  background-color: #f5f7fa;
  opacity: 0.8;
}
</style>