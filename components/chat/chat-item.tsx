"use client"

import { Member, MemberRole, Profile } from "@prisma/client"
import { UserAvatar } from "../user-avatar"
import { ActionTooltip } from "../action-tooltip"
import { Edit, FileIcon, ShieldAlert, ShieldCheck, Trash } from "lucide-react"
import Image from "next/image"
import { useEffect, useState } from "react"
import { cn } from "@/lib/utils"
import qs from "query-string"

import axios from "axios"
import * as z from "zod"
import { useForm } from "react-hook-form"

import { zodResolver } from "@hookform/resolvers/zod"
import {
    Form, FormControl, FormField, FormItem,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useModal } from "@/app/hooks/use-modal-store"
import { useParams, useRouter } from "next/navigation"

interface ChatItemProps {
    id: string
    content: string
    member: Member & {
        profile: Profile
    }

    timestamp: string
    fileUrl: string | null
    deleted: boolean
    currentMember: Member
    isUpdated: boolean
    socketUrl: string
    socketQuery: Record<string, string>
}

const roleIconeMap = {
    "GUEST": null,
    "MODERATOR": <ShieldCheck className="h-4 w-4 ml-2 text-indigo-500"/>,
    "ADMIN": <ShieldAlert className="h-4 w-4 ml-2 text-red-500"/>
}

const formSchema = z.object({
    content: z.string().min(1)
})
export const ChatItem = ({
    id,
    content,
    member,
    timestamp,
    fileUrl,
    deleted,
    currentMember,
    isUpdated,
    socketUrl,
    socketQuery
}: ChatItemProps) => {
    const fileType = fileUrl?.split(".").pop();
    const isAdmin = currentMember.role === MemberRole.ADMIN;
    const isOwner = member.id === currentMember.id;
    const isModerator = currentMember.role === MemberRole.MODERATOR;
    const canDeleteMessage = !deleted && (isAdmin || isOwner || isModerator);
    const canEditMessage = !deleted && (isOwner) && !fileUrl;
    const isPDF = fileType === "pdf" && fileUrl
    const isImage = fileUrl && !isPDF;
    const params = useParams()
    const router = useRouter()

    const onMemberClick = () => {   
        if (member.id === currentMember.id) {
            return   
         }

         router.push(`/servers/${params?.serverId}/conversations/${member.id}`)
}
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            content: content
        }
    })
    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => { 
            if (event.key === "Escape" ) {
                form.reset({
                    content: content
                })
                setIsEditing(false)
            }
        };
        window.addEventListener("keydown", handleKeyDown)
        return() => window.removeEventListener("keydown", handleKeyDown)
    }, [])


    useEffect(() => {   
        form.reset({
            content: content,
        })
    }, [content])
    const isLoading = form.formState.isSubmitting;
    const onSubmit  = async (values: z.infer<typeof formSchema>) => {
       try {
            const url = qs.stringifyUrl({
                url: `${socketUrl}/${id}`,
                query: socketQuery
            })

            await axios.patch(url, values)
        
            form.reset()
            setIsEditing(false)
       } catch (error) {
           console.error(error)
       }
    }
    const [isEditing, setIsEditing] = useState(false); 
    const { onOpen } = useModal()

    return (
        <div className="relative group flex items-center hover:bg-black/5 p-4 transition w-full">
            <div className="group flex gap-x-2 items-start w-full">
                <div className="cursor-pointer hover:drop-shadow-md transition" onClick={onMemberClick}>
                    <UserAvatar src={member.profile.imageUrl}/>
                </div>
                <div className="flex flex-col w-full">
                    <div className="flex items-center gap-x-2">
                        <div className="flex items-center">
                            <p onClick={onMemberClick} className="font-semibold text-sm hover:underline cursor-pointer text-zinc-300">
                                {member.profile.name}
                            </p>
                            <ActionTooltip label={member.role}>
                                {roleIconeMap[member.role]}
                                </ActionTooltip>
                        </div>
                        <span className="text-xs text-zinc-500 dark:text-zinc-300">
                            {timestamp}
                        </span>
                    </div>
                    <span className="text-zinc-200">
                        {isImage && (
                            <a href={fileUrl} target="_blank" rel="noopener noreferrer" className="relative aspect-square rounded-md mt-2 overflow-hidden border flex items-center bg-secondary h-34 w-34">
                                <Image
                                src = {fileUrl}
                                alt={content}
                                fill
                                className="object-cover"
                                />
                            </a>
                        )}
                        {isPDF && ( 
                             <div className="flex relative items-center p-2 mt-2 bg-background/10 rounded-md">
                             <FileIcon className="h-10 w-10 fill-indigo-300 stroke-indigo-400"/>
                             <a href={fileUrl} target="_blank" rel="noopener noreferrer" className="ml-2 text-sm text-indigo-500 hover:underline">
                                 .PDF
                             </a>
                         </div>
                        )}
                        </span>
                        {!fileUrl && !isEditing && (
                            <p className={cn(" text-zinc-600 dark:text-zinc-300 ", deleted && "dark:text-zinc-400/75 italic text-[13px]")}>
                                {content}
                                {isUpdated && !deleted && (
                                    <span className="text-[10px] text-zinc-400 pl-1">
                                        (edited)
                                    </span>
                                )}
                            </p>
                        )}
                        {!fileUrl && isEditing && (
                            <Form {...form}>
                                <form className="flex items-center gap-x-2 w-full pt-2"
                                onSubmit={form.handleSubmit(onSubmit)}>
                                    <FormField 
                                    control = {form.control}
                                    name="content"
                                    render={({ field }) =>
                                        (
                                            <FormItem className="flex-1">
                                                <FormControl>
                                                    <div className="relative w-full">
                                                        <Input 
                                                        disabled={isLoading}
                                                        className="p-2 bg-zinc-200/90 dark:bg-zinc-700/75 border-none border-0 focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:ring-zinc-500 focus-visible:ring-opacity-50"
                                                        {...field}
                                                        />
                                                        </div> 
                                                </FormControl>
                                            </FormItem>
                                            )}/>
                                             <Button disabled={isLoading} size="sm" variant="primary">
                                    Save
                                </Button>
                                </form>
                                <span className="text-[12px] text-zinc-500 text-pretty">
                                        Press Enter to save, Esc to cancel
                                </span>
                            </Form>
                        )}
                </div>
            </div>
            {canDeleteMessage && (
                <div className="hidden group-hover:flex items-center gap-x-2 absolute p-1 -top-2 right-5 border rounded-sm dark:bg-zinc-900">
                    {canEditMessage && (
                     <ActionTooltip label="Edit">
                            <Edit
                            onClick={() => setIsEditing(true)}
                            className="cursor-pointer ml-auto w-4 h-4 text-zinc-500 hover:text-zinc-700"/>

                     </ActionTooltip>   
                    )}
                    <ActionTooltip label="Delete">
                            <Trash onClick={() =>onOpen("deleteMessage", { apiUrl: `${socketUrl}/${id}`, query: socketQuery })}
                            className="cursor-pointer ml-auto w-4 h-4 text-zinc-500 hover:text-zinc-700"/>

                     </ActionTooltip>
                </div>
            )}
        </div>
    )
}