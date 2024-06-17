import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function DELETE(
    req: Request,
    { params }: { params: { memberId: string } }
): Promise<any> {
    try {
        const profile = await currentProfile();
        const { searchParams } = new URL(req.url);  
        const serverId = searchParams.get("serverId");
        if (!profile) {
            return { status: 401, body: { message: "Unauthorized" } };
        }
        if(!serverId) {
            return { status: 400, body: { message: "ServerId missing" } };
        }   
        if(!params.memberId) {
            return { status: 400, body: { message: "MemberId missing" } };
        }
        const server = await db.server.update({
            where: { 
                id: serverId,
                profileId: profile.id,
             },
            data: {
                members: {
                    deleteMany: {
                        id: params.memberId,
                        profileId: {
                            not: profile.id
                        }
                    }
                }
            },
            include: {
                members: {
                    include: {
                        profile: true,
                    },
                    orderBy: {
                        role: "asc"
                    }
                }
            
            }
        }); 
        return NextResponse.json(server);
    } catch (error) {    
        console.error("MEMBER_ID_DELETE_ERROR", error);
        return new NextResponse("Internal Server Error" , { status: 500 });
    }
}

export async function PATCH(
    req: Request,
    { params }: { params: { memberId: string } }
) {
    try {
        const profile = await currentProfile();
        const { searchParams } = new URL(req.url);  
        const { role } = await req.json();
        const serverId = searchParams.get("serverId");
        if (!profile) {
            return { status: 401, body: { message: "Unauthorized" } };
        }
        if(!serverId) {
            return { status: 400, body: { message: "ServerId missing" } };
        }   
        if(!params.memberId) {
            return { status: 400, body: { message: "MemberId missing" } };
        }
        const server = await db.server.update({
            where: { 
                id: serverId,
                profileId: profile.id,
             },
            data: {
                members: {
                    update: {
                        where: { id: params.memberId, profileId: { 
                            not: profile.id 
                        
                        }},
                        data: { role }
                    }
                }},
                include: {
                    members: {
                        include: {
                            profile: true,
                        },
                        orderBy: {
                            role: "asc"
                        }
                    }
                
                }
            
        }); 
        return NextResponse.json(server);
    } catch (error) {    
        console.error(error);
        return { status: 500, body: { message: "Internal Server Error" } };
    }
}