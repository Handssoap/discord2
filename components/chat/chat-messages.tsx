"use client"

import { format } from "date-fns"
import { Member, Message, Profile } from "@prisma/client"
import { ChatWelcome } from "./chat-welcome"
import { useChatQuery } from "@/app/hooks/use-chat-query"
import { Loader2, ServerCrash } from "lucide-react"
import { Fragment, useRef, ElementRef, useEffect } from "react"
import { ChatItem } from "./chat-item"
import { useChatScroll } from "@/app/hooks/use-chat-scroll"

const DATE_FORMAT = "d MMM yyyy, HH:mm"
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

    const chatRef = useRef<ElementRef<"div">>(null)
    const bottomRef = useRef<ElementRef<"div">>(null)
    useChatScroll({
        chatRef,
        bottomRef,
        loadMore: fetchNextPage,
        shouldLoadMore: !isFetchingNextPage && !!hasNextPage,
        count: data?.pages?.[0]?.items?.length ?? 0,
    
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
        <div ref={chatRef} className="flex-1 flex flex-col py-4 overflow-y-auto">
           {!hasNextPage && <div className="flex-1"/> }
                {!hasNextPage && (<ChatWelcome
                name={name}
                type={type}
                />)}
                {hasNextPage && (
                 <div className="flex justify-center">
                        {isFetchingNextPage ? (
                            <Loader2 className="h-6 w-6 animate-spin my-4 text-zinc-500"/>
                        ) : (
                            <button onClick={() => fetchNextPage()} className="text-zinc-500 text-xs my-4 transition hover:text-zinc-400">
                                Load previous messages
                            </button>
                        )}
                    </div>   
                )}
                <div className="flex flex-col-reverse mt-auto">
                    {data?.pages?.map((group, i) => (
                        <Fragment key={i}>
                            {group.items.map((message: MessageWithMemberWithProfile) => (
                                <ChatItem
                                key = {message.id}
                                id = {message.id}
                                currentMember = {member}
                                content = {message.content}
                                fileUrl={message.fileUrl}
                                member={message.member}
                                timestamp={format(new Date(message.createdAt), DATE_FORMAT)}
                                deleted={message.deleted}
                                isUpdated={message.updatedAt !== message.createdAt}
                                socketUrl={socketUrl}
                                socketQuery={socketQuery}
                                
                                />
                            ))}
                        </Fragment>
                    ))}  
                </div>
                <div ref={bottomRef}/>
        </div>
        
    )
}


