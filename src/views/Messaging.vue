<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import useWebSocket from '@/features/useWebSocket'
import { each } from 'lodash'

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

  if (getConnection.value)
    getConnection.value.onmessage = (event: any) => {
      console.log('event in onmessage event', event);
      const { data } = event;
      // const data = JSON.parse(event.data);
      console.log('data in onmessage event', data);

      // if (event.data instanceof Blob) {
      if (data.type === 'attachment') {
        var arrayBufferView = new Uint8Array(data.payload);
        let blob = new Blob([arrayBufferView.buffer]);
        // let blob = new Blob([data.payload]);

        msgGeneration({
          type: 'attachment',
          data: blob
        }, "Server");

      } else
        msgGeneration({
          type: 'text',
          data: JSON.parse(data.toString()).payload
        }, "Server");
    };

});

async function sendMsg() {
  const text = messageInput.value;
  messageInput.value = ''
  inputTag.value?.focus()
  const obj = {
    type: 'text',
    data: text
  }
  msgGeneration(obj, "Me");
  getConnection.value?.send(JSON.stringify({
    type: 'text', payload: text
  }));
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
    // imgTag.src = 'data:image/png;base64,' + msg.data.toString();
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
    rawData = event.target?.result

    msgGeneration({
      type: 'attachment',
      data: file
    }, "Me")

    getConnection.value?.send(JSON.stringify({
      type: 'attachment',
      payload: file
    }))
  }

  reader.readAsArrayBuffer(file);

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
