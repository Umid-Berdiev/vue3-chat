<script setup lang="ts">
import { login } from '@/api';

async function handleSubmit(event: { preventDefault: () => void; target: any; }) {
  const values = Object.fromEntries(new FormData(event.target))
  // console.log('values: ', values);
  await login(values)
  window.location = "/"
}
</script>

<template>
  <form @submit.prevent="handleSubmit">
    <input type="email" name="email" />
    <br />
    <input type="password" name="password" />
    <br />
    <button type="submit">submit</button>
    no account?
    <RouterLink to="/auth/signup">signup</RouterLink>
  </form>
</template>