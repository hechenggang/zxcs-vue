<template>
  <transition>
    <div v-if="loadingVisible" class="loading fixed-full flex-center">
      <p v-if="props.count < 0" class="note-text">{{ props.msg }}</p>
      <svg xmlns="http://www.w3.org/2000/svg" v-if="props.count > 0" class="loading-icon" viewBox="0 0 24 24"
        stroke-width="1.5" stroke="#2c3e50" fill="none" stroke-linecap="round" stroke-linejoin="round">
        <path stroke="none" d="M0 0h24v24H0z" fill="none" />
        <circle cx="12" cy="12" r="4" />
        <path d="M3 12h1m8 -9v1m8 8h1m-9 8v1m-6.4 -15.4l.7 .7m12.1 -.7l-.7 .7m0 11.4l.7 .7m-12.1 -.7l-.7 .7" />
      </svg>
    </div>
  </Transition>
</template>

<script setup lang="ts">

import { ref, watch } from "vue";


const props = defineProps<{
  // @count 一个计数器，当计数器大于0时，显示加载页面，等于0时不显示，小于0时显示错误信息
  count: number,
  // @delay 延迟显示的时间，如果在延迟内 count 变化，将重新检查执行逻辑
  delay: number,
  // @msg 信息文本，当 count 为负时，不显示加载动画，而是一段文本
  msg: string,
}>()


let loadingTimeoutId = 0
let loadingTimestamp = 0

const loadingVisible = ref(false)

watch(() => props.count, () => {
  const time_cost = new Date().getTime() - loadingTimestamp
  console.log('time cost: ', time_cost, ', timeout caller id: ', loadingTimeoutId)

  if (props.count < 0) {
    loadingVisible.value = true
    return
  }
  if (props.count == 0) {
    loadingVisible.value = false
    // count is 0, less than delay ,cancel show loading
    if (loadingTimeoutId) {
      if (time_cost < props.delay) {
        // console.log('do clear, id: ', loadingTimeoutId)
        if (loadingTimeoutId > 0) {
          clearTimeout(loadingTimeoutId)
          loadingTimeoutId = 0
        }
      }
    }
    loadingTimestamp = new Date().getTime()
    return
  }
  // if first call this func, set a timeout to show loading
  if (!loadingTimeoutId && props.count > 0) {
    loadingTimeoutId = setTimeout(() => {
      // console.log('func performed, caller id: ', loadingTimeoutId)
      loadingVisible.value = true
      loadingTimeoutId = 0
    }, props.delay);
    // console.log('set new call: id: ', loadingTimeoutId)
    loadingTimestamp = new Date().getTime()
    return
  }
})

</script>

<style scoped>
.fixed-full {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 998;
}

.flex-center {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-wrap: nowrap;
  flex-direction: column;
}

.loading {
  background-color: #fffdf2;
  opacity: 0.9;
}

.loading-icon {
  width: 1.75rem;
  height: 1.75rem;
  stroke: #706b66;
  fill: #706b66;
  animation: rotate 3s linear infinite;
  background-color: #fffdf2;
}


@keyframes rotate {
  0% {
    transform: rotate(0deg);
  }

  100% {
    transform: rotate(360deg);
  }
}
</style>