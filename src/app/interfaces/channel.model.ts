export interface Channel {
    chanId: string,
    chanName: string,
    chanDescription?: string,
    chanCreatedByUser: string,
    userIds: string[],
    textIds?: {
        textId: string,
        text: string,
        senderId: string,
        timestamp: number,
        addedFiles: string,
        taggedUser: [],
        addedReactions: {
            emoticon: {
                iconURL: string,
                reactAddFrom: [],
                reactCount: number
            }
        }
    }[],
    thread?: {
        threadUpdatedAt: number,
        threadTextIds: {
            threadText: string,
            threadSenderId: string,
            threadTimestamp: number,
            threadAddedFiles: string,
            threadTaggedUser: [],
            threadAddedReactions: {
                threadEmoticon: {
                    threadIconURL: string,
                    threadReactAddFrom: [],
                    threadReactCount: number,
                }
            }
        }
    }[]
}