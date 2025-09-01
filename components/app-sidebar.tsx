"use client"

import * as React from "react"
import {
  AudioWaveform,
  BookOpen,
  Bot,
  Command,
  Frame,
  GalleryVerticalEnd,
  Map,
  PieChart,
  Settings2,
  SquareTerminal,
  Activity,
  BarChart3,
  MessageSquare,
  Hash,
  ThumbsUp,
  Database,
  FileText,
  Globe,
  HelpCircle,
  Zap,
  Users,
  Share,
  ExternalLink,
} from "lucide-react"

import { NavMain } from "@/components/nav-main"
import { NavUser } from "@/components/nav-user"
import { TeamSwitcher } from "@/components/team-switcher"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar"

// This is sample data.
const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  teams: [
    {
      name: "Acme Inc",
      logo: GalleryVerticalEnd,
      plan: "Enterprise",
    },
    {
      name: "Acme Corp.",
      logo: AudioWaveform,
      plan: "Startup",
    },
    {
      name: "Evil Corp.",
      logo: Command,
      plan: "Free",
    },
  ],
  navMain: [
    {
      title: "Playground",
      url: "/dashboard",
      icon: SquareTerminal,
      isActive: true,
    },
    {
      title: "Activity",
      url: "#",
      icon: Activity,
      items: [
        {
          title: "Chat logs",
          url: "#",
        },
        {
          title: "Leads",
          url: "#",
        },
      ],
    },
    {
      title: "Analytics",
      url: "#",
      icon: BarChart3,
      items: [
        {
          title: "Chats",
          url: "#",
        },
        {
          title: "Topics",
          url: "#",
        },
        {
          title: "Sentiment",
          url: "#",
        },
      ],
    },
    {
      title: "Sources",
      url: "#",
      icon: Database,
      items: [
        {
          title: "Files",
          url: "#",
        },
        {
          title: "Text",
          url: "#",
        },
        {
          title: "Website",
          url: "#",
        },
        {
          title: "Q&A",
          url: "#",
        },
        {
          title: "Notion",
          url: "#",
        },
      ],
    },
    {
      title: "Actions",
      url: "#",
      icon: Zap,
      items: [
        {
          title: "Available actions",
          url: "#",
        },
        {
          title: "Integrations",
          url: "#",
        },
      ],
    },
    {
      title: "Contacts",
      url: "#",
      icon: Users,
    },
    {
      title: "Deploy",
      url: "#",
      icon: ExternalLink,
      items: [
        {
          title: "Embed",
          url: "#",
        },
        {
          title: "Share",
          url: "#",
        },
        {
          title: "Integrations",
          url: "#",
        },
        {
          title: "Help page",
          url: "#",
        },
      ],
    },
    {
      title: "Settings",
      url: "#",
      icon: Settings2,
      items: [
        {
          title: "General",
          url: "#",
        },
        {
          title: "Appearance",
          url: "/settings/appearance",
        },
        {
          title: "Chat Interface",
          url: "#",
        },
        {
          title: "Security",
          url: "#",
        },
        {
          title: "Custom domains",
          url: "#",
        },
        {
          title: "Webhooks",
          url: "#",
        },
        {
          title: "Notifications",
          url: "#",
        },
      ],
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={data.teams} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
