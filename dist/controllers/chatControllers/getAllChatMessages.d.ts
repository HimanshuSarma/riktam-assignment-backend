declare const getAllChatMessagesController: (roomId: string, userId: string) => Promise<{
    success: boolean;
    errorMessage?: any;
    payload?: any;
}>;
export { getAllChatMessagesController };
