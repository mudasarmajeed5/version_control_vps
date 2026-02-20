import express from "express";
import { fileURLToPath } from "url";
import { dirname } from "path";
import { createServer } from "http";
import WebSocket, { WebSocketServer } from "ws";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const server = createServer();

app.get("/", (req, res) => {
  res.sendFile(`${__dirname}/index.html`);
});

server.on("request", app);

server.listen(3000, () => {
  console.log("SERVER LISTENING ON PORT 3000");
});

const wss = new WebSocketServer({ server: server });
wss.on("connection", (ws) => {
  const numClients = wss.clients.size;
  console.log("Clients connected: ", numClients);

  wss.broadcast(`Current visitors ${numClients}`);
  if (ws.readyState === ws.OPEN) {
    ws.send("Welcome to my server.");
  }
  ws.on("close", () => {
    wss.broadcast(`Current visitors: ${numClients}`);
    console.log("A client has disconnected");
  });
});

wss.broadcast = (data) => {
  wss.clients.forEach((client)=>{
    client.send(data)
  })
};
