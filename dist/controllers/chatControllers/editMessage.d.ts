declare const editMessageController: (message: string, messageId: string, token: string) => Promise<{
    success: boolean;
    errorMessage?: any;
    payload?: any;
}>;
export { editMessageController };
