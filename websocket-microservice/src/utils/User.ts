import { WebSocket } from "ws";

export interface User {
    email?: string;
    token?: string;
    ws: WebSocket;
}
