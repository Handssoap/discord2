"use client"

import { cn } from "@/lib/utils";
import { Member, MemberRole, Profile, Server } from "@prisma/client";
import { Shield, ShieldAlert, ShieldCheck } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { UserAvatar } from "../user-avatar";

interface ServerMemberProps {
    member: Member & { profile: Profile };
    server: Server
}
const roleIconMap = {
[MemberRole.GUEST]: null, 
[MemberRole.MODERATOR]: <ShieldCheck></ShieldCheck>,
[MemberRole.ADMIN]: <ShieldAlert className="text-rose-400"/>,

}
export const ServerMember = ({
    member,
    server,
}: ServerMemberProps) => {
    const params = useParams();
    const router = useRouter();
    const icon = roleIconMap[member.role];

    const onClick = () => {
        router.push(`/servers/${params?.serverId}/conversations/${member.id}`)
    }
    return (
        <button onClick={onClick} className={cn(
            "group px-2 py-2 rounded-md flex items-center gap-x-2 w-full hover:bg-zinc-400"
        )}>
            <UserAvatar src={member.profile.imageUrl}
            className="h-8 w-8 md:h-8 md:w-8"/>
            <p className="">
                {member.profile.name}
            </p>
            {icon}
        </button>
    )   
}