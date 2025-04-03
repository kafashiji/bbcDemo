<!-- src/views/AccountSecurity.vue -->
<template>
  <div class="account-security">

    <el-form :model="form" label-width="100px">
      <el-form-item label="原密码" style="margin-left: -60px;">
        <el-input v-model="form.oldPassword" show-password style="width: 200px;" />
      </el-form-item>
      <el-form-item label="新密码" style="margin-left: -60px;">
        <el-input v-model="form.newPassword" show-password style="width: 200px;" />
      </el-form-item>

      <el-form-item label="确认密码" style="margin-left: -60px;">
        <el-input v-model="form.confirmPassword" show-password style="width: 200px;" />
      </el-form-item>

      <el-form-item style="margin-left: -45px;">
        <el-button type="primary" @click="handleSubmit">修改密码</el-button>
      </el-form-item>
    </el-form>

  </div>
</template>

<script setup>
import { reactive } from 'vue'
import HYRequest from '../../service/Request'

const storedData = JSON.parse(localStorage.getItem('user'))
const form = reactive({
  'oldPassword': '',
  'newPassword': '',
  'confirmPassword': ''
})


const handleSubmit = () => {
  if (form.newPassword !== form.confirmPassword) {
    ElMessage.error('两次输入密码不一致')
    return
  }
  else if(storedData.password == form.oldPassword){
    HYRequest.put({
      url: `/bbc_account/${storedData.id}` ,
      params: {
        "password": form.confirmPassword,
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
  else{
    ElMessage.warning("旧密码错误")
  }
}
</script>

<style scoped>
.account-security {
  max-width: 800px;
  margin: 20px auto;
  padding: 30px;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  display: flex;
  align-items: center;
  /* 垂直居中 */
  justify-content: center;
  /* 水平居中 */
}

.page-title {
  color: #2c3e50;
  text-align: center;
  margin-bottom: 30px;
  font-size: 24px;
  font-weight: 600;
}

.el-form {
  padding: 20px;
  margin-top: 20px;
}

.el-form-item {
  margin-bottom: 28px;
}

/* 密码输入框动效 */
.el-input :deep(.el-input__wrapper) {
  transition:
    border-color 0.3s ease,
    box-shadow 0.3s ease;
}

.el-input:hover :deep(.el-input__wrapper) {
  box-shadow: 0 0 0 1px var(--el-color-primary) !important;
}

/* 按钮容器定位 */
.el-form-item:last-child {
  margin-top: 40px;
  display: flex;
  justify-content: center;
}

/* 按钮动效 */
.el-button {
  padding: 12px 48px;
  font-size: 16px;
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
  .account-security {
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

/* 密码强度提示（可选） */
.password-tip {
  color: #909399;
  font-size: 12px;
  margin-top: 8px;
}
</style>