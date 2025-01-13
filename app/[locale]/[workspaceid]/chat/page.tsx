"use client"

import { ChatHelp } from "@/components/chat/chat-help"
import { useChatHandler } from "@/components/chat/chat-hooks/use-chat-handler"
import { ChatInput } from "@/components/chat/chat-input"
import { ChatSettings } from "@/components/chat/chat-settings"
import { ChatUI } from "@/components/chat/chat-ui"
import { QuickSettings } from "@/components/chat/quick-settings"
import PrivacyPolicy from "@/components/legal/privacy-policy"
import TermsAndConditions from "@/components/legal/terms-and-conditions"
import { Brand } from "@/components/ui/brand"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select"
import { ChatbotUIContext } from "@/context/context"
import useHotkey from "@/lib/hooks/use-hotkey"
import { useTheme } from "next-themes"
import { useContext, useEffect, useState } from "react"

export default function ChatPage() {
  useHotkey("o", () => handleNewChat())
  useHotkey("l", () => {
    handleFocusChatInput()
  })

  const { profile, chatMessages } = useContext(ChatbotUIContext)

  const { handleNewChat, handleFocusChatInput } = useChatHandler()

  const { theme } = useTheme()
  const [region, setRegion] = useState<string | null>(
    localStorage.getItem("region")
  )
  useEffect(() => {
    if (region === null) {
      localStorage.setItem("region", "sweden")
      setRegion("sweden")
    }
  }, [])
  const handleRegionChange = (value: string) => {
    localStorage.setItem("region", value)
    setRegion(value)
    window.location.reload()
  }

  return (
    <>
      {chatMessages.length === 0 ? (
        <div className="relative flex h-full flex-col items-center justify-center">
          <div className="top-50% left-50% -translate-x-50% -translate-y-50% absolute mb-20">
            <Brand theme={theme === "dark" ? "dark" : "light"} />
          </div>

          <div className="m-2 flex w-full justify-between">
            {profile?.roles === "superadmin" && (
              <div className="hidden lg:block">
                <QuickSettings />
              </div>
            )}
            <div className="m-3 flex items-center space-x-2">
              {/* <Label className="hidden lg:block">Select a Region</Label> */}
              <Select
                value={region ?? undefined}
                onValueChange={handleRegionChange}
              >
                <SelectTrigger className="lg:w-[150px]">
                  <SelectValue placeholder="Your Region" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="sweden" className="cursor-pointer">
                    Sweden
                  </SelectItem>
                  <SelectItem value="uksouth" className="cursor-pointer">
                    Uk South
                  </SelectItem>
                  <SelectItem value="switzerland" className="cursor-pointer">
                    Switzerland
                  </SelectItem>
                </SelectContent>
              </Select>
              <ChatSettings />
            </div>
          </div>

          <div className="flex grow flex-col items-center justify-center" />

          <div className="w-full min-w-[300px] items-end px-2 pt-0 backdrop-blur-md sm:w-[600px] sm:pt-5 md:w-[700px] lg:w-[700px] xl:w-[800px]">
            <ChatInput />
          </div>
          <div className="mb-4 flex justify-center space-x-2">
            <TermsAndConditions />
            <PrivacyPolicy />
          </div>

          <div className="absolute bottom-2 right-2 hidden md:block lg:bottom-4 lg:right-4">
            <ChatHelp />
          </div>
        </div>
      ) : (
        <ChatUI />
      )}
    </>
  )
}
