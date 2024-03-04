declare const removeUsersFromGroupController: (users: Array<string>, groupId: string, userId: string) => Promise<{
    success: boolean;
    errorMessage?: any;
    payload?: any;
}>;
export { removeUsersFromGroupController };
