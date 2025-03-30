<template>
  <div class="video-container">
    <!-- 添加 playsinline 属性支持移动端内联播放 -->
    <video
      ref="videoRef"
      class="video-js vjs-big-play-centered"
      :poster="posterUrl"
      playsinline
      webkit-playsinline
    ></video>

    <!-- 增强加载状态显示 -->
    <div v-if="loading" class="vjs-loading-spinner">
      <div class="loading-text">加载中...</div>
    </div>

    <!-- 增强错误提示交互 -->
    <div v-if="error" class="vjs-error-display">
      <div class="vjs-error-content">{{ error }}</div>
      <button @click="retry" class="retry-button">重试</button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, watch } from 'vue'
import videojs from 'video.js'
import 'video.js/dist/video-js.css'

// 定义组件的 props
const props = defineProps({
  src: {
    type: String,
    required: true,
    // 视频源 URL，必传
  },
  mimeType: {
    type: String,
    default: 'video/mp4',
    // 视频 MIME 类型，默认为 'video/mp4'
  },
  posterUrl: String,
  // 视频封面 URL
  autoplay: {
    type: Boolean,
    default: false,
    // 是否自动播放，默认为 false
  },
  controls: {
    type: Boolean,
    default: true,
    // 是否显示控制条，默认为 true
  },
  loop: {
    type: Boolean,
    default: false,
    // 是否循环播放，默认为 false
  }
})

// 创建 video 元素的 ref
const videoRef = ref(null)
// 创建 video.js 播放器实例的 ref
const player = ref(null)
// 创建加载状态的 ref
const loading = ref(false)
// 创建错误信息的 ref
const error = ref(null)

// 初始化播放器（含安全销毁逻辑）
const initPlayer = () => {
  // 先销毁已有实例
  if (player.value) {
    player.value.dispose() // 销毁播放器实例
    player.value = null // 将播放器实例设置为 null
  }

  // 创建 video.js 播放器实例
  player.value = videojs(videoRef.value, {
    controls: props.controls, // 是否显示控制条
    autoplay: props.autoplay, // 是否自动播放
    fluid: true, // 自适应容器大小
    loop: props.loop, // 是否循环播放
    responsive: true,
    sources: [{ // 视频源
      src: props.src, // 视频 URL
      type: props.mimeType // 视频 MIME 类型
    }]
  })

  // 事件监听（带安全校验）
  const safeHandler = (handler) => (...args) => {
    if (!player.value) return // 如果播放器实例不存在，则不执行处理函数
    return handler(...args) // 执行处理函数
  }

  // 监听 waiting 事件，显示加载状态
  player.value.on('waiting', safeHandler(() => {
    loading.value = true // 设置加载状态为 true
  }))

  // 监听 playing 事件，隐藏加载状态和错误信息
  player.value.on('playing', safeHandler(() => {
    loading.value = false // 设置加载状态为 false
    error.value = null // 清空错误信息
  }))

  // 监听 error 事件，显示错误信息
  player.value.on('error', safeHandler(() => {
    const errorMap = {
      1: '视频加载中止',
      2: '网络错误',
      3: '解码错误',
      4: '视频格式不支持'
    }
    const code = player.value.error().code // 获取错误代码
    error.value = `播放错误: ${errorMap[code] || '未知错误'} (代码: ${code})` // 设置错误信息
    loading.value = false // 设置加载状态为 false
  }))
}

// 更新视频源
const updateSource = () => {
  if (!player.value) return // 如果播放器实例不存在，则不执行更新

  loading.value = true // 设置加载状态为 true
  error.value = null // 清空错误信息
  player.value.src({ // 更新视频源
    src: props.src, // 视频 URL
    type: props.mimeType // 视频 MIME 类型
  })

  // 保持自动播放状态
  player.value.autoplay(props.autoplay) // 设置自动播放状态
}

// 重试逻辑
const retry = () => {
  error.value = null // 清空错误信息
  updateSource() // 更新视频源
}

// 响应式更新处理
watch(() => props.src, updateSource) // 监听 src 属性，更新视频源
watch(() => props.mimeType, updateSource) // 监听 mimeType 属性，更新视频源
watch(() => props.posterUrl, (newVal) => { // 监听 posterUrl 属性，更新封面
  if (player.value) player.value.poster(newVal) // 设置封面 URL
})
watch(() => props.autoplay, (val) => { // 监听 autoplay 属性，更新自动播放状态
  if (player.value) player.value.autoplay(val) // 设置自动播放状态
})
watch(() => props.controls, (val) => { // 监听 controls 属性，更新控制条显示状态
  if (player.value) player.value.controls(val) // 设置控制条显示状态
})
watch(() => props.loop, (val) => { // 监听 loop 属性，更新循环播放状态
  if (player.value) player.value.loop(val) // 设置循环播放状态
})

// 生命周期管理
onMounted(() => {
  initPlayer() // 在组件挂载后初始化播放器
})

onBeforeUnmount(() => {
  if (player.value) {
    // 清除所有事件监听
    player.value.off('waiting') // 移除 waiting 事件监听
    player.value.off('playing') // 移除 playing 事件监听
    player.value.off('error') // 移除 error 事件监听
    player.value.dispose() // 销毁播放器实例
  }
})
</script>

<style scoped>
.video-container {
  position: relative;
  max-width: 1300px;
  margin: 0 auto;
  background: #000;
}

/* 增强加载动画 */
.vjs-loading-spinner {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 48px;
  height: 48px;
  border: 4px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  border-top-color: #fff;
  animation: spin 1s linear infinite;
  z-index: 1;
}

.loading-text {
  position: absolute;
  top: 120%;
  left: 50%;
  transform: translateX(-50%);
  color: #fff;
  font-size: 14px;
}

/* 增强错误提示 */
.vjs-error-display {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: rgba(0, 0, 0, 0.8);
  color: white;
  padding: 20px;
  border-radius: 8px;
  text-align: center;
  z-index: 1;
}

.retry-button {
  margin-top: 12px;
  padding: 8px 16px;
  background: #007bff;
  border: none;
  border-radius: 4px;
  color: white;
  cursor: pointer;
  transition: background 0.3s;
}

.retry-button:hover {
  background: #0056b3;
}

/* 深度定制播放器样式 */
:deep(.vjs-big-play-button) {
  width: 68px;
  height: 68px;
  border: none;
  background: rgba(0, 0, 0, 0.5);
  border-radius: 50%;
}

:deep(.vjs-play-progress) {
  background: #00c3ff;
}

@keyframes spin {
  to { transform: translate(-50%, -50%) rotate(360deg); }
}
</style>