"use client";

import { AlignVerticalJustifyEnd, FileIcon, X } from "lucide-react"
import Image from "next/image"
import { UploadDropzone } from "@/lib/uploadthing";
import "@uploadthing/react/styles.css";

interface FileUploadProps {
    onChange: (url?: string) => void;
    value: string
    endpoint: "messageFile" | "serverImage"
}

export const FileUpload = ({
    onChange,
    value,
    endpoint
}: FileUploadProps) => {
    const fileType = value?.split(".").pop();

    if (value && fileType != "pdf") {
        return (
            <div className="relative h-20 w-20">
                <Image 
                fill
                src = {value}
                alt="Upload"
                className="rounded-full"
                />
                <button onClick={() => onChange("")}
                className="bg-rose-500 twxt-white p-1 rounded-full absolute top-0 right-0 shadow-sm hover:bg-red-700">
                    <X className="h-4 w-4" />
                </button>
                
            </div>
        )
    }

    if(value && fileType === "pdf") {
        return (
            <div className="flex relative items-center p-2 mt-2 bg-background/10 rounded-md">
                <FileIcon className="h-10 w-10 fill-indigo-300 stroke-indigo-400"/>
                <a href={value} target="_blank" rel="noopener noreferrer" className="ml-2 text-sm text-indigo-500 hover:underline">
                    {value}
                </a>
                <button onClick={() => onChange("")}
                className="bg-rose-500 twxt-white p-1 rounded-full absolute -top-2 -right-2 shadow-sm hover:bg-red-700">
                    <X className="h-4 w-4" />
                </button>

            </div>
        )
    }
    return (
        <UploadDropzone
        endpoint={endpoint}
        onClientUploadComplete={(res) => {
            onChange(res?.[0].url);
        }}
        onUploadError={(error: Error) => {
            console.log(error)
        }}
        />
    )
}
 