<script setup lang="ts">
import { defineProps } from "vue";
import { CONFIG } from "../shared";
import type { Books } from "../types";

const props = defineProps<{
  books: Books;
}>();

</script>


<template>
  <ul class="books">
    <li class="book" v-for="b in books" :key="b.book_id">
      <div class="cover">

        <RouterLink :to="{
          name: 'reader',
          query: { id: b.book_id, name: b.book_name },
        }">
          <img v-lazy="
            CONFIG.baseUri +
            CONFIG.api.cover +
            b.book_id +
            '.webp'
          " class="shadow book-cover-img" />
        </RouterLink>

      </div>
      <div class="book-info">
        <RouterLink :to="{ name: 'reader', query: { id: b.book_id, name: b.book_name } }" class="book-name">{{
            b.book_name
        }}</RouterLink>
        <p v-if="b.book_author" class="book-author">{{ b.book_author.replace(/^\s+|\s+$/g, "") }}</p>
        <p v-if="b.book_brief" class="book-brief">{{ b.book_brief }}</p>
      </div>
    </li>
  </ul>
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

  /* background-color: #fff7e9; */
  background-color: var(--color-bg2);
  
  border-radius: 1rem;

  margin: 1rem 0;
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
</style>