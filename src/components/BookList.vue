<script setup lang="ts">
import { defineProps } from "vue";
import { apiUri } from "../api";
import type { Books } from "../types";

const props = defineProps<{
  books: Books;
}>();

</script>


<template>
  <!-- <TransitionGroup name="list" tag="ul" class="books"> -->
  <ul name="list" tag="ul" class="books">
    <li class="book" v-for="b in books" :key="b[0]">
      <div class="cover">

        <RouterLink :to="{
          name: 'reader',
          query: { id: b[0], name: b[1] },
        }" v-auto-animate>
          <img v-lazy="
            apiUri.base +
            apiUri.cover +
            b[0] +
            '.webp'
          " class="shadow book-cover-img" />
        </RouterLink>

      </div>
      <div class="book-info">
        <RouterLink :to="{ name: 'reader', query: { id: b[0], name: b[1] } }" class="book-name">{{
          b[1]
        }}</RouterLink>
        <p v-if="b.length > 2" class="book-author">{{ b[2].replace(/^\s+|\s+$/g, "") }}</p>
        <p v-if="b.length > 3" class="book-brief">{{ b[3] }}</p>
      </div>
    </li>
  </ul>

  <!-- </TransitionGroup> -->
</template>

<style >
.books {
  margin: 0;
  transition: all 0.3s ease;
  overflow-x: hidden;
}

.book {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: left;
  padding: 4rem 0;

  border-radius: 1rem;
  margin: 1rem 0;
  background-color: var(--color-bg2);
  border: 1px solid var(--color-border);

}

.book-info {
  display: flex;
  align-items: center;
  flex-direction: column;
  padding: 0 2rem;
}

.book-name {
  font-size: 1.25rem;
  line-height: 1.25rem;
  color: var(--color-link);
  margin: 0.25rem 0;
  text-align: center;
}

.book-author {
  font-size: 0.9rem;
  line-height: 1rem;
  font-weight: lighter;
  margin-top: 0.25rem;
  color: var(--color-sub-text);
}

.book-brief {
  font-size: 0.8rem;
  line-height: 1rem;
  font-weight: lighter;
  margin-top: 0.25rem;
  color: var(--color-sub-text);
}

.book-cover-img {
  display: inline-block;
  width: 7rem;
  margin-right: 0.5rem;
  border: 0.2rem solid #ffffff;
  border-radius: 5px;


}

.list-enter-active,
.list-leave-active {
  transition: all 0.2s ease;
}
.list-enter-from,
.list-leave-to {
  opacity: 0.7;
  transform: translateX(5px);
}
</style>