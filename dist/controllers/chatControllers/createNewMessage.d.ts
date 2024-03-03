declare const createNewMessageController: (message: string, roomId: string, token: string) => Promise<{
    success: boolean;
    errorMessage?: any;
    payload?: any;
}>;
export { createNewMessageController };
