const WebSocket = require("ws");

// Create a WebSocket server on port 3000
const wss = new WebSocket.Server({ port: 3000 });

console.log("WebSocket server is running on ws://localhost:3000");

// Helper function to broadcast messages to all connected clients
const broadcast = (data, sender) => {
  const messageObject = { sender, message: data };
  const messageString = JSON.stringify(messageObject); // Convert to JSON string

  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(messageString); // Send JSON string
    }
  });
};


// Event listener for when a client connects
wss.on("connection", (ws) => {
  console.log("A new client connected");

  // Notify everyone that a new user has joined
  broadcast("A new user has joined the chat!", "System");

  // Event listener for messages from a client
  ws.on("message", (data) => {

    console.log("Received message:", data);
    
    broadcast( data , "User"); // Broadcast the message to all clients
  });

  // Event listener for when a client disconnects
  ws.on("close", () => {
    console.log("A client disconnected");
    broadcast("A user has left the chat!", "System");
  });

  // Event listener for errors
  ws.on("error", (error) => {
    console.error("WebSocket error:", error);
  });
});
