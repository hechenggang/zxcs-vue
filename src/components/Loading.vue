<template>
  <!-- 使用 transition 组件实现淡入淡出效果 -->
  <transition name="fade">
    <!-- 当 loadingVisible 为 true 时显示加载组件 -->
    <div v-if="loadingVisible" class="fixed-full flex-center">
      <div class="loading">
        <!-- 当 count 小于 0 时显示错误信息 -->
        <p v-if="props.count < 0" class="note-text">{{ props.msg }}</p>
        <!-- 当 count 大于 0 时显示加载图标 -->
        <svg v-else class="loading-icon" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
          <path stroke="none" d="M0 0h24v24H0z" fill="none" />
          <circle cx="12" cy="12" r="3" />
          <line x1="12" y1="5" x2="12" y2="3" />
          <line x1="17" y1="7" x2="18.4" y2="5.6" />
          <line x1="19" y1="12" x2="21" y2="12" />
          <line x1="17" y1="17" x2="18.4" y2="18.4" />
          <line x1="12" y1="19" x2="12" y2="21" />
          <line x1="7" y1="17" x2="5.6" y2="18.4" />
          <line x1="6" y1="12" x2="4" y2="12" />
          <line x1="7" y1="7" x2="5.6" y2="5.6" />
        </svg>
      </div>
    </div>
  </transition>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";

// 定义组件的 props
const props = defineProps<{
  // 计数器，当计数器大于0时，显示加载页面，等于0时不显示，小于0时显示错误信息
  count: number,
  // 延迟显示的时间，如果在延迟内 count 变化，将重新检查执行逻辑
  delay: number,
  // 信息文本，当 count 为负时，不显示加载动画，而是一段文本
  msg: string,
}>()

// 控制加载组件是否可见的响应式变量
const loadingVisible = ref(false)

// 用于管理延迟显示的定时器
let loadingTimeoutId: ReturnType<typeof setTimeout> | null = null

// 监听 count 的变化
watch(() => props.count, (newCount) => {
  // 如果之前有定时器，清除它
  if (loadingTimeoutId) {
    clearTimeout(loadingTimeoutId)
    loadingTimeoutId = null
  }

  // 根据 count 的值设置 loadingVisible
  if (newCount < 0) {
    // 当 count 小于 0 时，显示错误信息
    loadingVisible.value = true
  } else if (newCount === 0) {
    // 当 count 等于 0 时，隐藏加载组件
    loadingVisible.value = false
  } else {
    // 当 count 大于 0 时，设置延迟显示的定时器
    loadingTimeoutId = setTimeout(() => {
      loadingVisible.value = true
    }, props.delay)
  }
})
</script>

<style scoped>
/* 固定全屏样式 */
.fixed-full {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 998;
  background-color: transparent;
}

/* 居中对齐样式 */
.flex-center {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
}

/* 加载组件样式 */
.loading {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1.5rem;
  opacity: 1;
  box-shadow: 0px 2px 10px rgb(0 0 0 / 10%);
  background-color: var(--color-bg);
}

/* 加载图标样式 */
.loading-icon {
  width: 1.75rem;
  height: 1.75rem;
  stroke: #706b66;
  animation: rotate 3s linear infinite;
  background-color: #fffdf2;
}

/* 旋转动画 */
@keyframes rotate {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* 淡入淡出过渡效果 */
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.5s;
}

.fade-enter, .fade-leave-to {
  opacity: 0;
}
</style>