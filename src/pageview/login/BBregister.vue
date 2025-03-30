<template>
  <div class="register-container">
    <div class="login-box">
      <div class="animated-logo">
        <img src="https://kafashiji.oss-cn-beijing.aliyuncs.com/BB.ico" alt="">
      </div>
      
      <el-form 
        :model="form" 
        :rules="rules" 
        ref="registerForm"
        class="login-form"
      >
        <el-form-item prop="username">
          <el-input
            v-model="form.username"
            placeholder="用户名"
            prefix-icon="User"
            size="large"
          />
        </el-form-item>

        <el-form-item prop="email">
          <el-input
            v-model="form.email"
            placeholder="邮箱"
            prefix-icon="Message"
            size="large"
          />
        </el-form-item>

        <el-form-item prop="password">
          <el-input
            v-model="form.password"
            type="password"
            placeholder="密码"
            prefix-icon="Lock"
            size="large"
            show-password
          />
        </el-form-item>

        <el-form-item prop="confirmPassword">
          <el-input
            v-model="form.confirmPassword"
            type="password"
            placeholder="确认密码"
            prefix-icon="Lock"
            size="large"
            show-password
          />
        </el-form-item>

        <div>
          <el-button
            type="primary"
            size="large"
            class="login-btn"
            @click="handlerRegister"
            :loading="loading"
          >
            注册
          </el-button>
        </div>

        <div class="register-link">
          已有账号？
          <router-link to="/login">去登录</router-link>
        </div>

      </el-form>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'

import { useRouter } from 'vue-router'

const router =useRouter()

const form = reactive({
  username: '',
  email: '',
  password: '',
  confirmPassword: ''
})

const validatePass2 = (rule, value, callback) => {
  if (value !== form.password) {
    callback(new Error('两次输入密码不一致!'))
  } else {
    callback()
  }
}

const rules = reactive({
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { min: 3, max: 12, message: '长度在 3 到 12 个字符', trigger: 'blur' }
  ],
  email: [
    { required: true, message: '请输入邮箱地址', trigger: 'blur' },
    { type: 'email', message: '请输入正确的邮箱地址', trigger: ['blur', 'change'] }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, max: 18, message: '长度在 6 到 18 个字符', trigger: 'blur' }
  ],
  confirmPassword: [
    { required: true, message: '请再次输入密码', trigger: 'blur' },
    { validator: validatePass2, trigger: 'blur' }
  ]
})
const registerForm =ref(null)

const loading = ref(false)

const handlerRegister = () => {
registerForm.value.validate((vaild)=>{
  if(vaild){
    loading.value = true
  // 模拟注册请求（添加异步逻辑）
  setTimeout(() => {
    ElMessage({
      message: '注册成功',
      type: 'success',
      duration: 2000
    })
    loading.value = false // ✅ 关闭加载状态
    router.push('/login')
  }, 1500)
   // ✅ 建议添加跳转
  }
  else{
    ElMessage.error('请正确填写表单内容')
    return
  }
})

}
</script>

<style scoped>
/* 共用登录页面样式 */
.register-container {
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;
}
.login-box{
  width: 100%;
  max-width: 420px;
  background: rgba(255, 255, 255, 0.95);
  border-radius: 12px;
  padding: 40px 35px;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15);
  transform: translateY(0);
  animation: float 3s ease-in-out infinite;
  margin-top: -100px;
}
.register-link {
  text-align: center;
  margin: 20px 0;
  color: #606266;
}

.register-link a {
  color: #409eff;
  margin-left: 5px;
  text-decoration: none;
}

.login-btn {
  width: 100%;
  border-radius: 8px !important;
  font-size: 16px !important;
  letter-spacing: 2px !important;
  margin-top: 10px;
}
</style>