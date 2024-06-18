import { io } from "socket.io-client";

const socket = io('http://35.196.84.245' || "http://localhost:3000", {
    autoConnect: false,
});

export default socket;
