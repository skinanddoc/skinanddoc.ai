"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"

export default function ChatPage() {
  const router = useRouter()

  useEffect(() => {
    const getWorkspaceAndRedirect = async () => {
      const supabase = createClient()
      const {
        data: { session }
      } = await supabase.auth.getSession()

      if (!session) {
        router.push("/login")
        return
      }

      const { data: workspace, error } = await supabase
        .from("workspaces")
        .select("id")
        .eq("user_id", session.user.id)
        .eq("is_home", true)
        .maybeSingle()

      if (workspace?.id) {
        router.push(`/${workspace.id}/chat`)
      } else {
        router.push("/login")
      }
    }

    getWorkspaceAndRedirect()
  }, [router])

  return null
}
