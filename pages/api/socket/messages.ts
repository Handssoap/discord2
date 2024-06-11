import { currentProfilePages } from "@/lib/current-profile.pages";
import { NextApiResponseServerIo } from "@/types";
import { NextApiRequest, NextApiResponse } from "next";
import { db } from "@/lib/db";
export default async function handler(
    req: NextApiRequest,
    res: NextApiResponseServerIo,
){
    if(req.method !== "POST"){
        return res.status(405).json({error: "Method Not Allowed"})
    }
    try{
        const profile = await currentProfilePages(req)
        const { content, fileUrl } = req.body
        const { serverId, channelId } = req.query   

        if (!profile) {
            return res.status(401).json({error: "Unauthorized"})
        }
        if (!serverId){
            return res.status(400).json({error: "serverId is required"})
        
        }
        if(!channelId){
            return res.status(400).json({error: "channelId is required"})
        }
        if(!content){
            return res.status(400).json({error: "contnet or fileUrl is required"})
        }
        const server = await db.server.findFirst({
            where: {
                id: serverId as string,
                members: {
                    some: {
                        profileId: profile.id   
                    }
                }
            },
            include: {
                members: true,
            }
        })
        if(!server){
            return res.status(404).json({error: "Server Not Found"})
        }
        const channel = await db.channel.findFirst({
            where: {
                id: channelId as string,
                serverId: server.id as string,
            }
        })

        if(!channel){
            return res.status(404).json({error: "Channel Not Found"})
        }

        const member = server.members.find((member) => member.profileId === profile.id)
        if(!member){
            return res.status(403).json({error: "Forbidden"})
        }

        const message = await db.message.create({
            data: {
                content,
                fileUrl,
                memberId: member.id,
                channelId: channel.id,
            },
            include: {
                member: {
                    include: {
                        profile: true
                    }
                }
            }
        })
        const channelKey = `chat:${channelId}:messages`

        res?.socket?.server?.io?.emit(channelKey, message)
        return res.status(200).json(message)
    } catch(error) {
        console.log("[MESSAGES_POST]", error)
        return res.status(500).json({error: "Internal Server Error"})   
    }
}