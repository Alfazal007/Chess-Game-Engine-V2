export interface ConnectMessage {
    email: string;
    token: string;
}

export interface ChatMessage {
    message: string;
    gameId: string;
}

export interface MoveMessage {
    from: string;
    to: string;
    gameId: string;
}

export interface ExchangeMessages {
    type: string;
    connectPayload?: ConnectMessage;
    chatPayload?: ChatMessage;
    movePayload?: MoveMessage;
}
