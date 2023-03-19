const WebSocket = require("ws");

const server = new WebSocket.Server({ port: 8080 });

server.on("connection", (socket) => {
  console.log("新的连接已建立", Date.now());
  socket.on("message", (data) => {
    const res = JSON.parse(data);
    console.log(res);

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
