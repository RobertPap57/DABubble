export interface Channel {
    chanId: [],
    chanName: string,
    chanDescription: string,
    chanCreatedByUser: string,
    userIds: [],
    textId: {
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
    },
    threadIDs: [
        {
            threadId: string,
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
        }
    ]
}