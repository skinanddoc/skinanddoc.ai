import { cookies } from "next/headers"
import { createServerClient } from "@supabase/ssr"
import { Database } from "@/supabase/types"
import ChatPage from "@/components/chat/chat-page"

export default async function WorkspaceChatPage({
  params
}: {
  params: { workspaceid: string }
}) {
  const cookieStore = cookies()

  const supabase = createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value
        }
      }
    }
  )

  const { data: messages, error } = await supabase
    .from("messages")
    .select("*")
    .eq("workspace_id", params.workspaceid)
    .order("created_at", { ascending: true })

  return <ChatPage messages={messages || []} />
}
