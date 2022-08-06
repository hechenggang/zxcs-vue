<template>
  <transition>
    <div v-if="loadingVisible" class="fixed-full flex-center">
      <div class="loading">

        <p v-if="props.count < 0" class="note-text">{{ props.msg }}</p>

        <svg xmlns="http://www.w3.org/2000/svg" v-if="props.count > 0" class="loading-icon" viewBox="0 0 24 24"
          stroke-width="1.5" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
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
  if (props.count < 0) {
    loadingVisible.value = true
    return
  }
  if (props.count == 0) {
    loadingVisible.value = false
    // count is 0, less than delay ,cancel show loading
    if (time_cost < props.delay && loadingTimeoutId > 0) {
      clearTimeout(loadingTimeoutId)
    }
    loadingTimeoutId = 0
    loadingTimestamp = new Date().getTime()
    return
  }
  // if first call this func, set a timeout to show loading
  if (loadingTimeoutId == 0 && props.count > 0) {
    loadingTimeoutId = setTimeout(() => {
      // console.log('func performed, caller id: ', loadingTimeoutId)
      if (loadingTimeoutId > 0) {
        loadingVisible.value = true
      }
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
  background-color: transparent;
  
}

.flex-center {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-wrap: nowrap;
  flex-direction: column;
}

.loading {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1.5rem;
  opacity: 1;
  box-shadow: 0px 2px 10px rgb(0 0 0 / 10%);
  background-color: var(--color-bg);

}

.loading-icon {
  width: 1.75rem;
  height: 1.75rem;
  stroke: #706b66;
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