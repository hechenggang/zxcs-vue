<script setup lang="ts">
import { ref, defineEmits, computed, defineProps, onMounted } from "vue";
import IconArrayLeft from "../components/icon/array-left.vue";
import IconArrayRight from "../components/icon/array-right.vue";
import ComponentButtonWithLoading from "@/components/ButtonWithLoading.vue";

const props = defineProps({
  text: {
    type: String,
    default: '',
  },
  leftArrayVisible: {
    type: Boolean,
    default: true,
  },
  rightArrayVisible: {
    type: Boolean,
    default: true,
  },
  action:{
    type:Function
  }
});



const funcPromise = (num:number) => {
  return ()=>{
    return new Promise(async (resolve, reject) => {
      try {
        if (props.action){
          await props.action(num)
        }
        resolve(true)
      } catch (error) {
        reject(false)
      }
    });
  }
};


</script>

<template>
    <div class="buttons">
      <ComponentButtonWithLoading class="button" v-if="leftArrayVisible" :size="20" :thicknesses="3" :action="funcPromise(-1)">
        <IconArrayLeft />
      </ComponentButtonWithLoading>
  
      <span
        class="false-button"
        v-if="!rightArrayVisible || !leftArrayVisible"
      ></span>

      <p class="text">{{ text }}</p>

      <ComponentButtonWithLoading class="button" v-if="rightArrayVisible" :size="20" :thicknesses="3" :action="funcPromise(1)">
        <IconArrayRight />
      </ComponentButtonWithLoading>
    </div>
</template>

<style scoped>

.text {
  font-size: 0.8rem;
  line-height: 1rem;
  font-weight: lighter;
  color: var(--color-sub-text);
}
</style>
