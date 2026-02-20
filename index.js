import express from "express";
import { DatabaseSync } from "node:sqlite";
import { fileURLToPath } from "url";
import { dirname } from "path";
import { createServer } from "http";
import { WebSocketServer } from "ws";

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

process.on("SIGINT", () => {
  wss.clients.forEach((client) => {
    client.close();
  });
  server.close(() => {
    shutdownDB();
  });
});

const wss = new WebSocketServer({ server: server });
wss.on("connection", (ws) => {
  const numClients = wss.clients.size;
  console.log("Clients connected: ", numClients);

  wss.broadcast(`Current visitors ${numClients}`);
  if (ws.readyState === ws.OPEN) {
    ws.send("Welcome to my server.");
  }
  db.exec(`insert into visitors (count, time)
    values
    (${numClients}, datetime('now')) 
  `);
  ws.on("close", () => {
    wss.broadcast(`Current visitors: ${numClients}`);
    console.log("A client has disconnected");
  });
});

wss.broadcast = (data) => {
  wss.clients.forEach((client) => {
    client.send(data);
  });
};

// Initialize database
const db = new DatabaseSync(":memory:");
db.exec(`
  CREATE TABLE IF NOT EXISTS visitors(
  count integer, 
  time text
  )
`);

function getCounts() {
  const rows = db.prepare("select * from visitors").all();
  console.table(rows);
}

function shutdownDB() {
  getCounts();
  console.log("Shutting down DB");
}
