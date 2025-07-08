"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useToast } from "@/components/ui/use-toast"
import { Brain, Send } from "lucide-react"

interface Message {
  role: "user" | "assistant"
  content: string
}

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content:
        "Hi there! I'm your Focus Assistant. How can I help you today? You can ask me about your productivity, get wellness tips, or request a summary of your focus today.",
    },
  ])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const scrollAreaRef = useRef<HTMLDivElement>(null)
  const { toast } = useToast()

  useEffect(() => {
    // Scroll to bottom when messages change
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight
    }
  }, [messages])

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!input.trim()) return

    const userMessage = input.trim()
    setInput("")

    // Add user message to chat
    setMessages((prev) => [...prev, { role: "user", content: userMessage }])

    setIsLoading(true)

    try {
     // In a real app, this would call your API
      const token = localStorage.getItem("focusbae_token")
      const response = await fetch("https://focusbee-cloud.onrender.com/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ question: userMessage })
      })

      const data = await response.json()

      // Simulate API response
     //await new Promise((resolve) => setTimeout(resolve, 1000))

      let assistantResponse = data.response

      // if (userMessage.toLowerCase().includes("water")) {
      //   assistantResponse =
      //     "Based on your app usage data, you've been working for 3 hours straight. It's a good idea to drink some water now. Health experts recommend drinking at least 8 glasses of water daily for optimal hydration."
      // } else if (userMessage.toLowerCase().includes("break") || userMessage.toLowerCase().includes("rest")) {
      //   assistantResponse =
      //     "You've been using Chrome for 2 hours and 15 minutes. I recommend taking a 5-minute break to stretch and rest your eyes. The 20-20-20 rule suggests looking at something 20 feet away for 20 seconds every 20 minutes."
      // } else if (userMessage.toLowerCase().includes("focus") || userMessage.toLowerCase().includes("productive")) {
      //   assistantResponse =
      //     "Today, you've been most productive between 10 AM and 12 PM, with focused work in VSCode. Your focus score is 7.5/10. To improve, try the Pomodoro technique: 25 minutes of focused work followed by a 5-minute break."
      // } else {
      //   assistantResponse =
      //     "As your productivity coach, I'm here to help you stay focused and maintain good work habits. Would you like some tips on improving your productivity, a reminder to take a break, or information about your app usage patterns?"
      // }

      // Add assistant response to chat
      setMessages((prev) => [...prev, { role: "assistant", content: assistantResponse }])
    } catch (error) {
      console.error("Error sending message:", error)
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="flex flex-col h-[calc(100vh-10rem)]">
      <CardHeader className="border-b">
        <CardTitle className="flex items-center gap-2">
          <Brain className="h-5 w-5 text-primary" />
          Focus Assistant
        </CardTitle>
      </CardHeader>
      <ScrollArea ref={scrollAreaRef} className="flex-1 p-4">
        <div className="space-y-4">
          {messages.map((message, index) => (
            <div key={index} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
              <div
                className={`max-w-[80%] rounded-lg px-4 py-2 ${
                  message.role === "user" ? "bg-primary text-primary-foreground" : "bg-muted"
                }`}
              >
                {message.content}
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="max-w-[80%] rounded-lg px-4 py-2 bg-muted">
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 animate-bounce rounded-full bg-gray-400"></div>
                  <div
                    className="h-2 w-2 animate-bounce rounded-full bg-gray-400"
                    style={{ animationDelay: "0.2s" }}
                  ></div>
                  <div
                    className="h-2 w-2 animate-bounce rounded-full bg-gray-400"
                    style={{ animationDelay: "0.4s" }}
                  ></div>
                </div>
              </div>
            </div>
          )}
        </div>
      </ScrollArea>
      <CardFooter className="border-t p-4">
        <form onSubmit={handleSendMessage} className="flex w-full gap-2">
          <Input
            placeholder="Type your question..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={isLoading}
            className="flex-1"
          />
          <Button type="submit" disabled={isLoading || !input.trim()}>
            <Send className="h-4 w-4" />
            <span className="sr-only">Send</span>
          </Button>
        </form>
      </CardFooter>
    </Card>
  )
}
