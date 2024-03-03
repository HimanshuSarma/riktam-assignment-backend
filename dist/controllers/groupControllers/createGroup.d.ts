declare const createGroupController: ({ name, users, token }: {
    name: string;
    users: Array<string>;
    token: string;
}) => Promise<{
    success: boolean;
    errorMessage?: string;
    payload?: any;
}>;
export { createGroupController };
