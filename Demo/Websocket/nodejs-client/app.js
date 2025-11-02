const WebSocket = require("ws");
const { config } = require("./lib/utils/config");

const socketUrl = `wss://${config.wsid}.execute-api.ap-southeast-1.amazonaws.com/${config.stage}?userId=0`;
console.log("Socket URL:", socketUrl);
const ws = new WebSocket(socketUrl);

const timeout = setTimeout(() => {
  ws.close();
}, 300000); // 5 minute timeout

ws.on("open", () => {
  console.log("WebSocket connected, waiting for MFA code...");
  setTimeout(() => {
    ws.send(
      JSON.stringify({
        action: "sendMessage",
        message: "Hi, I am user 0. Is anyone there?",
        recepientId: "27",
      })
    );
  }, 1000);
});

ws.on("message", (data) => {
  const message = Buffer.from(data).toString();
  console.log("Received socket message:", message);
});

ws.on("error", (error) => {
  console.error("WebSocket error:", error);
});
