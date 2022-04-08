<script setup lang="ts">
import { ref } from "vue";
import { RouterLink } from "vue-router";
import { getBooks } from "../tools/request";
import type { Books } from "../tools/store";
import { onMounted } from "vue";
import BookList from "../components/BookList.vue";
import { FullscreenLoading } from "../tools/store";

const books = ref<Books>([])

onMounted(() => {
    FullscreenLoading.value = true
    getBooks().then((resp) => {
        console.log("loading books ", resp)
        if (resp.status === 200) {
            resp.json().then(
                (data) => {
                    books.value = data.result
                    FullscreenLoading.value = false

                }
            )
        } else {
            alert("错误代码 " + resp.status)
            FullscreenLoading.value = false

        }
    })
})

</script>

<template>
    <BookList :books="books" />
</template>
