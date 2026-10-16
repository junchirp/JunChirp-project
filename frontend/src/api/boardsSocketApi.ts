import { io } from 'socket.io-client';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL as string;
const SOCKET_URL = BASE_URL.replace(/\/api\/?$/, '');

export const boardsSocket = io(`${SOCKET_URL}/boards`, {
  autoConnect: false,
  withCredentials: true,
});
