<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import useWebSocket from '@/features/useWebSocket'

const { setConnection, getConnection, sendEvent } = useWebSocket()
const messageBox = ref<HTMLDivElement>();
const messageInput = ref<string>('');
const fileInput = ref<File>();
const sendBtn = ref<HTMLButtonElement>();
const isInputEmpty = computed(() => messageInput.value == '' ? true : false)

onMounted(async () => {
  setConnection()

  getConnection.value.onmessage = (event: { data: any; }) => {
    const { data } = event;
    msgGeneration(data, "Server");
  };

});

async function sendMsg() {
  const text = messageInput.value;
  messageInput.value = ''
  const obj = {
    type: 'text',
    data: text
  }
  msgGeneration(obj, "Me");
  await sendEvent(obj);
}

function msgGeneration(msg: any, from: string) {
  // const obj = JSON.parse(msg)
  const newMessage = document.createElement("p");
  const imgTag = document.createElement("img");
  imgTag.width = 100
  imgTag.height = 50

  if (msg.type === 'text') {
    newMessage.innerText = `${from}: ${msg.data}`;
    messageBox.value && messageBox.value.appendChild(newMessage);
  }

  if (msg.type === 'attachment') {
    const spanTag = document.createElement("span");
    spanTag.innerHTML = `${from}: `
    imgTag.src = URL.createObjectURL(msg.data);
    newMessage.appendChild(spanTag)
    newMessage.appendChild(imgTag)
    messageBox.value && messageBox.value.appendChild(newMessage);
  }
}

function handleFileInput(e: any) {
  fileInput.value = e.target.files[0];
  let file = e.target.files[0];

  if (!file) {
    return
  }
  if (file.size > 10000000) {
    alert('File should be smaller than 1MB')
    return
  }

  const reader = new FileReader();
  let rawData = new ArrayBuffer(8);

  reader.onload = function (event) {
    rawData = e.target.result;
    // console.log('rawData: ', rawData);

    const data = {
      type: 'attachment',
      data: rawData
    };

    msgGeneration({
      type: 'attachment',
      data: file
    }, "Me")

    getConnection.value?.send({
      type: "attachment",
      data: rawData
    })
    // sendEvent(data);
  }

  reader.readAsArrayBuffer(file);
  console.log('reader: ', reader);

}

</script>

<template>
  <main>
    <h1>Messaging box</h1>
    <form @submit.prevent="sendMsg">
      <div ref="messageBox"></div>
      <input type="text" v-model="messageInput" />
      <input type="file" @change="handleFileInput" />
      <br />
      <button ref="sendBtn" :disabled="isInputEmpty">Send Message</button>
    </form>
  </main>
</template>
