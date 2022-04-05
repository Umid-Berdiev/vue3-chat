<script setup lang="ts">
import { reactive, onMounted } from "vue";
import axios from 'axios'

interface Blog {
  title: string
  body: string
}

const blogs = reactive<Blog[]>([]);

onMounted(async () => {
  const res = await axios.get("/api/blogs")
  Object.assign(blogs, res.data)
})
</script>

<template>
  <main>
    <h1>Blogs</h1>
    <ul>
      <li v-for="blog in blogs">
        <h5>{{ blog.title }}</h5>
        <h6>{{ blog.body }}</h6>
      </li>
    </ul>
  </main>
</template>
