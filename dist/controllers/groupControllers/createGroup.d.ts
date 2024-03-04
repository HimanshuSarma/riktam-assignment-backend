declare const createGroupController: ({ name, users, user }: {
    name: string;
    users: Array<string>;
    user: any;
}) => Promise<{
    success: boolean;
    errorMessage?: string;
    payload?: any;
}>;
export { createGroupController };
