// const WebSocketClient = require("websocket").client;
import { computed, ref } from "vue";
import client from "websocket";
// var WebSocketClient = require('websocket').client;

const wsUrl = "ws://localhost:8888/";
const wsClient = ref();

export default () => {
  const setConnection = () => {
    wsClient.value = client.WebSocketClient();
    wsClient.value.connect(wsUrl, "echo-protocol");

    wsClient.value.on("connectFailed", function (error: { toString: () => string; }) {
      console.log("Connect Error: " + error.toString());
    });
    
    wsClient.value.on("connect", function (connection: { on: (arg0: string, arg1: { (error: any): void; (): void; (message: any): void; }) => void; connected: any; sendUTF: (arg0: string) => void; }) {
      console.log("WebSocket Client Connected");
      connection.on("error", function (error: { toString: () => string; }) {
        console.log("Connection Error: " + error.toString());
      });
      connection.on("close", function () {
        console.log("echo-protocol Connection Closed");
      });
      connection.on("message", function (message: { type: string; utf8Data: string; }) {
        if (message.type === "utf8") {
          console.log("Received: '" + message.utf8Data + "'");
        }
      });
    
      function sendNumber() {
        if (connection.connected) {
          const number = Math.round(Math.random() * 0xffffff);
          connection.sendUTF(number.toString());
          setTimeout(sendNumber, 1000);
        }
      }
      sendNumber();
    });
  };

  const getConnection = computed(() => wsClient.value)

  return {
    setConnection,
    wsClient: getConnection.value,
  };

}


