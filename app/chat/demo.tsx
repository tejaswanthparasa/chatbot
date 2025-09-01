import ChatbaseWidget from "@/components/ui/chatbase-widget"

const Demo = () => {
    // Example configurations showing different customization options
    const defaultConfig = {};
    
    const customConfig = {
        agentName: "My Custom Agent",
        headerBackground: "bg-purple-600",
        userMessageBackground: "bg-green-500",
        watermarkText: "Powered by MyCompany",
        suggestedQuestions: [
            "How can you help me?",
            "What services do you offer?",
            "Tell me about pricing",
            "How do I get started?",
            "How can you help me?",
            "What services do you offer?",
            "Tell me about pricing",
            "How do I get started?",
        ],
        welcomeMessage: "Hello! I'm your personal assistant. How can I help you today?",
        welcomeEmoji: "🤖"
    };

    return (
        <div className="min-h-screen bg-gray-100 p-8">
            <div className="max-w-6xl mx-auto">
                <h1 className="text-3xl font-bold text-center mb-8 text-gray-900">
                    Chatbase Widget Demo
                </h1>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Default Configuration */}
                    <div>
                        <h2 className="text-xl font-semibold mb-4 text-gray-800">
                            Default Configuration
                        </h2>
                        <ChatbaseWidget config={defaultConfig} />
                    </div>
                    
                    {/* Custom Configuration */}
                    <div>
                        <h2 className="text-xl font-semibold mb-4 text-gray-800">
                            Custom Configuration
                        </h2>
                        <ChatbaseWidget config={customConfig} />
                    </div>
                </div>
                
                {/* Configuration Options */}
                <div className="mt-12 bg-white rounded-lg p-6 shadow-lg">
                    <h2 className="text-2xl font-bold mb-4">Available Customization Options</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <h3 className="text-lg font-semibold mb-2 text-blue-600">Branding</h3>
                            <ul className="space-y-1 text-sm text-gray-600">
                                <li>• Agent Name</li>
                                <li>• Agent Logo</li>
                                <li>• Header Background Color</li>
                                <li>• Header Text Color</li>
                                <li>• Watermark Text</li>
                                <li>• Watermark Color</li>
                            </ul>
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold mb-2 text-green-600">Colors</h3>
                            <ul className="space-y-1 text-sm text-gray-600">
                                <li>• User Message Background</li>
                                <li>• User Message Text Color</li>
                                <li>• Bot Message Background</li>
                                <li>• Bot Message Text Color</li>
                                <li>• Widget Background Color</li>
                            </ul>
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold mb-2 text-purple-600">Content</h3>
                            <ul className="space-y-1 text-sm text-gray-600">
                                <li>• Welcome Message</li>
                                <li>• Welcome Emoji</li>
                                <li>• Suggested Questions</li>
                                <li>• Privacy Policy Text</li>
                                <li>• Privacy Policy Link</li>
                            </ul>
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold mb-2 text-red-600">Features</h3>
                            <ul className="space-y-1 text-sm text-gray-600">
                                <li>• Real-time streaming responses</li>
                                <li>• Suggested question chips</li>
                                <li>• Privacy notice (dismissible)</li>
                                <li>• Typing indicators</li>
                                <li>• Auto-scroll to latest message</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export {Demo}