<script setup lang="ts">
import { reactive, onMounted } from "vue";
import axios from 'axios'

const blogs = reactive([]);

onMounted(async () => {
  const res = await axios.get("http://localhost:8889/blogs")
  Object.assign(blogs, res.data)
})
</script>

<template>
  <main>
    <ul>
      <li v-for="blog in blogs">
        <h5>{{ blog.title }}</h5>
        <h6>{{ blog.body }}</h6>
      </li>
    </ul>
  </main>
</template>
