export interface PrivateMessage {
    privMsgId: string,
    userIds: [],
    textId: {
        text: string,
        timestamp: number,
        addedFiles: string,
        addedReactions: {
            emoticon: {
                iconURL: string,
            }
        }
    },
}