import { Hash, Menu } from "lucide-react"
import { MobileToggle } from "../mobile-toggle";
import { UserAvatar } from "../user-avatar";
import { SocketIndicator } from "../socket-indicator";
import { Chat } from "@livekit/components-react";
import { ChatVideoButton } from "./chat-video-button";

interface ChatHeaderProps { 
    serverId: string;
    name: string;
    type: "channel" | "conversation"
    imageUrl?: string
}

export const ChatHeader = ({
    name,
    type,
    imageUrl,
    serverId
}: ChatHeaderProps) => {
    return (
        <div className="text-md font-semibold px-3 items-center flex h-12 border-neutral-800 border-b-2">
           <MobileToggle serverId={serverId} />
            {type === "channel" && (
                <><Hash className="w-5 h-5 text-zinc-400 mr-2" /><p className="font-semibold">
                </p></>
            )}
            {type === "conversation" && (
                    <UserAvatar src={imageUrl} className="h-8 w-8 md:h-8 md:w-8 mr-2"/>
            )}
            <p className="font-semibold text-md">
                {name}
            </p>
            <div className="ml-auto flex" >
                {type==="conversation" && (
                    <ChatVideoButton/>
            )}
                <SocketIndicator/>
            </div>
        </div>
    )
}