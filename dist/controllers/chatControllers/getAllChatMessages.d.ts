declare const getAllChatMessagesController: (roomId: string, token: string) => Promise<{
    success: boolean;
    errorMessage?: any;
    payload?: any;
}>;
export { getAllChatMessagesController };
