const WebSocket = require("ws");

const server = new WebSocket.Server({ port: 8080 });

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
server.on("connection", (socket) => {
  console.log("新的连接已建立", Date.now());
  socket.on("message", (data) => {
    const res = JSON.parse(data);
    console.log(format(res));

    // Echo the received message back to each client
    // server.clients.forEach((client) => {
    //   if (client.readyState === WebSocket.OPEN) {
    //     client.send(data);
    //   }
    // });
  });

  socket.on("close", () => {
    console.log("Client disconnected");
  });
});

console.log("ws://127.0.0.1:8080");
