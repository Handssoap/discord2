"use client"

import { Member, Message, Profile } from "@prisma/client"
import { ChatWelcome } from "./chat-welcome"
import { useChatQuery } from "@/app/hooks/use-chat-query"
import { Loader2, ServerCrash } from "lucide-react"
import { Fragment } from "react"


type MessageWithMemberWithProfile = Message & {
member: Member & {
    profile: Profile
}
}
interface ChatMessagesProps {
name: string
member: Member
chatId: string
apiUrl: string
socketUrl: string
socketQuery: Record<string, string>
paramKey: "channelId" | "conversationId"
paramValue: string
type: "channel" | "conversation"
}
export const ChatMessages = ({
name,
member,
chatId,
apiUrl,
socketUrl,
socketQuery,
paramKey,
paramValue,
type
}: ChatMessagesProps) => {
    const queryKey = `chat:${chatId}`
    const { data,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        status,
    } = useChatQuery({
        queryKey,
        apiUrl,
        paramKey,
        paramValue
    })

    if (status === "pending") {
        return (
            <div className="flex-1 flex flex-col items-center justify-center">
                <div className="flex-1"/>
                <Loader2 className="h-7 w-7 text-zinc-500 animate-spin my-4"/>
                <p>
                    Loading messsages!
                </p>
            </div>
        )
    }
    if (status === "error") {
        return (
            <div className="flex-1 flex flex-col items-center justify-center">
                <div className="flex-1"/>
                <ServerCrash className="h-7 w-7 text-zinc-500 animate-spin my-4"/>
                <p>
                    Something went wrong!
                </p>
            </div>
        )
    }
    return (
        <div className="flex-1 flex flex-col py-4 overflow-y-auto">
            <div className="flex-1"/>
                <ChatWelcome
                name={name}
                type="channel"
                />
                <div className="flex flex-col-reverse mt-auto">
                    {data?.pages?.map((group, i) => (
                        <Fragment key={i}>
                            {group.items.map((message: MessageWithMemberWithProfile) => (
                                <div key={message.id}>
                                    {message.content}
                                </div>
                            ))}
                        </Fragment>
                    ))}  
                </div>
        </div>
    )
}