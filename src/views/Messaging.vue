<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
// import { setConnection } from '@/features/useWebSocket'
import useWebSocket from '@/features/useWebSocket'

const { setConnection, getConnection, } = useWebSocket()
const messageBox = ref<HTMLDivElement>();
const messageInput = ref<string>('');
const inputTag = ref<HTMLInputElement>();
const fileInput = ref<File>();
const sendBtn = ref<HTMLButtonElement>();
const isInputEmpty = computed(() => messageInput.value == '' ? true : false)

onMounted(async () => {
  inputTag.value?.focus()
  setConnection()

  if (getConnection.value)
    getConnection.value.onmessage = (event: any) => {
      const { data } = event;
      if (data instanceof ArrayBuffer) {
        // const blob = new File([data], "filename")
        // const arrayBuffer = data;
        // const bytes = new Uint8Array(arrayBuffer);
        // const blob = new Blob([bytes.buffer])

        // const bytes = new Uint8Array(data);
        // const blob = new Blob([bytes.buffer]);

        msgGeneration({
          type: 'attachment',
          payload: blob
        }, "Server");


      } else {
        msgGeneration({
          type: 'text',
          payload: data
        }, "Server");
      }
    };

});

async function sendMsg() {
  const text = messageInput.value;
  messageInput.value = ''
  inputTag.value?.focus()
  const obj = {
    type: 'text',
    payload: text
  }
  msgGeneration(obj, "Me");
  getConnection.value && getConnection.value.send(text);
  // sendEvent(obj);
}

function msgGeneration(msg: any, from: string) {
  // const obj = JSON.parse(msg)
  const newMessage = document.createElement("p");
  const imgTag = document.createElement("img");
  imgTag.width = 100
  imgTag.height = 50

  if (msg.type === 'text') {
    newMessage.innerText = `${from}: ${msg.payload}`;
    messageBox.value && messageBox.value.appendChild(newMessage);
  }

  if (msg.type === 'attachment') {
    const spanTag = document.createElement("span");
    spanTag.innerHTML = `${from}: `
    // const urlCreator = window.URL || window.webkitURL;
    // const imageUrl = urlCreator.createObjectURL(msg.payload);
    // imgTag.src = imageUrl;
    // imgTag.src = 'data:image/jpeg;base64,' + customEncode(msg.payload);
    imgTag.src = URL.createObjectURL(msg.payload);
    // imgTag.src = msg.payload;
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
    rawData = event.target?.result

    const obj = {
      type: 'attachment',
      payload: file
    }

    msgGeneration(obj, "Me")
    // sendEvent(obj)
  }

  reader.readAsArrayBuffer(file);
  getConnection.value && getConnection.value.send(rawData);
}

function blobToBase64(blob: Blob) {
  return new Promise((resolve, _) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result);
    reader.readAsDataURL(blob);
  });
}

</script>

<template>
  <main>
    <h1>Messaging box</h1>
    <form @submit.prevent="sendMsg">
      <div ref="messageBox"></div>
      <input ref="inputTag" type="text" v-model="messageInput" />
      <input type="file" @change="handleFileInput" />
      <br />
      <button ref="sendBtn" :disabled="isInputEmpty">Send Message</button>
    </form>
  </main>
</template>
