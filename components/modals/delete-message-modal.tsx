"use client";


import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import qs from "query-string";
import { useModal } from "@/app/hooks/use-modal-store";
import { Button } from "../ui/button";
import { useState } from "react";
import axios from "axios";


export const DeleteMessageModal = () => {
  const { onOpen, isOpen, onClose, type, data } = useModal()

  const isModalopen = isOpen && type === "deleteMessage"
  const { apiUrl, query } = data
  const [isLoading, setIsLoading] = useState(false);
  const onClick = async () => { 
    try {
  
      setIsLoading(true)
      
        const url = qs.stringifyUrl({
          url: apiUrl || "",
          query,
          }
      )
      await axios.delete(url)
      onClose()
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
            Delete Message
          </DialogTitle>
          <DialogDescription className="text-center text-sm mt-2 text-bold text-opacity-85">
            Are you sure you want to permanently delete your message? 
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