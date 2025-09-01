'use client';

import { useState } from 'react';
import { useTheme } from 'next-themes';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { MinimalEditor } from "@/components/ui/minimal-editor";
import { Separator } from "@/components/ui/separator";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Switch } from "@/components/ui/switch";
import ChatbaseWidget from "@/components/ui/chatbase-widget";
import { type ChatbaseConfig } from "@/lib/chatbase-config";
import { Upload, RefreshCw, Plus, X } from "lucide-react";

export default function AppearancePage() {
  // State for active tab
  const [activeTab, setActiveTab] = useState<'content' | 'style'>('content');
  
  // Theme management
  const { theme, setTheme } = useTheme();
  
  // State for real-time customization
  const [config, setConfig] = useState<Partial<ChatbaseConfig>>({
    agentName: "chatclone",
    headerBackground: "bg-gray-900",
    headerTextColor: "text-white",
    userMessageBackground: "bg-blue-500",
    userMessageTextColor: "text-white",
    botMessageBackground: "bg-gray-200",
    botMessageTextColor: "text-gray-900",
    backgroundColor: "bg-gray-50",
    watermarkText: "Powered by chatclone",
    watermarkTextColor: "text-gray-500",
    welcomeMessage: "Hi! I am Chatclone AI, ask me anything about Chatclone!",
    welcomeEmoji: "👋",
    suggestedQuestions: [
      "What is Chatbase?",
      "How do I add data to my agent?", 
      "Is there a free plan?",
      "What are AI actions?"
    ],
    privacyText: "By chatting, you agree to our",
    privacyLinkText: "privacy policy",
    privacyLink: "#"
  });

  // Content tab states
  const [initialMessage, setInitialMessage] = useState("how can i help");
  const [suggestedMessages, setSuggestedMessages] = useState([
    "Add suggested message...",
    "Add suggested message..."
  ]);
  const [messagePlaceholder, setMessagePlaceholder] = useState("hi");
  const [collectFeedback, setCollectFeedback] = useState(true);
  const [regenerateMessages, setRegenerateMessages] = useState(true);
  const [autoShowMessages, setAutoShowMessages] = useState(true);
  const [autoShowDuration, setAutoShowDuration] = useState(3);

  // Style tab states  
  const [syncColors, setSyncColors] = useState(false);
  const [chatAlignment, setChatAlignment] = useState<'left' | 'right'>('right');
  const [userMessageColor, setUserMessageColor] = useState('#3B82F6');
  const [headerColor, setHeaderColor] = useState('#000000');

  const handleConfigChange = (key: keyof ChatbaseConfig, value: string) => {
    setConfig(prev => ({ ...prev, [key]: value }));
  };

  const handleColorChange = (key: keyof ChatbaseConfig, value: string) => {
    // Update both the config and local color state
    // Use the actual hex value instead of Tailwind classes for custom colors
    setConfig(prev => ({ ...prev, [key]: value }));
    
    if (key === 'userMessageBackground') {
      setUserMessageColor(value);
    } else if (key === 'headerBackground') {
      setHeaderColor(value);
    }
  };

  const addSuggestedMessage = () => {
    setSuggestedMessages([...suggestedMessages, "Add suggested message..."]);
  };

  const removeSuggestedMessage = (index: number) => {
    setSuggestedMessages(suggestedMessages.filter((_, i) => i !== index));
  };

  const updateSuggestedMessage = (index: number, value: string) => {
    const updated = [...suggestedMessages];
    updated[index] = value;
    setSuggestedMessages(updated);
  };

  const resetToDefault = () => {
    setConfig({
      agentName: "Chatbase AI Agent",
      headerBackground: "bg-gray-900",
      headerTextColor: "text-white",
      userMessageBackground: "bg-blue-500",
      userMessageTextColor: "text-white",
      botMessageBackground: "bg-gray-200",
      botMessageTextColor: "text-gray-900",
      backgroundColor: "bg-gray-50",
      watermarkText: "Powered by Chatbase",
      watermarkTextColor: "text-gray-500",
      welcomeMessage: "Hi! I am Chatbase AI, ask me anything about Chatbase!",
      welcomeEmoji: "👋"
    });
  };

  return (
    <div className="flex h-screen bg-background">
      {/* Left side - Customization Controls */}
      <div className="w-1/2 p-6 overflow-y-auto">
        <Card className="max-w-md mx-auto shadow-lg border">
          <CardContent className="p-6 space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-2xl font-bold">Chat Interface</h1>
                <p className="text-muted-foreground text-sm">Customize how your chatbot looks</p>
              </div>
              <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
                Save
              </Button>
            </div>

            {/* Tabs */}
            <div className="flex space-x-6">
              <button 
                className={`pb-2 ${activeTab === 'content' ? 'border-b-2 border-primary text-primary' : 'text-muted-foreground hover:text-foreground'} font-medium transition-colors`}
                onClick={() => setActiveTab('content')}
              >
                Content
              </button>
              <button 
                className={`pb-2 ${activeTab === 'style' ? 'border-b-2 border-primary text-primary' : 'text-muted-foreground hover:text-foreground'} font-medium transition-colors`}
                onClick={() => setActiveTab('style')}
              >
                Style
              </button>
            </div>

            <Separator />

          {/* Content Tab */}
          {activeTab === 'content' && (
            <div className="space-y-6">
              <div>
                <Label htmlFor="displayName">Display name</Label>
                <Input
                  id="displayName"
                  value={config.agentName || ''}
                  onChange={(e) => handleConfigChange('agentName', e.target.value)}
                  placeholder="chatclone"
                />
              </div>

              <div>
                <Label htmlFor="initialMessage">Initial messages</Label>
                <Textarea
                  id="initialMessage"
                  value={initialMessage}
                  onChange={(e) => setInitialMessage(e.target.value)}
                  placeholder="Enter each message in a new line."
                  className="min-h-[80px] resize-none"
                />
                <Button 
                  variant="link" 
                  className="text-primary p-0 h-auto text-sm mt-2"
                >
                  Reset
                </Button>
              </div>

              <Separator />

              <div>
                <div className="flex items-center justify-between mb-3">
                  <Label>Suggested messages</Label>
                  <div className="text-xs text-gray-500">
                    Keep showing the suggested messages after the user's first message
                  </div>
                </div>
                
                <div className="space-y-3">
                  {suggestedMessages.map((message, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <Input
                        value={message}
                        onChange={(e) => updateSuggestedMessage(index, e.target.value)}
                        placeholder="Add suggested message..."
                        className="flex-1"
                      />
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => removeSuggestedMessage(index)}
                        className="h-10 w-10 text-gray-400 hover:text-red-600"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                  
                  <Button
                    variant="outline"
                    onClick={addSuggestedMessage}
                    className="w-full flex items-center gap-2"
                  >
                    <Plus className="w-4 h-4" />
                    Add suggested message
                  </Button>
                </div>
              </div>

              <Separator />

              <div>
                <Label htmlFor="messagePlaceholder">Message placeholder</Label>
                <Input
                  id="messagePlaceholder"
                  value={messagePlaceholder}
                  onChange={(e) => setMessagePlaceholder(e.target.value)}
                  placeholder="Message..."
                />
              </div>

              <Separator />

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Collect user feedback</Label>
                  </div>
                  <Switch
                    checked={collectFeedback}
                    onCheckedChange={setCollectFeedback}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label>Regenerate messages</Label>
                  </div>
                  <Switch
                    checked={regenerateMessages}
                    onCheckedChange={setRegenerateMessages}
                  />
                </div>
              </div>

              <div>
                <Label>Dismissible notice</Label>
                <div className="mt-1">
                  <MinimalEditor 
                    placeholder="Enter dismissible notice..."
                    value={`${config.privacyText} ${config.privacyLinkText}.`}
                    onChange={(value) => {
                      const text = value.replace(/<[^>]*>/g, ''); // Strip HTML tags
                      const parts = text.split(' privacy policy');
                      setConfig(prev => ({ 
                        ...prev, 
                        privacyText: parts[0] || "By chatting, you agree to our",
                        privacyLinkText: "privacy policy"
                      }));
                    }}
                  />
                </div>
              </div>

              <Separator />

              <div>
                <Label>Footer</Label>
                <Textarea
                  value={config.watermarkText || ''}
                  onChange={(e) => handleConfigChange('watermarkText', e.target.value)}
                  placeholder="we hope you love it"
                  className="min-h-[80px] resize-none"
                />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div>
                  <Label>Auto show initial messages popup after set duration</Label>
                  <div className="flex items-center gap-2 mt-2">
                    <Input
                      type="number"
                      value={autoShowDuration}
                      onChange={(e) => setAutoShowDuration(Number(e.target.value))}
                      className="w-16"
                      min="1"
                    />
                    <span className="text-sm text-gray-500">seconds</span>
                  </div>
                </div>
                <Switch
                  checked={autoShowMessages}
                  onCheckedChange={setAutoShowMessages}
                />
              </div>
            </div>
          )}

          {/* Style Tab */}
          {activeTab === 'style' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold">Appearance</h2>
                <Button onClick={resetToDefault} variant="outline" size="sm">
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Reset
                </Button>
              </div>

              {/* Theme Selection */}
              <div>
                <h3 className="font-semibold mb-4">Theme</h3>
                <RadioGroup value={theme || 'light'} onValueChange={(value: 'light' | 'dark') => setTheme(value)}>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="relative">
                      <RadioGroupItem value="light" id="light" className="sr-only" />
                      <Label
                        htmlFor="light"
                        className={`flex flex-col items-center p-4 border-2 rounded-lg cursor-pointer transition-colors ${
                          theme === 'light' ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50'
                        }`}
                      >
                        <div className="w-full h-20 bg-muted rounded mb-2 flex items-center justify-center">
                          <div className="w-8 h-8 bg-foreground rounded-full flex items-center justify-center">
                            <div className="w-4 h-4 bg-background rounded-full"></div>
                          </div>
                        </div>
                        <span className="text-sm font-medium">Light</span>
                      </Label>
                    </div>
                    <div className="relative">
                      <RadioGroupItem value="dark" id="dark" className="sr-only" />
                      <Label
                        htmlFor="dark"
                        className={`flex flex-col items-center p-4 border-2 rounded-lg cursor-pointer transition-colors ${
                          theme === 'dark' ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50'
                        }`}
                      >
                        <div className="w-full h-20 bg-gray-900 rounded mb-2 flex items-center justify-center">
                          <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                            <div className="w-4 h-4 bg-gray-900 rounded-full"></div>
                          </div>
                        </div>
                        <span className="text-sm font-medium">Dark</span>
                      </Label>
                    </div>
                  </div>
                </RadioGroup>
              </div>

              <Separator />

              <div>
                <Label>Profile picture</Label>
                <div className="mt-1">
                  <Button variant="outline" size="sm">
                    <Upload className="w-4 h-4 mr-2" />
                    Upload
                  </Button>
                  <p className="text-xs text-muted-foreground mt-1">Supports JPG, PNG, and SVG up to 1MB</p>
                </div>
              </div>

              <Separator />

              <div>
                <Label>Chat icon</Label>
                <div className="mt-1">
                  <Button variant="outline" size="sm">
                    <Upload className="w-4 h-4 mr-2" />
                    Upload
                  </Button>
                  <p className="text-xs text-muted-foreground mt-1">Supports JPG, PNG, and SVG up to 1MB</p>
                </div>
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <Label htmlFor="userColor">User message color</Label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={userMessageColor}
                    onChange={(e) => handleColorChange('userMessageBackground', e.target.value)}
                    className="w-8 h-8 rounded border"
                  />
                  <span className="text-sm text-gray-500">{userMessageColor}</span>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => {
                      setUserMessageColor('#3B82F6');
                      setConfig(prev => ({ ...prev, userMessageBackground: '#3B82F6' }));
                    }}
                  >
                    <RefreshCw className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div>
                  <Label>Sync user message color with agent header</Label>
                </div>
                <Switch
                  checked={syncColors}
                  onCheckedChange={setSyncColors}
                />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <Label htmlFor="botColor">Chat bubble button color</Label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={headerColor}
                    onChange={(e) => handleColorChange('headerBackground', e.target.value)}
                    className="w-8 h-8 rounded border"
                  />
                  <span className="text-sm text-gray-500">{headerColor}</span>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => {
                      setHeaderColor('#000000');
                      setConfig(prev => ({ ...prev, headerBackground: '#000000' }));
                    }}
                  >
                    <RefreshCw className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              <Separator />

              <div>
                <h3 className="font-semibold mb-4">Align chat bubble button</h3>
                <RadioGroup value={chatAlignment} onValueChange={(value: 'left' | 'right') => setChatAlignment(value)}>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="left" id="alignLeft" />
                    <Label htmlFor="alignLeft">Left align</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="right" id="alignRight" />
                    <Label htmlFor="alignRight">Right align</Label>
                  </div>
                </RadioGroup>
              </div>
            </div>
          )}
          </CardContent>
        </Card>
      </div>

      {/* Right side - Live Preview */}
      <div className="w-1/2 p-6 bg-background flex items-center justify-center">
        <div className="scale-90">
          <ChatbaseWidget config={config} />
        </div>
      </div>
    </div>
  );
}