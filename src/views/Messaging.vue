<script setup lang="ts">
import { ref, onMounted } from 'vue'
import useWebSocket from '@/features/useWebSocket'

const { setConnection, getConnection, sendEvent } = useWebSocket()
const messageBox = ref(null);
const messageInput = ref(null);
const sendBtn = ref(null);

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
  const text = messageInput.value.value;
  messageInput.value.value = ''
  msgGeneration(text, "Me");
  await sendEvent({ message: text, user_id: 2 });
}

function msgGeneration(msg: any, from: string) {
  const newMessage = document.createElement("h5");
  newMessage.innerText = `${from}: ${msg}`;
  messageBox.value.appendChild(newMessage);
}



</script>

<template>
  <main>
    <h1>Messaging box</h1>
    <form @submit.prevent="sendMsg">
      <div ref="messageBox"></div>
      <input type="text" ref="messageInput" />
      <br />
      <button ref="sendBtn">Send Message</button>
    </form>
  </main>
</template>
