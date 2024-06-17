"use client";
import { Search } from "lucide-react";
import { useEffect, useState } from "react";
import { CommandDialog } from "@/components/ui/command"; // Add this line
import { CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "../ui/command";
import { useRouter } from "next/navigation";
import { useParams } from "next/navigation";

interface ServerSearchProps {
    data: {
        label: string;
        type: "channel" | "member",
        data: {
            icon: React.ReactNode;
            name: string;
            id: string;
        } [] | undefined
    }[] 
}
export const ServerSearch = ({
    data
}: ServerSearchProps) => {
    const [open, setOpen] = useState(false);
    const router = useRouter(); 
    
    const params = useParams();
    
    
    const onClick = ({id, type}: {id: string; type: "channel" | "member"}) => {
        setOpen(false);
    if (type === "member") {
            return router.push(`/servers/${params?.serverId}/conversations/${id}`)
    }
    if (type === "channel") {
        return router.push(`/servers/${params?.serverId}/channels/${id}`)
}

}
    useEffect(() => {
        const down = (e: KeyboardEvent) => {
            if (e.key === "k" && e.ctrlKey) {
                e.preventDefault();
                setOpen((open) => !(open));
            }
        }
        document.addEventListener("keydown", down);
        return () => document.removeEventListener("keydown", down);
    },[])

    return (
        <div>
            <button onClick={()=> setOpen(true)} className="group px-2 py-2 rounded-md flex w-full iterms-center gap-x-2 hover:bg-zinc-300 dark:text-zinc-400 transition">
            <Search className="w-4 h-6 text-zinc-500 "/>
            <p className="font-semibold text-sm text-zinc-500">
                Search
            </p>
            <kbd className="pointer-events-none inline-flex h-5 select-none items-cetner gap-1 rounder border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground ml-auto">
                <span className="text-s flex">CTRL+K</span>
            </kbd>
            </button>
            <CommandDialog open={open} onOpenChange={setOpen}>
            
            <CommandInput className="px-10" placeholder="Search all channels and members"/>
                
                <CommandList>
                    <CommandEmpty>
                        No results found
                    </CommandEmpty>
                    {data.map(({label, type, data}) => {if (!data?.length) return null
                        return (
                            <CommandGroup key={label} heading={label}>
                                 {data?.map(({ id, icon, name }) => { // Add the initializer for 'id'
                                    return (
                                        <CommandItem key={id} onSelect={()=> onClick({ id, type })}>
                                        {icon} <span>{name}</span> 
                                        </CommandItem>
                                    )
                                 })}
                                
                            </CommandGroup>
                        )
                     })}
                    </CommandList>  
            </CommandDialog>
        </div>
    )
}
