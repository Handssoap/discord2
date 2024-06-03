"use client";


import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { useModal } from "@/app/hooks/use-modal-store";
import { Button } from "../ui/button";
import { useState } from "react";
import axios from "axios";
import router, { useRouter } from "next/navigation";


export const DeleteServerModal = () => {
  const { onOpen, isOpen, onClose, type, data } = useModal()

  const router = useRouter();
  const isModalopen = isOpen && type === "deleteServer"
  const { server } = data
  const [copied, setCopied] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const inviteUrl= `${origin}/invite/${server?.invitecode}`
  const onClick = async () => { 
    try {

      setIsLoading(true)
      await axios.delete(`/api/servers/${server?.id}/delete`)
      
      onClose()
      router.refresh();
      router.push("/")
    } catch(error) {
      console.error(error)
    } finally {
      setIsLoading(false)
  }
}
  return (
    <Dialog open = {isModalopen} onOpenChange={onClose}>
      <DialogContent className="bg-white text-black p-0 overflow-hidden">
        <DialogHeader className="pt-8 px-6">
          <DialogTitle className="text-2xl text-center font-bold">
            Delete Server
          </DialogTitle>
          <DialogDescription className="text-center text-sm mt-2 text-bold text-opacity-85">
            Are you sure you want to permanently delete <span className="font-bold text-indigo-900">{server?.name}</span>? 
            </DialogDescription>
        </DialogHeader>
       <DialogFooter className="bg-gray-100 px-6 py-4">
        <div className="flex items-center justify-between w-full">
          <Button
          disabled={isLoading}
          onClick={onClose}
          variant="secondary"
          className="bg-blue-500 hover:bg-blue-300 font-semibold"
          >
            Cancel
          </Button>
          <Button
          disabled={isLoading}
          onClick={onClick}
          variant="secondary"
          className="bg-red-500 hover:bg-red-800 font-semibold"
          >
            Confirm
          </Button>
        </div>

        </DialogFooter>
      </DialogContent>
    </Dialog>
  )

}