"use client"
import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import {
  Brain,
  Send,
  ArrowLeft,
  Play,
  RotateCcw,
  BookOpen,
  Calculator,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Download,
  Share2,
  Copy,
  Bookmark,
  History,
  Settings,
  Zap,
  Target,
  PenTool,
  FileText,
  BarChart3,
  Maximize2,
  Minimize2,
  RefreshCw,
  Upload,
  Camera,
  Sparkles,
  ThumbsUp,
  ThumbsDown,
  TrendingUp,
  Code,
  Eye,
  MoreHorizontal,
} from "lucide-react"
import Link from "next/link"

interface Message {
  id: string
  type: "user" | "ai"
  content: string
  timestamp: Date
  hasAnimation?: boolean
  hasVisualization?: boolean
  difficulty?: "beginner" | "intermediate" | "advanced"
  topic?: string
  rating?: number
  bookmarked?: boolean
}

interface AnimationSettings {
  speed: number
  showSteps: boolean
  showFormulas: boolean
  colorScheme: "default" | "dark" | "colorful"
  autoPlay: boolean
}

export default function EnhancedTutorPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      type: "ai",
      content:
        "Welcome to your enhanced AI Math Tutor! 🎓 I'm equipped with advanced visualization tools, step-by-step explanations, and personalized learning features. What mathematical concept would you like to explore today?",
      timestamp: new Date(),
      topic: "Welcome",
      difficulty: "beginner",
    },
  ])

  const [inputValue, setInputValue] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const [isListening, setIsListening] = useState(false)
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [showAnimation, setShowAnimation] = useState(false)
  const [showVisualization, setShowVisualization] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const [currentTopic, setCurrentTopic] = useState("Mean Value Theorem")
  const [difficulty, setDifficulty] = useState<"beginner" | "intermediate" | "advanced">("intermediate")
  const [showStepByStep, setShowStepByStep] = useState(true)
  const [animationSettings, setAnimationSettings] = useState<AnimationSettings>({
    speed: 1,
    showSteps: true,
    showFormulas: true,
    colorScheme: "default",
    autoPlay: false,
  })

  const messagesEndRef = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      type: "user",
      content: inputValue,
      timestamp: new Date(),
      topic: detectTopic(inputValue),
      difficulty: difficulty,
    }

    setMessages((prev) => [...prev, userMessage])
    setInputValue("")
    setIsTyping(true)

    // Simulate AI response with enhanced features
    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        type: "ai",
        content: generateEnhancedAIResponse(inputValue),
        timestamp: new Date(),
        hasAnimation: shouldShowAnimation(inputValue),
        hasVisualization: shouldShowVisualization(inputValue),
        topic: detectTopic(inputValue),
        difficulty: difficulty,
      }
      setMessages((prev) => [...prev, aiResponse])
      setIsTyping(false)

      if (aiResponse.hasVisualization) {
        setShowVisualization(true)
      }
    }, 2000)
  }

  const detectTopic = (input: string): string => {
    const topics = {
      derivative: "Calculus - Derivatives",
      integral: "Calculus - Integrals",
      limit: "Calculus - Limits",
      "mean value": "Mean Value Theorem",
      quadratic: "Algebra - Quadratics",
      linear: "Algebra - Linear Functions",
      trigonometry: "Trigonometry",
      geometry: "Geometry",
      statistics: "Statistics",
      probability: "Probability",
    }

    for (const [key, value] of Object.entries(topics)) {
      if (input.toLowerCase().includes(key)) {
        return value
      }
    }
    return "General Math"
  }

  const shouldShowAnimation = (input: string): boolean => {
    const animationTriggers = ["graph", "visual", "show", "animate", "plot", "draw"]
    return animationTriggers.some((trigger) => input.toLowerCase().includes(trigger))
  }

  const shouldShowVisualization = (input: string): boolean => {
    const vizTriggers = ["theorem", "proof", "relationship", "concept", "explain"]
    return vizTriggers.some((trigger) => input.toLowerCase().includes(trigger))
  }

  const generateEnhancedAIResponse = (input: string): string => {
    const responses = [
      `Excellent question about ${detectTopic(input)}! Let me break this down with a comprehensive explanation. I'll provide multiple approaches to help you understand this concept thoroughly.

**Key Concepts:**
• Mathematical foundation and definitions
• Step-by-step derivation process  
• Real-world applications and examples
• Common misconceptions to avoid

**Visual Learning:**
I've generated an interactive visualization that shows how this concept works dynamically. You can adjust parameters and see immediate results.

**Practice Opportunities:**
Would you like me to generate some practice problems at your current difficulty level?`,

      `Great choice of topic! This is a fundamental concept in ${detectTopic(input)}. Let me provide a multi-layered explanation:

**Intuitive Understanding:**
Think of this concept like... [provides relatable analogy]

**Mathematical Rigor:**
Here's the formal mathematical treatment with proofs and derivations.

**Interactive Elements:**
• Adjustable parameters in the visualization
• Step-by-step animation controls
• Multiple representation modes

**Assessment:**
I can create personalized quizzes to test your understanding when you're ready.`,

      `Perfect! You've chosen one of the most important topics in mathematics. Here's my comprehensive breakdown:

**Learning Path:**
1. Conceptual foundation (what and why)
2. Mathematical formulation (how)
3. Applications and examples (when and where)
4. Advanced extensions (what's next)

**Adaptive Features:**
I've adjusted the explanation complexity based on your learning profile. The visualization includes multiple difficulty modes.

**Collaboration Tools:**
You can save this explanation, share it with study groups, or export it for your notes.`,
    ]
    return responses[Math.floor(Math.random() * responses.length)]
  }

  const handleVoiceInput = () => {
    setIsListening(!isListening)
    // Voice recognition implementation would go here
  }

  const handleTextToSpeech = () => {
    setIsSpeaking(!isSpeaking)
    // Text-to-speech implementation would go here
  }

  const handleFileUpload = () => {
    fileInputRef.current?.click()
  }

  const handleBookmark = (messageId: string) => {
    setMessages((prev) => prev.map((msg) => (msg.id === messageId ? { ...msg, bookmarked: !msg.bookmarked } : msg)))
  }

  const handleRating = (messageId: string, rating: number) => {
    setMessages((prev) => prev.map((msg) => (msg.id === messageId ? { ...msg, rating } : msg)))
  }

  const quickPrompts = [
    { text: "Explain the Mean Value Theorem", icon: BookOpen, category: "Concept" },
    { text: "Solve x² + 5x + 6 = 0", icon: Calculator, category: "Problem" },
    { text: "Show me a parabola animation", icon: Play, category: "Visual" },
    { text: "Generate practice problems", icon: Target, category: "Practice" },
    { text: "Prove the Pythagorean theorem", icon: PenTool, category: "Proof" },
    { text: "What are derivatives used for?", icon: TrendingUp, category: "Application" },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Enhanced Header */}
      <div className="border-b bg-white/80 backdrop-blur-sm shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <Link
                href="/dashboard"
                className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
              >
                <ArrowLeft className="h-5 w-5" />
                <span>Dashboard</span>
              </Link>
              <div className="h-6 w-px bg-gray-300"></div>
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                  <Brain className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-gray-900">MathMind AI</h1>
                  <p className="text-xs text-gray-500">Advanced Math Tutor</p>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <Badge variant="secondary" className="bg-green-100 text-green-800">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>
                AI Active
              </Badge>
              <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                <Zap className="w-4 h-4 mr-1" />
                {difficulty}
              </Badge>
              <Button variant="outline" size="sm" onClick={() => setShowSettings(!showSettings)} className="bg-white">
                <Settings className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="flex h-[calc(100vh-4rem)]">
        {/* Main Chat Area */}
        <div className="flex-1 flex flex-col">
          {/* Topic Header */}
          <div className="bg-white border-b px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <BookOpen className="h-5 w-5 text-blue-600" />
                  <span className="font-semibold text-gray-900">{currentTopic}</span>
                </div>
                <Badge className="bg-purple-100 text-purple-800">{difficulty}</Badge>
              </div>
              <div className="flex items-center space-x-2">
                <Button variant="outline" size="sm" className="bg-white">
                  <History className="h-4 w-4 mr-1" />
                  History
                </Button>
                <Button variant="outline" size="sm" className="bg-white">
                  <Share2 className="h-4 w-4 mr-1" />
                  Share
                </Button>
              </div>
            </div>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            <div className="max-w-4xl mx-auto space-y-6">
              {messages.map((message) => (
                <div key={message.id} className={`flex ${message.type === "user" ? "justify-end" : "justify-start"}`}>
                  <div className={`max-w-4xl w-full ${message.type === "user" ? "order-2" : "order-1"}`}>
                    <div
                      className={`flex items-start space-x-4 ${message.type === "user" ? "flex-row-reverse space-x-reverse" : ""}`}
                    >
                      {/* Avatar */}
                      <div
                        className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                          message.type === "user"
                            ? "bg-gradient-to-br from-blue-500 to-blue-600"
                            : "bg-gradient-to-br from-purple-500 to-indigo-600"
                        }`}
                      >
                        {message.type === "user" ? (
                          <span className="text-white font-semibold text-sm">You</span>
                        ) : (
                          <Brain className="h-6 w-6 text-white" />
                        )}
                      </div>

                      {/* Message Content */}
                      <div className="flex-1 min-w-0">
                        <div
                          className={`rounded-2xl p-6 shadow-sm ${
                            message.type === "user"
                              ? "bg-gradient-to-br from-blue-500 to-blue-600 text-white"
                              : "bg-white border border-gray-200"
                          }`}
                        >
                          {/* Message Header */}
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center space-x-2">
                              {message.topic && (
                                <Badge
                                  variant="secondary"
                                  className={`text-xs ${
                                    message.type === "user" ? "bg-blue-400 text-blue-100" : "bg-gray-100 text-gray-700"
                                  }`}
                                >
                                  {message.topic}
                                </Badge>
                              )}
                              {message.difficulty && (
                                <Badge
                                  variant="secondary"
                                  className={`text-xs ${
                                    message.type === "user"
                                      ? "bg-blue-400 text-blue-100"
                                      : message.difficulty === "beginner"
                                        ? "bg-green-100 text-green-700"
                                        : message.difficulty === "intermediate"
                                          ? "bg-yellow-100 text-yellow-700"
                                          : "bg-red-100 text-red-700"
                                  }`}
                                >
                                  {message.difficulty}
                                </Badge>
                              )}
                            </div>
                            <div className="flex items-center space-x-1">
                              <span
                                className={`text-xs ${message.type === "user" ? "text-blue-100" : "text-gray-500"}`}
                              >
                                {message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                              </span>
                            </div>
                          </div>

                          {/* Message Text */}
                          <div className="prose prose-sm max-w-none">
                            <p
                              className={`leading-relaxed whitespace-pre-wrap ${
                                message.type === "user" ? "text-white" : "text-gray-800"
                              }`}
                            >
                              {message.content}
                            </p>
                          </div>

                          {/* Action Buttons for AI Messages */}
                          {message.type === "ai" && (
                            <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-gray-100">
                              {message.hasVisualization && (
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => setShowVisualization(true)}
                                  className="bg-purple-50 text-purple-700 border-purple-200 hover:bg-purple-100"
                                >
                                  <Eye className="h-4 w-4 mr-1" />
                                  View Visualization
                                </Button>
                              )}
                              {message.hasAnimation && (
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => setShowAnimation(true)}
                                  className="bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100"
                                >
                                  <Play className="h-4 w-4 mr-1" />
                                  Play Animation
                                </Button>
                              )}
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleTextToSpeech()}
                                className="bg-green-50 text-green-700 border-green-200 hover:bg-green-100"
                              >
                                {isSpeaking ? (
                                  <VolumeX className="h-4 w-4 mr-1" />
                                ) : (
                                  <Volume2 className="h-4 w-4 mr-1" />
                                )}
                                {isSpeaking ? "Stop" : "Listen"}
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleBookmark(message.id)}
                                className={`${
                                  message.bookmarked
                                    ? "bg-yellow-50 text-yellow-700 border-yellow-200"
                                    : "bg-gray-50 text-gray-700 border-gray-200"
                                } hover:bg-yellow-100`}
                              >
                                <Bookmark className={`h-4 w-4 mr-1 ${message.bookmarked ? "fill-current" : ""}`} />
                                {message.bookmarked ? "Saved" : "Save"}
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                className="bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100"
                              >
                                <Copy className="h-4 w-4 mr-1" />
                                Copy
                              </Button>
                            </div>
                          )}

                          {/* Rating for AI Messages */}
                          {message.type === "ai" && (
                            <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
                              <div className="flex items-center space-x-2">
                                <span className="text-xs text-gray-500">Was this helpful?</span>
                                <div className="flex space-x-1">
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    onClick={() => handleRating(message.id, 1)}
                                    className={`p-1 h-6 w-6 ${message.rating === 1 ? "text-green-600" : "text-gray-400"}`}
                                  >
                                    <ThumbsUp className="h-3 w-3" />
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    onClick={() => handleRating(message.id, -1)}
                                    className={`p-1 h-6 w-6 ${message.rating === -1 ? "text-red-600" : "text-gray-400"}`}
                                  >
                                    <ThumbsDown className="h-3 w-3" />
                                  </Button>
                                </div>
                              </div>
                              <Button size="sm" variant="ghost" className="text-xs text-gray-500 hover:text-gray-700">
                                <RefreshCw className="h-3 w-3 mr-1" />
                                Regenerate
                              </Button>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              {isTyping && (
                <div className="flex justify-start">
                  <div className="max-w-4xl w-full">
                    <div className="flex items-start space-x-4">
                      <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-xl flex items-center justify-center">
                        <Brain className="h-6 w-6 text-white" />
                      </div>
                      <div className="bg-white border border-gray-200 shadow-sm rounded-2xl p-6">
                        <div className="flex items-center space-x-2">
                          <div className="flex space-x-1">
                            <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce"></div>
                            <div
                              className="w-2 h-2 bg-purple-400 rounded-full animate-bounce"
                              style={{ animationDelay: "0.1s" }}
                            ></div>
                            <div
                              className="w-2 h-2 bg-purple-400 rounded-full animate-bounce"
                              style={{ animationDelay: "0.2s" }}
                            ></div>
                          </div>
                          <span className="text-sm text-gray-500">AI is thinking...</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          </div>

          {/* Enhanced Input Area */}
          <div className="border-t bg-white p-6">
            <div className="max-w-4xl mx-auto">
              {/* Quick Prompts */}
              <div className="mb-4">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-medium text-gray-700">Quick Actions</h3>
                  <Button variant="ghost" size="sm" className="text-xs text-gray-500">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2">
                  {quickPrompts.map((prompt, index) => (
                    <Button
                      key={index}
                      size="sm"
                      variant="outline"
                      onClick={() => setInputValue(prompt.text)}
                      className="bg-white text-gray-700 border-gray-200 hover:bg-gray-50 justify-start text-left h-auto p-3"
                    >
                      <div className="flex flex-col items-start space-y-1">
                        <div className="flex items-center space-x-2">
                          <prompt.icon className="h-4 w-4" />
                          <span className="text-xs font-medium">{prompt.category}</span>
                        </div>
                        <span className="text-xs text-gray-600 line-clamp-2">{prompt.text}</span>
                      </div>
                    </Button>
                  ))}
                </div>
              </div>

              {/* Main Input */}
              <div className="flex space-x-4">
                <div className="flex-1 relative">
                  <Textarea
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault()
                        handleSendMessage()
                      }
                    }}
                    placeholder="Ask me anything about math, request visualizations, or upload an image of a problem..."
                    className="min-h-[60px] pr-32 resize-none"
                  />
                  <div className="absolute right-2 bottom-2 flex items-center space-x-1">
                    <Button size="sm" variant="ghost" onClick={handleFileUpload} className="h-8 w-8 p-0">
                      <Upload className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={handleVoiceInput}
                      className={`h-8 w-8 p-0 ${isListening ? "text-red-600" : ""}`}
                    >
                      {isListening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
                    </Button>
                    <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                      <Camera className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <Button
                  onClick={handleSendMessage}
                  disabled={!inputValue.trim() || isTyping}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 px-8"
                >
                  <Send className="h-4 w-4 mr-2" />
                  Send
                </Button>
              </div>

              {/* Input Controls */}
              <div className="flex items-center justify-between mt-3">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <Label htmlFor="difficulty" className="text-sm text-gray-600">
                      Difficulty:
                    </Label>
                    <select
                      id="difficulty"
                      value={difficulty}
                      onChange={(e) => setDifficulty(e.target.value as any)}
                      className="text-sm border border-gray-200 rounded px-2 py-1"
                    >
                      <option value="beginner">Beginner</option>
                      <option value="intermediate">Intermediate</option>
                      <option value="advanced">Advanced</option>
                    </select>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch id="step-by-step" checked={showStepByStep} onCheckedChange={setShowStepByStep} />
                    <Label htmlFor="step-by-step" className="text-sm text-gray-600">
                      Step-by-step
                    </Label>
                  </div>
                </div>
                <div className="text-xs text-gray-500">Press Enter to send, Shift+Enter for new line</div>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Visualization Panel */}
        {(showVisualization || showAnimation) && (
          <div
            className={`bg-white border-l shadow-lg transition-all duration-300 ${
              isFullscreen ? "fixed inset-0 z-50" : "w-96 lg:w-[500px]"
            }`}
          >
            <div className="h-full flex flex-col">
              {/* Panel Header */}
              <div className="p-4 border-b bg-gray-50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Sparkles className="h-5 w-5 text-purple-600" />
                    <h3 className="font-semibold text-gray-900">
                      {showAnimation ? "Interactive Animation" : "Mathematical Visualization"}
                    </h3>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => setIsFullscreen(!isFullscreen)}
                      className="h-8 w-8 p-0"
                    >
                      {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => {
                        setShowVisualization(false)
                        setShowAnimation(false)
                        setIsFullscreen(false)
                      }}
                      className="h-8 w-8 p-0"
                    >
                      ×
                    </Button>
                  </div>
                </div>
              </div>

              {/* Visualization Content */}
              <div className="flex-1 p-4">
                <Tabs defaultValue="visualization" className="h-full">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="visualization">Visual</TabsTrigger>
                    <TabsTrigger value="interactive">Interactive</TabsTrigger>
                    <TabsTrigger value="settings">Settings</TabsTrigger>
                  </TabsList>

                  <TabsContent value="visualization" className="mt-4 h-[calc(100%-3rem)]">
                    <div className="bg-gray-900 rounded-lg h-80 flex items-center justify-center mb-4 relative overflow-hidden">
                      {/* Placeholder for actual visualization */}
                      <div className="text-center text-white">
                        <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                          <BarChart3 className="h-8 w-8" />
                        </div>
                        <p className="text-lg font-medium mb-2">Mean Value Theorem</p>
                        <p className="text-sm text-gray-300">Interactive visualization loading...</p>
                      </div>

                      {/* Overlay Controls */}
                      <div className="absolute bottom-4 left-4 right-4">
                        <div className="flex items-center justify-between">
                          <div className="flex space-x-2">
                            <Button size="sm" variant="secondary" className="bg-white/20 text-white border-white/30">
                              <Play className="h-4 w-4 mr-1" />
                              Play
                            </Button>
                            <Button size="sm" variant="secondary" className="bg-white/20 text-white border-white/30">
                              <RotateCcw className="h-4 w-4 mr-1" />
                              Reset
                            </Button>
                          </div>
                          <Button size="sm" variant="secondary" className="bg-white/20 text-white border-white/30">
                            <RefreshCw className="h-4 w-4 mr-1" />
                            Regenerate
                          </Button>
                        </div>
                      </div>
                    </div>

                    {/* Visualization Info */}
                    <div className="space-y-4">
                      <Card>
                        <CardHeader className="pb-3">
                          <CardTitle className="text-sm">Current Parameters</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span>Function:</span>
                            <code className="bg-gray-100 px-2 py-1 rounded text-xs">f(x) = x²</code>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span>Interval:</span>
                            <code className="bg-gray-100 px-2 py-1 rounded text-xs">[0, 2]</code>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span>c value:</span>
                            <code className="bg-gray-100 px-2 py-1 rounded text-xs">1.414</code>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </TabsContent>

                  <TabsContent value="interactive" className="mt-4">
                    <div className="space-y-4">
                      <Card>
                        <CardHeader>
                          <CardTitle className="text-sm">Function Parameters</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div>
                            <Label className="text-sm">Coefficient a</Label>
                            <Slider value={[1]} onValueChange={() => {}} max={5} min={-5} step={0.1} className="mt-2" />
                          </div>
                          <div>
                            <Label className="text-sm">Interval Start</Label>
                            <Slider value={[0]} onValueChange={() => {}} max={5} min={-5} step={0.1} className="mt-2" />
                          </div>
                          <div>
                            <Label className="text-sm">Interval End</Label>
                            <Slider value={[2]} onValueChange={() => {}} max={5} min={-5} step={0.1} className="mt-2" />
                          </div>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardHeader>
                          <CardTitle className="text-sm">Display Options</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                          <div className="flex items-center justify-between">
                            <Label className="text-sm">Show tangent line</Label>
                            <Switch />
                          </div>
                          <div className="flex items-center justify-between">
                            <Label className="text-sm">Show secant line</Label>
                            <Switch defaultChecked />
                          </div>
                          <div className="flex items-center justify-between">
                            <Label className="text-sm">Show c-value</Label>
                            <Switch defaultChecked />
                          </div>
                          <div className="flex items-center justify-between">
                            <Label className="text-sm">Animate automatically</Label>
                            <Switch />
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </TabsContent>

                  <TabsContent value="settings" className="mt-4">
                    <div className="space-y-4">
                      <Card>
                        <CardHeader>
                          <CardTitle className="text-sm">Animation Settings</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div>
                            <Label className="text-sm">Animation Speed</Label>
                            <Slider
                              value={[animationSettings.speed]}
                              onValueChange={(value) => setAnimationSettings((prev) => ({ ...prev, speed: value[0] }))}
                              max={3}
                              min={0.1}
                              step={0.1}
                              className="mt-2"
                            />
                          </div>
                          <div className="flex items-center justify-between">
                            <Label className="text-sm">Show step-by-step</Label>
                            <Switch
                              checked={animationSettings.showSteps}
                              onCheckedChange={(checked) =>
                                setAnimationSettings((prev) => ({ ...prev, showSteps: checked }))
                              }
                            />
                          </div>
                          <div className="flex items-center justify-between">
                            <Label className="text-sm">Show formulas</Label>
                            <Switch
                              checked={animationSettings.showFormulas}
                              onCheckedChange={(checked) =>
                                setAnimationSettings((prev) => ({ ...prev, showFormulas: checked }))
                              }
                            />
                          </div>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardHeader>
                          <CardTitle className="text-sm">Export Options</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2">
                          <Button variant="outline" size="sm" className="w-full justify-start">
                            <Download className="h-4 w-4 mr-2" />
                            Download as PNG
                          </Button>
                          <Button variant="outline" size="sm" className="w-full justify-start">
                            <FileText className="h-4 w-4 mr-2" />
                            Export as PDF
                          </Button>
                          <Button variant="outline" size="sm" className="w-full justify-start">
                            <Code className="h-4 w-4 mr-2" />
                            Get embed code
                          </Button>
                        </CardContent>
                      </Card>
                    </div>
                  </TabsContent>
                </Tabs>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Hidden file input */}
      <input ref={fileInputRef} type="file" accept="image/*,.pdf" className="hidden" onChange={() => {}} />
    </div>
  )
}
