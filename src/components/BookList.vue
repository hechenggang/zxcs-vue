<script setup lang="ts">
import { defineProps } from "vue";
import { localConfig } from "../tools/store";
import type { Books } from "../tools/store";
import { RouterLink, RouterView,useRouter } from "vue-router";

const props = defineProps<{
    books: Books
}>()
</script>
<template>
    <ul class="books">
        <li class="book" v-for="b in books" :key="b.book_id">
            <div class="cover">
                <RouterLink :to="{ name: 'reader', query: { id: b.book_id, name: b.book_name } }">
                    <img v-lazy="localConfig.baseUri + localConfig.api.cover + b.book_id + '.webp'" />
                </RouterLink>
            </div>
            <div class="bookinfo">
                <RouterLink
                    :to="{ name: 'reader', query: { id: b.book_id, name: b.book_name } }"
                    class="book_name"
                >{{ b.book_name }}</RouterLink>
                <p class="book_brief">作者：{{ b.book_author.replace(/^\s+|\s+$/g, "") }}</p>
                <p class="book_brief">{{ b.book_brief }}</p>
            </div>
        </li>
    </ul>
</template>

<style  scoped>
.books {
    margin: 0;
    padding: 1rem;
    transition: all ;
    transition-duration: 0.2s;
}

.book {
    display: flex;
    justify-content: left;
    padding: 0.75rem 0;
    border-top: 0.2rem solid #ffffff;
}

.cover img {
    display: inline-block;
    width: 7rem;
    margin-right: 0.5rem;
    border: 0.2rem solid #ffffff;
}

.bookinfo {
    display: flex;
    flex-direction: column;
}

.book_name {
    font-size: 1.25rem;
    line-height: 1.75rem;
    color: #5698c3;
    font-weight: bold;
}

.book_brief {
    font-size: .8rem;
    line-height: 1rem;
}
</style>