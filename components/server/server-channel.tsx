"use client"

import { cn } from "@/lib/utils";
import { MemberRole, Server, Channel, ChannelType } from "@prisma/client";
import { Edit, Hash, Mic, Trash, Video, Lock } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { ActionTooltip } from "../action-tooltip";
import { ModalType, useModal } from "@/app/hooks/use-modal-store";


interface ServerChannelProps {
channel: Channel;
server: Server;
role?: MemberRole;
}
const iconMap = {
    [ChannelType.TEXT]: <Hash className="mr-2 h-4 w-4"/>,
    [ChannelType.AUDIO]: <Mic className="mr-2 h-4 w-4"/>,
    [ChannelType.VIDEO]: <Video className="mr-2 h-4 w-4"/>, 
}
export const ServerChannel = (
    { channel, server, role }: ServerChannelProps
) => {
    const { onOpen } = useModal();
    const params = useParams();
    const router = useRouter();
    const Icon = iconMap[channel.type]

    const onClick = () => {
        router.push(`/servers/${params?.serverId}/channels/${channel.id}`)
    
    }

    const onAction = (e: React.MouseEvent, action: ModalType) => {
        e.stopPropagation();
        onOpen(action, { channel, server })
    }

return (
    <button onClick={onClick} className={cn("group px-2 py-2 rounded-md flex items-center w-full hover:bg-zinc-400 ")}>
        {Icon} <p className={cn("line-clamp-1 font-semibold text-sm")}> {channel.name} </p>
        {channel.name !== "general" && role !== MemberRole.GUEST && (
            <div className="ml-auto flex items-center gap-x-2">
                <ActionTooltip label="Edit">
                    <Edit className="hidden group-hover:block w-4 h-4 hover:text-zinc-600" onClick={(e) => onAction(e, "editChannel")}/>
                </ActionTooltip>
                <ActionTooltip label="Delete">
                    <Trash className="hidden group-hover:block w-4 h-4 hover:text-zinc-600" onClick={(e) => onAction(e, "deleteChannel")}/>
                </ActionTooltip>
                </div>
                )}
                {channel.name==="general" && (
                <Lock className="ml-auto w-4 h-4 "/>
            )}
        
        </button>
)
}