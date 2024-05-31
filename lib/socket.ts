import { io } from "socket.io-client";
import { API_URL } from '@env'

const socket = io('https://6fce-177-203-139-185.ngrok-free.app' || "http://localhost:3000", {
    autoConnect: false,
});

export default socket;
