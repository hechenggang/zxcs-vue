<script setup lang="ts">
import { nextTick, watch, ref, defineEmits, computed, defineProps, onMounted, onUnmounted } from "vue";

const props = defineProps<{
  chapter: string[],
  voices: SpeechSynthesisVoice[],
}>();

const emit = defineEmits<{
  (e: "setPageIndex", num: number): void;
}>();

const status = ref(0)
const currentVoiceIndex = ref(0)
const voiceRates = [0.8, 0.9, 1, 1.1, 1.2, 1.5, 2.0]
const currentRate = ref(1)
const currentSentence = ref('加载中')
const readIndex = ref(0)
const ok = ref(true)
const speech = window.speechSynthesis


const read = () => {
  if (ok.value) {
    if (status.value == 0 && readIndex.value < props.chapter.length) {
      currentSentence.value = props.chapter[readIndex.value]
      const sentence = new window.SpeechSynthesisUtterance(currentSentence.value)
      sentence.rate = currentRate.value
      sentence.voice = props.voices[currentVoiceIndex.value]
      speech.speak(sentence)
      sentence.onend = () => {
        readIndex.value += 1
        read()
      };
    }
    else if (status.value == 0 && readIndex.value >= props.chapter.length) {
      status.value = 1
      console.log('load next')

      emit('setPageIndex', 1);
      read()
    } else {
      // 稍后再读
      console.log('wait:', 'status', status.value, 'index', readIndex.value)
      setTimeout(() => read(), 500)
    }
  }

}



watch(() => props.chapter, () => {
  console.log('chapter change')
  if (speech.speaking) {
    speech.cancel()
  }
  // status 1 是主动调用下一章
  if (status.value == 1) {
    readIndex.value = 0
  } else {
    readIndex.value = -1
  }
  status.value = 0
  console.log('chapter change', 'index', readIndex.value, 'status', status.value)


})

watch(() => currentRate.value, () => {
  console.log('rate change')
  speech.cancel()
  readIndex.value = readIndex.value - 1
})

watch(() => currentVoiceIndex.value, () => {
  console.log('voice change')
  speech.cancel()
  readIndex.value = readIndex.value - 1
})

onUnmounted(() => {
  speech.cancel()
  ok.value = false
  console.log('组件关闭', ok.value)
})

onMounted(() => read())

</script>

<template>

  <div class="bar top-bar shadow" style="top:4rem;">
    <div class="buttons">
      <select v-if="voices?.length" class="button" v-model="currentVoiceIndex">
        <option v-for="v, i in voices" :value="i">{{ v.name }}</option>
      </select>
    </div>
  </div>
  <div class="bar top-bar shadow" style="top:7rem;">

    <div class="buttons">
      <select class="button" v-model="currentRate">
        <option v-for="v in voiceRates" :value="v">语速 {{ v }}x</option>
      </select>
    </div>
  </div>
  <div class="bar top-bar shadow" style="top:10rem;">
    <br />
    <div class="buttons">
      <p>{{ currentSentence }}</p>
    </div>
    <br />
  </div>
</template>
