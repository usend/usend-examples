<script setup lang="ts">
const email = ref('');
async function send() {
  await $fetch('/api/send', { method: 'POST', body: { email: email.value } });
}
</script>

<template>
  <form @submit.prevent="send">
    <input v-model="email" type="email" required />
    <button>Send welcome email</button>
  </form>
</template>
