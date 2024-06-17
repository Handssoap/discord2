"use client"

import qs from "query-string"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { ActivitySquareIcon, Video, VideoOff } from "lucide-react"  

import { ActionTooltip } from "../action-tooltip"

export const ChatVideoButton = () => {
    const pathname = usePathname()
    const searchParams = useSearchParams()
    const router = useRouter()

    const isVideo = searchParams?.get("video")
    
    const Icon = isVideo ? VideoOff : Video
    const tooltipLabel = isVideo ? "End video call" : "Start video call"    
    const onClick = () => {
        const url = qs.stringifyUrl({ url: pathname || "",
            query: {
                video: isVideo ? undefined : true,  
            }
         }, { skipNull: true})
         router.push(url)
        }
    return  (
        <ActionTooltip side="bottom" label={tooltipLabel}>
            <button onClick={onClick} className="hover:opacity-75 transition mr-4">
                <Icon className="w-6 h-6 text-zinc-500"/>
            </button>
        </ActionTooltip>    


    )
}