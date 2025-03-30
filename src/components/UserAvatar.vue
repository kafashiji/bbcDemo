<template>
  <div class="avatar-container">
    <img
      :src="targetUrl"
      :alt="altText"
      :style="avatarStyle"
      class="avatar-image"
      @error="handleImageError"
    />
    
  </div>
</template>
<script setup>
  import { ref, computed, watch, onMounted } from 'vue'
  const avatarUrls ={
    1001: 'https://kafashiji.oss-cn-beijing.aliyuncs.com/85261c03-c715-4bf0-bc7c-3dd2c8f37293_base_resized(1).jpg',
    1002: 'https://kafashiji.oss-cn-beijing.aliyuncs.com/a29b340b-d02c-499c-abd6-c4dc01cffbb6_base_resized(1).jpg',
  }
  const props = defineProps({
    upid: {
      type: [Number],
      required: true
    },
    size: {
      type: Number,
      default: 100
    },
    // 替代文本
    altText: {
      type: String,
      default: '用户头像'
    },
  })

  watch(() => props.upid, (newVal, oldVal) => {
    if (newVal !== oldVal) updateAvatarSource()
  })
  const targetUrl = ref('')
  const updateAvatarSource = () => {
    targetUrl.value = avatarUrls[props.upid] // 或使用 String(videoId) 如果键是数字
  }

  const avatarStyle = computed(() => ({
    width: `${props.size}px`,
    height: `${props.size}px`,
    minWidth: `${props.size}px`
  }))

  onMounted(updateAvatarSource)
</script>
<style scoped>
.avatar-container {
  position: relative;
  display: inline-block;
  line-height: 0;
  border-radius: 50%;
  overflow: hidden;
}

.avatar-image {
  display: block;
  object-fit: cover;
  transition: opacity 0.3s ease;
  background: linear-gradient(45deg, #f0f2f5 25%, #e5e7eb 50%, #f0f2f5 75%);
}


</style>