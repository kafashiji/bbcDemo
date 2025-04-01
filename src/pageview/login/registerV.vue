<template>
  <!-- 注册弹窗容器 -->
  <div v-if="visible" class="edit-modal" @click.self="close">
    <div class="register-container">
      <div class="login-box">
        <div class="animated-logo">
          <img src="https://kafashiji.oss-cn-beijing.aliyuncs.com/BB.ico" alt="">
        </div>
        <el-form :model="form" :rules="rules" ref="registerForm" class="login-form">
          <el-form-item prop="accname">
            <el-input v-model="form.accname" placeholder="用户名" prefix-icon="User" size="large" />
          </el-form-item>

          <el-form-item prop="username">
            <el-input v-model="form.username" placeholder="账户" prefix-icon="Message" size="large" />
          </el-form-item>

          <el-form-item prop="password">
            <el-input v-model="form.password" type="password" placeholder="密码" prefix-icon="Lock" size="large"
              show-password />
          </el-form-item>

          <el-form-item prop="confirmPassword">
            <el-input v-model="form.confirmPassword" type="password" placeholder="确认密码" prefix-icon="Lock" size="large"
              show-password />
          </el-form-item>

          <div>
            <el-button type="primary" size="large" class="login-btn" @click="handlerRegister" :loading="loading">
              注册
            </el-button>
          </div>
          <div class="register-link">
            已有账号？
            <span @click="LogInr">去登录</span>
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

const { login } = inject('dialogRefs')
const visible = ref(false)
const loading = ref(false)

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
    { required: true, message: '请输入账户', trigger: 'blur' },
    { min: 1, max: 12, message: '长度在 1 到 12 个字符', trigger: 'blur' }
  ],
  accname: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 1, max: 18, message: '长度在 1 到 18 个字符', trigger: 'blur' }
  ],
  confirmPassword: [
    { required: true, message: '请再次输入密码', trigger: 'blur' },
    { validator: validatePass2, trigger: 'blur' }
  ]
})
const registerForm = ref(null)


const handlerRegister = () => {
  registerForm.value.validate((vaild) => {
    if (vaild) {
      HYRequest.post({
        url: '/bbc_account',
        data: {
          "userName": form.username,
          "password": form.password,
          "accName": form.accname
        }
      }).then(res => {
        console.log("res", res)
        if (!res.success) {
          ElMessage.warning(res.errorMsg)
        } else {
          ElMessage.success("注册成功")
          login.value?.open()
          close()
        }
      })
    } else {
      ElMessage.error('请正确填写表单内容')
      return
    }
  })

}
const LogInr =() =>{
  login.value?.open()
  close()
}

// 登录表单数据

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
  background: rgba(0, 0, 0, 0.4);
  display: flex;
  justify-content: center;
  align-items: center;
  backdrop-filter: blur(2px);
  z-index: 99;
}

.register-container {
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