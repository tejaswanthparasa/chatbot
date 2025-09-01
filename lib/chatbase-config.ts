// Configuration file for Chatbase Widget customization
// Edit this file to customize your chatbot's appearance and behavior

export interface ChatbaseConfig {
  // Branding
  agentName: string;
  agentLogo?: string;
  headerBackground: string;
  headerTextColor: string;
  
  // Colors
  userMessageBackground: string;
  userMessageTextColor: string;
  botMessageBackground: string;
  botMessageTextColor: string;
  backgroundColor: string;
  
  // Watermark
  watermarkText: string;
  watermarkTextColor: string;
  
  // Privacy
  privacyText: string;
  privacyLinkText: string;
  privacyLink: string;
  
  // Suggested questions
  suggestedQuestions: string[];
  
  // Welcome message
  welcomeMessage: string;
  welcomeEmoji: string;
}

// Default configuration - modify these values to customize your chatbot
export const defaultChatbaseConfig: ChatbaseConfig = {
  // Branding
  agentName: "Chatbase AI Agent",
  agentLogo: undefined, // Add your logo URL here
  headerBackground: "bg-gray-900",
  headerTextColor: "text-white",
  
  // Colors - You can use any Tailwind CSS classes or custom colors
  userMessageBackground: "bg-blue-500",
  userMessageTextColor: "text-white",
  botMessageBackground: "bg-gray-200",
  botMessageTextColor: "text-gray-900",
  backgroundColor: "bg-gray-50",
  
  // Watermark
  watermarkText: "Powered by chatclone",
  watermarkTextColor: "text-gray-500",
  
  // Privacy
  privacyText: "By chatting, you agree to our",
  privacyLinkText: "privacy policy",
  privacyLink: "#",
  
  // Suggested questions - customize these for your use case
  suggestedQuestions: [
    "What is Chatbase?",
    "How do I add data to my agent?",
    "Is there a free plan?",
    "What are AI actions?"
  ],
  
  // Welcome message
  welcomeMessage: "Hi! I am Chatclone AI, ask me anything about Chatclone!",
  welcomeEmoji: "👋"
};

// Example custom configurations
export const customConfigs = {
  // Business theme
  business: {
    agentName: "Business Assistant",
    headerBackground: "bg-slate-800",
    userMessageBackground: "bg-blue-600",
    watermarkText: "Powered by Your Business",
    suggestedQuestions: [
      "What services do you offer?",
      "How can I get a quote?",
      "What are your business hours?",
      "How do I contact support?"
      
      
    ],
    welcomeMessage: "Hello! I'm here to help you with your business needs.",
    welcomeEmoji: "💼"
  },
  
  // Support theme
  support: {
    agentName: "Support Agent",
    headerBackground: "bg-green-600",
    userMessageBackground: "bg-green-500",
    watermarkText: "Customer Support",
    suggestedQuestions: [
      "How can I reset my password?",
      "Where do I find my billing information?",
      "How do I contact a human agent?",
      "What are your support hours?"
    ],
    welcomeMessage: "Hi! I'm your support assistant. How can I help you today?",
    welcomeEmoji: "🎧"
  },
  
  // E-commerce theme
  ecommerce: {
    agentName: "Shopping Assistant",
    headerBackground: "bg-purple-600",
    userMessageBackground: "bg-purple-500",
    watermarkText: "Shop with confidence",
    suggestedQuestions: [
      "What's your return policy?",
      "Do you offer international shipping?",
      "How can I track my order?",
      "Are there any current promotions?"
    ],
    welcomeMessage: "Welcome! I'm here to help you find what you're looking for.",
    welcomeEmoji: "🛍️"
  }
};

// Helper function to merge configurations
export function mergeConfig(baseConfig: ChatbaseConfig, customConfig: Partial<ChatbaseConfig>): ChatbaseConfig {
  return { ...baseConfig, ...customConfig };
}