import { Server } from "socket.io";

export const initializeSocket = (server) => {
  const io = new Server(server, { cors: { origin: "*" } });

  io.on("connection", (socket) => {
    console.log("A user connected");

    // Join a game room
    socket.on("joinGame", (gameId) => {
      socket.join(gameId);
      console.log(`User joined game room ${gameId}`);
    });

    // Wait for subs updates in a game
    socket.on("waiting_for_subs", (gameId) => {
      socket.join(gameId);
      console.log(`User is waiting for subs in game ${gameId}`);
    });

    // Wait for users to join
    socket.on("waiting_for_users", (gameId) => {
      socket.join(gameId);
      console.log(`Game: ${gameId} - waiting for users to join`);
    });

    socket.on("disconnect", () => {
      console.log("User disconnected");
    });
  });

  return io;
};
