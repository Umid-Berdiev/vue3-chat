<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import useWebSocket from '@/features/useWebSocket'

const { setConnection, getConnection, sendEvent } = useWebSocket()
const messageBox = ref<HTMLDivElement>();
const messageInput = ref<string>('');
const inputTag = ref<HTMLInputElement>();
const fileInput = ref<File>();
const sendBtn = ref<HTMLButtonElement>();
const isInputEmpty = computed(() => messageInput.value == '' ? true : false)

onMounted(async () => {
  inputTag.value?.focus()
  setConnection()

  if (getConnection.value) {
    getConnection.value.binaryType = "arraybuffer";
    getConnection.value.onmessage = (event: any) => {
      const { data } = event;

      if (data instanceof ArrayBuffer) {
        // const blob = new File([data], "filename")
        const bytes = new Uint8Array(data);
        const blob = new Blob([bytes]);

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

  }
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
  sendEvent(text);
}

function msgGeneration(msg: any, from: string) {
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

    imgTag.src = URL.createObjectURL(msg.payload);

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
  }

  reader.readAsArrayBuffer(file);
  sendEvent(file);
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
      <button ref="sendBtn" :disabled="isInputEmpty">Send Message</button>
      <input style="margin-left: 1rem;" type="file" @change="handleFileInput" />
    </form>
  </main>
</template>
