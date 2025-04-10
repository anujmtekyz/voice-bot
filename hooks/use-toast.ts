"use client"
import { useToast as useToastUI } from "@/components/ui/use-toast"

export function useToast() {
  const { toast } = useToastUI()

  return { toast }
}
