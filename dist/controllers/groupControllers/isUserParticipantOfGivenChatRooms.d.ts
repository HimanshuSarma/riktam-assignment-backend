declare const isUserParticipantOfGivenChatRooms: (chatRooms: Array<string>, userId: string) => Promise<{
    success: boolean;
    errorMessage?: any;
    payload?: any;
}>;
export { isUserParticipantOfGivenChatRooms };
