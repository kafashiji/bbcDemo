<template>
  <!-- 登录弹窗容器 -->
  <div v-if="visible" class="edit-modal" @click.self="close">
    <div class="login-container">
      <div class="login-box">
        <div class="animated-logo">
          <img src="https://kafashiji.oss-cn-beijing.aliyuncs.com/BB.ico" alt="">
        </div>

        <el-form :model="form" :rules="rules" ref="loginForm" class="login-form">
          <el-form-item prop="username">
            <el-input v-model="form.username" placeholder="账号" prefix-icon="User" size="large" />
          </el-form-item>

          <el-form-item prop="password">
            <el-input v-model="form.password" type="password" placeholder="密码" prefix-icon="Lock" size="large"
              show-password @keyup.enter="handleLogin"/>
          </el-form-item>

          <div class="login-options">
            <el-checkbox v-model="form.remember">记住登录</el-checkbox>
          </div>

          <div>
            <el-button type="primary" size="large" class="login-btn" @click="handleLogin" :loading="loading" >
              登录
            </el-button>
            <el-button type="default" size="large" class="register-btn" @click="handleregister" :loading="loading">
              注册
            </el-button>
          </div>


          <div class="third-login">
            <div class="divider">
              <span class="line"></span>
              <span class="text">其他登录方式</span>
              <span class="line"></span>
            </div>
            <div class="icons">
              <el-icon class="icon wechat">
                <Wechat />
              </el-icon>
              <el-icon class="icon github">
                <Github />
              </el-icon>
              <el-icon class="icon alipay">
                <Alipay />
              </el-icon>
            </div>
          </div>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import HYRequest from '../../service/Request'
import { inject } from 'vue'

const { register } = inject('dialogRefs')
const visible = ref(false)
const loading = ref(false)


const form = reactive({
  username: '',
  password: '',
  remember: false
})

const rules = reactive({
  username: [
    { required: true, message: '请输入账号', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 1,message: '密码长度不能小于6位', trigger: 'blur' }
  ]
})



// 修改登录处理逻辑
const loginForm = ref(null)  // 获取表单引用

const handleLogin = async () => {
  // 先进行表单验证
  try {
    await loginForm.value.validate()
  } catch (error) {
    console.error('表单验证失败:', error)
    ElMessage.warning('请正确填写登录信息')
    return
  }
  HYRequest.post({
  url: '/login',
  data: {
    "userName": form.username,
    "password": form.password
  }}).then(res => {
    console.log("res", res)
    if(!res.success){
      ElMessage.warning(res.errorMsg)
    }else{
      localStorage.setItem('user', JSON.stringify(res.data))
      ElMessage.success("登录成功")
      location.reload();
      close()
    }
  })
}
const handleregister = () => {
  register.value?.open()
  close()
}

// 控制弹窗显示



// 暴露打开/关闭方法
const open = () => visible.value = true
const close = () => visible.value = false


defineExpose({ open, close })
</script>

<style scoped>
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
  z-index: 98;
}
/* 转换为标准CSS */
.login-container {
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;
  width: 420px;
}

.login-box {
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

.animated-logo {
  text-align: center;
  margin-bottom: 40px;
}

.logo-circle {
  width: 80px;
  height: 80px;
  background: #409eff;
  border-radius: 50%;
  margin: 0 auto 15px;
  position: relative;
}

.logo-circle::after {
  content: '';
  position: absolute;
  inset: -5px;
  border: 3px solid #409eff;
  border-radius: 50%;
  animation: pulse 1.5s infinite;
}

.logo-text {
  font-size: 24px;
  font-weight: bold;
  color: #303133;
  display: block;
  letter-spacing: 2px;
}

.login-form .el-input__wrapper {
  padding: 2px 15px !important;
  border-radius: 8px !important;
}

.login-options {
  display: flex;
  justify-content: space-between;
  margin: 15px 0 25px;
}
.router-link-active {
  text-decoration: none;
}
.login-btn {
  width: 40%;
  border-radius: 8px !important;
  font-size: 16px !important;
  letter-spacing: 2px !important;
  margin-left: 7%;
  
}
.register-btn {
  width: 40%;
  border-radius: 8px !important;
  font-size: 16px !important;
  letter-spacing: 2px !important;
}

.third-login {
  margin-top: 30px;
}

.divider {
  display: flex;
  align-items: center;
  margin: 20px 0;
}

.divider .line {
  flex: 1;
  height: 1px;
  background: #dcdfe6;
}

.divider .text {
  padding: 0 15px;
  color: #909399;
  font-size: 14px;
}

.icons {
  display: flex;
  justify-content: center;
  gap: 25px;
}

.icon {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s;
}

.icon:hover {
  transform: translateY(-3px);
}

.wechat {
  color: #67c23a;
  background: rgba(103, 194, 58, 0.1);
}

.github {
  color: #303133;
  background: rgba(48, 49, 51, 0.1);
}

.alipay {
  color: #1677ff;
  background: rgba(22, 119, 255, 0.1);
}

@keyframes float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
}

@keyframes pulse {
  0% { opacity: 1; transform: scale(1); }
  70% { opacity: 0; transform: scale(2); }
  100% { opacity: 0; }
}
</style>