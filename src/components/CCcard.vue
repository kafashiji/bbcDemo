<script setup>

defineProps({
  item: {
    type: Object,
    required: true,
  }
})
const formatTimeAgo = (dateString) => {
  const now = new Date();
  const createdAt = new Date(dateString);
  const timeDiff = now - createdAt;

  // 1. 处理小于1分钟的情况
  if (timeDiff < 60 * 1000) return '刚刚';

  // 2. 处理分钟级（1-59分钟）
  const minutesDiff = Math.floor(timeDiff / (60 * 1000));
  if (minutesDiff < 60) return `${minutesDiff}分钟前`;

  // 3. 处理小时级（1-23小时）
  const hoursDiff = Math.floor(minutesDiff / 60);
  if (hoursDiff < 24) return `${hoursDiff}小时前`;

  // 4. 处理天级（1-6天）
  const daysDiff = Math.floor(hoursDiff / 24);
  if (daysDiff < 7) return `${daysDiff}天前`;

  // 5. 处理整周情况（精确匹配7天）
  if (daysDiff === 7) return '一周前';

  // 6. 处理跨年判断（精确到日期的年变化）
  const isOverYear = new Date(createdAt.getTime()) > 
    new Date(now.getFullYear() - 1, now.getMonth(), now.getDate() + 1);

  // 7. 超过一年显示完整年月日
  if (!isOverYear) {
    const year = createdAt.getFullYear();
    const month = createdAt.getMonth() + 1;
    const date = createdAt.getDate();
    return `${year}年${month}月${date}日`;
  }

  // 8. 处理月日格式（当年内超过一周）
  const month = createdAt.getMonth() + 1;
  const date = createdAt.getDate();
  return `${month}月${date}日`;
};


const formatViewCount = (count) => {
  const num = Number(count)
  if (num >= 10000) {
    const converted = (num / 10000).toFixed(1)
    // 处理 1.0万 显示为 1万
    return converted.replace(/\.0$/, '') + '万'
  }
  return num.toString()
}
</script>

<template>
  <div class="card-info">
    <img class="imgc" :src="item.videoImg" />
    <div class="content-wrap">
      <div class="card-title">{{item.videoTitle}}</div>
      <div class="stats-wrap">
        <svg  xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 24 24" width="24" height="24" fill="currentColor" class="videoup"><!--[--><path d="M6.15 8.24805C6.5642 8.24805 6.9 8.58383 6.9 8.99805L6.9 12.7741C6.9 13.5881 7.55988 14.248 8.3739 14.248C9.18791 14.248 9.8478 13.5881 9.8478 12.7741L9.8478 8.99805C9.8478 8.58383 10.1836 8.24805 10.5978 8.24805C11.012 8.24805 11.3478 8.58383 11.3478 8.99805L11.3478 12.7741C11.3478 14.41655 10.01635 15.748 8.3739 15.748C6.73146 15.748 5.4 14.41655 5.4 12.7741L5.4 8.99805C5.4 8.58383 5.73578 8.24805 6.15 8.24805z" fill="currentColor"></path><path d="M12.6522 8.99805C12.6522 8.58383 12.98795 8.24805 13.4022 8.24805L15.725 8.24805C17.31285 8.24805 18.6 9.53522 18.6 11.123C18.6 12.71085 17.31285 13.998 15.725 13.998L14.1522 13.998L14.1522 14.998C14.1522 15.4122 13.8164 15.748 13.4022 15.748C12.98795 15.748 12.6522 15.4122 12.6522 14.998L12.6522 8.99805zM14.1522 12.498L15.725 12.498C16.4844 12.498 17.1 11.8824 17.1 11.123C17.1 10.36365 16.4844 9.74804 15.725 9.74804L14.1522 9.74804L14.1522 12.498z" fill="currentColor"></path><path d="M12 4.99805C9.48178 4.99805 7.283 5.12616 5.73089 5.25202C4.65221 5.33949 3.81611 6.16352 3.72 7.23254C3.60607 8.4998 3.5 10.171 3.5 11.998C3.5 13.8251 3.60607 15.4963 3.72 16.76355C3.81611 17.83255 4.65221 18.6566 5.73089 18.7441C7.283 18.8699 9.48178 18.998 12 18.998C14.5185 18.998 16.7174 18.8699 18.2696 18.74405C19.3481 18.65655 20.184 17.8328 20.2801 16.76405C20.394 15.4973 20.5 13.82645 20.5 11.998C20.5 10.16965 20.394 8.49877 20.2801 7.23205C20.184 6.1633 19.3481 5.33952 18.2696 5.25205C16.7174 5.12618 14.5185 4.99805 12 4.99805zM5.60965 3.75693C7.19232 3.62859 9.43258 3.49805 12 3.49805C14.5677 3.49805 16.8081 3.62861 18.3908 3.75696C20.1881 3.90272 21.6118 5.29278 21.7741 7.09773C21.8909 8.3969 22 10.11405 22 11.998C22 13.88205 21.8909 15.5992 21.7741 16.8984C21.6118 18.7033 20.1881 20.09335 18.3908 20.23915C16.8081 20.3675 14.5677 20.498 12 20.498C9.43258 20.498 7.19232 20.3675 5.60965 20.2392C3.81206 20.0934 2.38831 18.70295 2.22603 16.8979C2.10918 15.5982 2 13.8808 2 11.998C2 10.1153 2.10918 8.39787 2.22603 7.09823C2.38831 5.29312 3.81206 3.90269 5.60965 3.75693z" fill="currentColor"></path><!--]-->
         </svg>
        <div class="card-stats">
          {{item.videoAccName}} {{formatViewCount(item.viewCount)}}点击 · {{ formatTimeAgo(item.createdAt) }}
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>

.card-info {
  display: flex;
  flex-direction: column;
  height: 100%;
  position: relative;
  margin: 1px;
}

.imgc {
  width: 100% !important;
  height: 100% !important;       /* 让图片填满容器 */
  object-fit: cover !important; /* 关键属性：裁剪填充 */ 
  border-radius: 10px;
  
  /* 可选：若需要固定宽高比，添加容器约束 */
  flex: 0 0 70%;
  min-height: 0;
}

.content-wrap {
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: 0 8px;
  margin-top: 8px;
}

.card-title {
  font-size: 16px;
  line-height: 1.4;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  overflow: hidden;
  margin-bottom: 8px;
}

.stats-wrap {
  display: flex;
  align-items: center;
  gap: 4px;
  margin-top: 0px;
}

.videoup {
  width: 15px;
  height: 15px;
  flex-shrink: 0;
}

.card-stats {
  font-size: 12px;
  color: #899ab1;
  line-height: 1;
}
</style>