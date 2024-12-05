const WebSocket = require("ws");

const wss = new WebSocket.Server({ port: 8080 });

wss.on("connection", (ws) => {
  console.log("新的连接已建立", Date.now());
  ws.on("message", (buffer) => {
    const data = buffer.toString();
    console.log("message data: ", data);
    const res = JSON.parse(data);
    console.log(format(res));

    // ws.clients.forEach((client) => {
    //   if (client.readyState === WebSocket.OPEN) {
    //     client.send(data);
    //   }
    // });
  });

  ws.on("close", () => {
    console.log("Client disconnected");
  });

  ws.on("error", console.error);

  // ws.send("something");
});

console.log("ws://127.0.0.1:8080");
function format(data) {
  const obj = {
    ...data,
  };
  if (
    data.username &&
    data.username.match(/.*?<span class="I1YlCmYh">(.*?)<\/span>.*?/)
  ) {
    obj.username = data.username.match(
      /.*?<span class="I1YlCmYh">(.*?)<\/span>.*?/
    )[1];
  }
  return obj;
}
