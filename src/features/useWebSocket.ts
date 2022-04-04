import { computed, ref } from "vue";
import { getToken } from "@/api/config";

const token = getToken();
const wsUrl = "ws://localhost:8889/connect";
const wsConnect = ref(null);
const wsMessages = ref([]);

export default () => {
  const setConnection = () => {
    wsConnect.value = new WebSocket(`${wsUrl}/?token=${token}`);
    wsConnect.value.addEventListener("open", (event) => {
      console.log("Successfully connected to the websocket server...");
    });
    wsConnect.value.addEventListener("message", (event) =>
      handleNewMessage(event)
    );
    wsConnect.value.addEventListener("close", (event) => {
      console.error("Websocket closed unexpectedly: ", event);
    });
  };

  const waitForOpenConnection = () => {
    // We use this to measure how many times we have tried to connect to the websocket server
    // If it fails, it throws an error.
    return new Promise((resolve, reject) => {
      const maxNumberOfAttempts = 10;
      const intervalTime = 200;

      let currentAttempt = 0;
      const interval = setInterval(() => {
        if (currentAttempt > maxNumberOfAttempts - 1) {
          clearInterval(interval);
          reject(new Error("Maximum number of attempts exceeded."));
        } else if (wsConnect.value.readyState === wsConnect.value.OPEN) {
          clearInterval(interval);
          resolve();
        }
        currentAttempt++;
      }, intervalTime);
    });
  };

  const handleNewMessage = (event) => {
    const data = JSON.parse(event.data);
    const message = data.message;
    wsMessages.value.push(message);
  };

  const sendEvent = async (payload: any) => {
    console.log("in sendEvent func..");

    if (wsConnect.value.readyState !== wsConnect.value.OPEN) {
      try {
        await waitForOpenConnection(wsConnect.value);
        wsConnect.value.send(payload);
      } catch (err) {
        console.error("Error while sending event via websocket: ", err);
        console.error(err);
      }
    } else {
      wsConnect.value.send(payload);
    }
  };

  const getConnection = computed(() => wsConnect.value);
  const getWebsocketMessages = computed(() => wsMessages.value);

  return {
    setConnection,
    sendEvent,
    getConnection,
    getWebsocketMessages,
  };
};
