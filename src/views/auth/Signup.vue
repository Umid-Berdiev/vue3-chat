<script setup lang="ts">
function handleSubmit(event: Event) {
  const values = Object.fromEntries(new FormData(event.target))
  console.log('values: ', values);
}
</script>

<template>
<div>
  <form @submit.prevent="handleSubmit" >
  <input type="text" name="username">
  <br>
  <input type="email" name="email">
  <br>
  <input type="password" name="password">
  <br>
  <button type="submit">submit</button>
  </form>

</div>
</template>