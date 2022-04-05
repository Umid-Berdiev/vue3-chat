<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import useWebSocket from '@/features/useWebSocket'

const { setConnection, getConnection, sendEvent } = useWebSocket()
const messageBox = ref<HTMLDivElement>();
const messageInput = ref<string>('');
const sendBtn = ref<HTMLButtonElement>();
const isInputEmpty = computed(() => messageInput.value == '' ? true : false)

onMounted(async () => {
  await setConnection()

  // getConnection.value.onopen = () => {
  //   sendBtn.value.disabled = false;
  // };

  getConnection.value.onmessage = (event: { data: any; }) => {
    const { data } = event;
    msgGeneration(data, "Server");
  };

});

async function sendMsg() {
  const text = messageInput.value;
  messageInput.value = ''
  msgGeneration(text, "Me");
  await sendEvent(text);
}

function msgGeneration(msg: any, from: string) {
  const newMessage = document.createElement("p");
  newMessage.innerText = `${from}: ${msg}`;
  messageBox.value && messageBox.value.appendChild(newMessage);
}

</script>

<template>
  <main>
    <h1>Messaging box</h1>
    <form @submit.prevent="sendMsg">
      <div ref="messageBox"></div>
      <input type="text" v-model="messageInput" />
      <br />
      <button ref="sendBtn" :disabled="isInputEmpty">Send Message</button>
    </form>
  </main>
</template>
