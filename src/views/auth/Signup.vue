<script setup lang="ts">
import { signup } from '@/api';

async function handleSubmit(event: { preventDefault: () => void; target: any; }) {
  const values = Object.fromEntries(new FormData(event.target))
  // console.log('values: ', values);
  await signup(values)
  window.location = "/"
}
</script>

<template>
  <div>
    <form @submit.prevent="handleSubmit">
      <input type="text" required name="username" placeholder="username" />
      <br />
      <input type="email" required name="email" placeholder="email" />
      <br />
      <input type="password" required name="password" placeholder="password" />
      <br />
      <button type="submit">submit</button>
    </form>
  </div>
</template>