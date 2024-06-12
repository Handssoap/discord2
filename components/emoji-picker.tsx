"use client"
import {
Popover,
PopoverContent,
PopoverTrigger
} from "@/components/ui/popover"
import { Smile } from "lucide-react"

import Picker from "@emoji-mart/react"
import data from "@emoji-mart/data"
import { useTheme } from "next-themes"
interface EmojiPickerProps {
    onChange: (valie: string) => void   
}

export const EmojiPicker = 
        ({onChange}: EmojiPickerProps) => {
        const { resolvedTheme } = useTheme();

        return (
                
            <Popover>
                <PopoverTrigger>
                    <Smile className="text-zinc-400 hover:text-zinc-500 transition"/>
                    </PopoverTrigger> 
                    <PopoverContent side="right" sideOffset={40} className="bg-transparent border-none shadow-non drop-shadow-none mb-14">
                                <Picker theme={resolvedTheme} data={data} onEmojiSelect={(emoji: any) => onChange(emoji.native)}/>
                        </PopoverContent>
                </Popover>
        )

}