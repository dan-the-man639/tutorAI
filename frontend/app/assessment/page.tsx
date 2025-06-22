"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { Brain, ArrowLeft, ArrowRight } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

const questions = [
  {
    id: 1,
    question: "How do you prefer to learn new concepts?",
    options: [
      { value: "visual", label: "Through diagrams, charts, and visual aids" },
      { value: "auditory", label: "By listening to explanations and discussions" },
      { value: "kinesthetic", label: "Through hands-on practice and experimentation" },
      { value: "reading", label: "By reading detailed explanations and taking notes" },
    ],
  },
  {
    id: 2,
    question: "When facing a challenging problem, you typically:",
    options: [
      { value: "systematic", label: "Break it down into smaller, manageable steps" },
      { value: "intuitive", label: "Trust your gut feeling and dive right in" },
      { value: "collaborative", label: "Seek help and discuss it with others" },
      { value: "research", label: "Research similar problems and solutions first" },
    ],
  },
  {
    id: 3,
    question: "What motivates you most in learning?",
    options: [
      { value: "achievement", label: "Achieving high grades and recognition" },
      { value: "understanding", label: "Deep understanding of concepts" },
      { value: "application", label: "Seeing real-world applications" },
      { value: "creativity", label: "Finding creative solutions to problems" },
    ],
  },
  {
    id: 4,
    question: "How do you handle mistakes while learning?",
    options: [
      { value: "analytical", label: "Analyze what went wrong and create a plan" },
      { value: "resilient", label: "Keep trying different approaches until it works" },
      { value: "supportive", label: "Seek encouragement and guidance from others" },
      { value: "reflective", label: "Take time to reflect and understand the mistake" },
    ],
  },
  {
    id: 5,
    question: "What's your ideal learning environment?",
    options: [
      { value: "structured", label: "Organized, quiet space with clear schedules" },
      { value: "flexible", label: "Flexible environment where I can move around" },
      { value: "social", label: "Collaborative space with peers and mentors" },
      { value: "independent", label: "Private space where I can focus alone" },
    ],
  },
  {
    id: 6,
    question: "When explaining math to a friend, you would:",
    options: [
      { value: "step-by-step", label: "Walk through each step methodically" },
      { value: "big-picture", label: "Start with the big picture, then dive into details" },
      { value: "examples", label: "Use lots of examples and analogies" },
      { value: "practice", label: "Have them practice similar problems" },
    ],
  },
]

export default function AssessmentPage() {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<Record<number, string>>({})
  const [isComplete, setIsComplete] = useState(false)
  const router = useRouter()

  const handleAnswer = (questionId: number, value: string) => {
    setAnswers((prev) => ({ ...prev, [questionId]: value }))
  }

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion((prev) => prev + 1)
    } else {
      setIsComplete(true)
    }
  }

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion((prev) => prev - 1)
    }
  }

  const handleComplete = () => {
    // Here you would typically send the answers to your backend
    console.log("Assessment answers:", answers)
    router.push("/dashboard")
  }

  const progress = ((currentQuestion + 1) / questions.length) * 100

  if (isComplete) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-2xl">
          <CardHeader className="text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Brain className="h-8 w-8 text-green-600" />
            </div>
            <CardTitle className="text-2xl">Assessment Complete!</CardTitle>
            <CardDescription>
              Thank you for completing the personality assessment. We're now creating your personalized learning
              profile.
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <div className="bg-gray-50 rounded-lg p-6 mb-6">
              <h3 className="font-semibold mb-2">Your Learning Profile</h3>
              <p className="text-sm text-gray-600 mb-4">
                Based on your responses, we've identified your learning preferences and will customize your AI tutor
                accordingly.
              </p>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="bg-white rounded p-3">
                  <div className="font-medium text-blue-600">Learning Style</div>
                  <div className="text-gray-600">Visual & Systematic</div>
                </div>
                <div className="bg-white rounded p-3">
                  <div className="font-medium text-purple-600">Motivation</div>
                  <div className="text-gray-600">Understanding-Driven</div>
                </div>
              </div>
            </div>
            <Button onClick={handleComplete} size="lg" className="bg-blue-600 hover:bg-blue-700">
              Start Learning Journey
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <div className="border-b bg-white/80 backdrop-blur-sm">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center space-x-2">
              <ArrowLeft className="h-5 w-5 text-gray-600" />
              <span className="text-gray-600">Back to Home</span>
            </Link>
            <div className="flex items-center space-x-2">
              <Brain className="h-6 w-6 text-blue-600" />
              <span className="font-semibold text-gray-900">MathMind AI</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Progress */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-gray-600">
              Question {currentQuestion + 1} of {questions.length}
            </span>
            <span className="text-sm font-medium text-gray-600">{Math.round(progress)}% Complete</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        {/* Question Card */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-xl">{questions[currentQuestion].question}</CardTitle>
            <CardDescription>
              Choose the option that best describes you. There are no right or wrong answers.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <RadioGroup
              value={answers[questions[currentQuestion].id] || ""}
              onValueChange={(value) => handleAnswer(questions[currentQuestion].id, value)}
            >
              {questions[currentQuestion].options.map((option, index) => (
                <div
                  key={index}
                  className="flex items-start space-x-3 p-4 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <RadioGroupItem value={option.value} id={`option-${index}`} className="mt-1" />
                  <Label htmlFor={`option-${index}`} className="flex-1 cursor-pointer leading-relaxed">
                    {option.label}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </CardContent>
        </Card>

        {/* Navigation */}
        <div className="flex justify-between">
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={currentQuestion === 0}
            className="bg-white text-gray-900"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Previous
          </Button>
          <Button
            onClick={handleNext}
            disabled={!answers[questions[currentQuestion].id]}
            className="bg-blue-600 hover:bg-blue-700"
          >
            {currentQuestion === questions.length - 1 ? "Complete Assessment" : "Next Question"}
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}
