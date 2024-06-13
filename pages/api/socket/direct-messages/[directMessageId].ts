import { currentProfilePages } from "@/lib/current-profile.pages";
import { db } from "@/lib/db";
import { NextApiResponseServerIo } from "@/types";
import { MemberRole } from "@prisma/client";
import { NextApiRequest } from "next";

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponseServerIo,
    
) {
    if (req.method !== "DELETE" && req.method !== "PATCH") {
        return res.status(405).json({ error: "Method Not Allowed" })
    }

    try {
        const profile = await currentProfilePages(req)
        const { directMessageId, conversationId } = req.query
        const { content } = req.body

        if(!profile){
            return res.status(401).json({ error: "Unauthorized" })
        }
        if(!conversationId){

            return res.status(400).json({ error: "serverId is required" })
        }
       
        if(!directMessageId){
            return res.status(400).json({ error: "messageId is required" })
        }

        const conversation = await db.conversation.findFirst({
            where: {
                id: conversationId as string,
                OR: [
                    {
                        memberOne: {
                            profileId: profile.id
                        }
                    },
                    {
                        memberTwo: {
                            profileId: profile.id
                        }
                    }
                ]
            },
            include: {
                memberOne: {
                    include: {
                        profile: true
                    }
                },
                memberTwo: {
                    include: {
                        profile: true
                    }
                }
            }
        })

        if(!conversation){
            return res.status(404).json({ error: "Conversation Not Found" })
        }
        const member = conversation.memberOne.profileId === profile.id ? conversation.memberOne : conversation.memberTwo
        let directMessage = await db.directMessage.findFirst({
            where: {
                id: directMessageId as string,
                conversationId: conversationId as string
            },
            include: {
                member: {
                    include: {
                        profile: true
                    }
                }
            }
        })

        if(!directMessage){
            return res.status(404).json({ error: "Message Not Found" })
        }
        const isMessageOwner = directMessage.memberId === member.id
        const isAdmin = member.role === MemberRole.ADMIN
        const isModerator = member.role === MemberRole.MODERATOR    
        const canModifyMessage = isMessageOwner || isAdmin || isModerator  
        if(!canModifyMessage){
            return res.status(403).json({ error: "Forbidden" })
        }

        if(req.method === "DELETE"){
            directMessage = await db.directMessage.update({
                where: {
                    id: directMessageId as string
                },
                data: {
                    fileUrl: null,
                    content: "This message has been deleted"
                },
                include: {
                    member: {
                        include: {
                            profile: true
                        }
                    }
                }
            })
        }
        if(req.method === "PATCH"){
            if(!isMessageOwner) {
                return res.status(401).json({ error: "Forbidden" })
            }
            directMessage = await db.directMessage.update({
                where: {
                    id: directMessageId as string
                },
                data: {
                    content,
                },
                include: {
                    member: {
                        include: {
                            profile: true
                        }
                    }
                }
            })
        }

        const updateKey = `chat:${conversation.id}:message:update`;

        res?.socket?.server?.io?.emit(updateKey, directMessage)

        return res.status(200).json(directMessage);
    } catch (error) {
        console.error(error)
        return res.status(500).json({ error: "Internal Server Error" })
    }
}