declare const deleteMessageController: (messageId: string, token: string) => Promise<{
    success: boolean;
    errorMessage?: any;
    payload?: any;
}>;
export { deleteMessageController };
