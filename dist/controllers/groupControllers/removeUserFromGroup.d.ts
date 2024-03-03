declare const removeUsersFromGroupController: (users: Array<string>, groupId: string, token: string) => Promise<{
    success: boolean;
    errorMessage?: any;
    payload?: any;
}>;
export { removeUsersFromGroupController };
