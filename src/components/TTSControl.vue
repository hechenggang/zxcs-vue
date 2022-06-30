<script setup lang="ts">
import { watch, ref, defineEmits, computed, defineProps, onMounted, onUnmounted } from "vue";

const props = defineProps<{
  chapter: string[],
  voices: SpeechSynthesisVoice[],
}>();


const currentVoiceIndex = ref(0)
const voiceRates = [0.8, 0.9, 1, 1.1, 1.2, 1.5, 2.0]
const currentRate = ref(1)
const currentSentence = ref('加载中')
const readIndex = ref(0)
const ok = ref(true)
const speech = window.speechSynthesis
const read = () => {
  if (props.voices?.length && ok.value) {
    currentSentence.value = props.chapter[readIndex.value]
    const sentence = new window.SpeechSynthesisUtterance(currentSentence.value)
    sentence.rate = currentRate.value
    sentence.voice = props.voices[currentVoiceIndex.value]
    speech.speak(sentence)
    sentence.onend = () => {
      if (readIndex.value < props.chapter.length) {
        readIndex.value += 1
        console.log('reading status:', currentRate.value, readIndex.value)
        if (ok.value) read()
      } else {
        alert('读完了')
      }
    }
  }
}

watch(()=>props.chapter,()=>{
  console.log('章节变化')
  speech.cancel()
  readIndex.value = -1
})

watch(()=>currentRate.value,()=>{
  console.log('速率变化')
  speech.cancel()
  readIndex.value = readIndex.value - 1
})

watch(()=>currentVoiceIndex.value,()=>{
  console.log('声音变化')
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
    <br/>
    <div class="buttons">
      <p>{{ currentSentence }}</p>
    </div>
    <br/>
  </div>
</template>
