import { AppSidebar } from "@/components/app-sidebar"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Slider } from "@/components/ui/slider"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export default function Page() {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator
              orientation="vertical"
              className="mr-2 data-[orientation=vertical]:h-4"
            />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbPage>Playground</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>
        <div className="flex flex-1 p-6 gap-6">
          {/* Left Panel - Playground Configuration */}
          <Card className="w-96">
            <CardHeader>
              <CardTitle className="text-xl">Playground</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Agent Status */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Agent status:</span>
                  <span className="text-sm text-green-600 flex items-center gap-1">
                    <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                    Trained
                  </span>
                </div>
                <Button className="w-full bg-black text-white hover:bg-gray-800">
                  Save to agent
                </Button>
              </div>

              {/* Configure & Test */}
              <div className="flex gap-2">
                <Button variant="outline" className="flex-1 text-xs">
                  Configure & test agents
                </Button>
                <Button variant="outline" className="text-xs">
                  Compare
                </Button>
              </div>

              {/* Model Selection */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Model</label>
                <Select defaultValue="gpt4-mini">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="gpt4-mini">GPT-4o Mini</SelectItem>
                    <SelectItem value="gpt4">GPT-4</SelectItem>
                    <SelectItem value="gpt35">GPT-3.5 Turbo</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Temperature */}
              <div className="space-y-2">
                <div className="flex justify-between">
                  <label className="text-sm font-medium">Temperature</label>
                  <span className="text-sm">0.4</span>
                </div>
                <div className="space-y-2">
                  <Slider defaultValue={[0.4]} max={1} min={0} step={0.1} />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>Reserved</span>
                    <span>Creative</span>
                  </div>
                </div>
              </div>

              {/* AI Actions */}
              <div className="space-y-2">
                <label className="text-sm font-medium">AI Actions</label>
                <div className="border rounded-md p-4 text-center text-sm text-muted-foreground">
                  No actions found
                </div>
              </div>

              {/* System Prompt */}
              <div className="space-y-2">
                <label className="text-sm font-medium">System prompt</label>
                <Select defaultValue="ai-agent">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ai-agent">AI agent</SelectItem>
                    <SelectItem value="customer-support">Customer Support</SelectItem>
                    <SelectItem value="sales-assistant">Sales Assistant</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Instructions */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Instructions</label>
                <Textarea
                  className="resize-none"
                  rows={8}
                  defaultValue="### Role
- Primary Function: You are an AI chatbot who helps users with their inquiries, issues and requests. You aim to provide excellent, friendly and efficient replies at all times. Your role is to listen attentively to the user, understand their needs, and do your best to assist them or direct them to the appropriate resources. If a question is not clear, ask clarifying questions. Make sure"
                />
              </div>
            </CardContent>
          </Card>

          {/* Vertical Divider */}
          <Separator orientation="vertical" className="h-auto" />

          {/* Right Panel - Chat Interface */}
          <Card className="flex-1 flex flex-col">
            <CardHeader className="pb-4">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 bg-black rounded-full flex items-center justify-center text-white text-sm font-bold">
                  C
                </div>
                <CardTitle className="text-lg">Chatbase AI Agent</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col p-0">
              {/* Chat Messages */}
              <div className="flex-1 p-6 space-y-4 overflow-y-auto min-h-[400px]">
                <div className="flex gap-3">
                  <div className="w-8 h-8 bg-black rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                    C
                  </div>
                  <div className="space-y-2">
                    <div className="font-medium text-sm">Chatbase AI Agent</div>
                    <div className="bg-gray-100 rounded-lg p-3 text-sm">
                      👋 Hi! I am Chatbase AI, ask me anything about Chatbase!
                    </div>
                    <div className="bg-gray-100 rounded-lg p-3 text-sm">
                      By the way, you can create an agent like me for your website! 🤖
                    </div>
                  </div>
                </div>
                
                {/* Suggested Questions */}
                <div className="space-y-2 pt-4">
                  <Button variant="outline" className="w-full justify-center rounded-full">
                    What is Chatbase?
                  </Button>
                  <Button variant="outline" className="w-full justify-center rounded-full">
                    How do I add data to my agent?
                  </Button>
                  <div className="flex gap-2">
                    <Button variant="outline" className="flex-1 rounded-full">
                      Is there a free plan?
                    </Button>
                    <Button variant="outline" className="flex-1 rounded-full">
                      What are AI actions?
                    </Button>
                  </div>
                </div>
              </div>
              
              {/* Chat Input */}
              <div className="p-6 border-t space-y-3">
                <div className="text-center text-xs text-muted-foreground">
                  <span className="inline-flex items-center gap-1">
                    <div className="w-4 h-4 bg-gray-300 rounded-full flex items-center justify-center text-white text-xs font-bold">
                      C
                    </div>
                    Powered by Chatbase
                  </span>
                </div>
                <div className="text-xs text-muted-foreground text-center">
                  By chatting, you agree to our{" "}
                  <button className="underline">privacy policy</button>.
                </div>
                <div className="flex items-center gap-2">
                  <Input
                    placeholder="Message..."
                    className="flex-1"
                  />
                  <Button className="bg-black text-white hover:bg-gray-800 px-3">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/>
                    </svg>
                  </Button>
                  <Button variant="outline" size="icon">
                    😊
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
