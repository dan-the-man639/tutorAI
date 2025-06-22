"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Brain,
  MessageCircle,
  Play,
  BookOpen,
  TrendingUp,
  Award,
  Clock,
  Target,
  Sparkles,
  BarChart3,
  User,
  Settings,
  Bell,
} from "lucide-react"
import Link from "next/link"

export default function DashboardPage() {
  const [currentStreak, setCurrentStreak] = useState(7)
  const [totalPoints, setTotalPoints] = useState(1250)

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Navigation */}
      <nav className="border-b bg-white/80 backdrop-blur-sm shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                <Brain className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">MathMind AI</h1>
                <p className="text-xs text-gray-500">Your Learning Dashboard</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                <Award className="w-4 h-4 mr-1" />
                {totalPoints} Points
              </Badge>
              <Badge variant="secondary" className="bg-green-100 text-green-800">
                <Target className="w-4 h-4 mr-1" />
                {currentStreak} Day Streak
              </Badge>
              <Button variant="outline" size="sm" className="bg-white">
                <Bell className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="sm" className="bg-white">
                <Settings className="h-4 w-4" />
              </Button>
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <User className="h-5 w-5 text-blue-600" />
              </div>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome back, John! 👋</h1>
          <p className="text-gray-600">Ready to continue your math learning journey?</p>
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Link href="/tutor">
            <Card className="hover:shadow-lg transition-all duration-200 cursor-pointer border-2 border-transparent hover:border-blue-200 bg-white">
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
                    <MessageCircle className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg text-gray-900">Chat with AI Tutor</h3>
                    <p className="text-gray-600 text-sm">Get instant help with any math problem</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>

          <Card className="hover:shadow-lg transition-all duration-200 cursor-pointer border-2 border-transparent hover:border-purple-200 bg-white">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center">
                  <Play className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg text-gray-900">Watch Animations</h3>
                  <p className="text-gray-600 text-sm">Visualize complex math concepts</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-all duration-200 cursor-pointer border-2 border-transparent hover:border-green-200 bg-white">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center">
                  <BookOpen className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg text-gray-900">Practice Problems</h3>
                  <p className="text-gray-600 text-sm">Reinforce your learning with exercises</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 bg-white">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="progress">Progress</TabsTrigger>
            <TabsTrigger value="topics">Topics</TabsTrigger>
            <TabsTrigger value="achievements">Achievements</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              {/* Current Learning */}
              <Card className="bg-white">
                <CardHeader>
                  <CardTitle className="flex items-center text-gray-900">
                    <BookOpen className="h-5 w-5 mr-2 text-blue-600" />
                    Continue Learning
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium text-gray-900">Quadratic Equations</h4>
                        <p className="text-sm text-gray-600">Chapter 3: Solving by Factoring</p>
                      </div>
                      <Badge className="bg-blue-100 text-blue-800">In Progress</Badge>
                    </div>
                    <Progress value={65} className="h-2" />
                    <p className="text-sm text-gray-600">65% complete</p>
                    <Link href="/tutor">
                      <Button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                        Continue Learning
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>

              {/* Recent Activity */}
              <Card className="bg-white">
                <CardHeader>
                  <CardTitle className="flex items-center text-gray-900">
                    <Clock className="h-5 w-5 mr-2 text-green-600" />
                    Recent Activity
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">Completed: Linear Functions Quiz</p>
                        <p className="text-xs text-gray-500">2 hours ago</p>
                      </div>
                      <Badge variant="secondary" className="bg-green-100 text-green-800">
                        +50 pts
                      </Badge>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">Watched: Parabola Animation</p>
                        <p className="text-xs text-gray-500">Yesterday</p>
                      </div>
                      <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                        +25 pts
                      </Badge>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">Chat Session: Algebra Help</p>
                        <p className="text-xs text-gray-500">2 days ago</p>
                      </div>
                      <Badge variant="secondary" className="bg-purple-100 text-purple-800">
                        +15 pts
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Recommended Topics */}
            <Card className="bg-white">
              <CardHeader>
                <CardTitle className="flex items-center text-gray-900">
                  <Sparkles className="h-5 w-5 mr-2 text-purple-600" />
                  Recommended for You
                </CardTitle>
                <CardDescription>
                  Based on your learning style and progress, here are some topics we think you'll enjoy
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors">
                    <h4 className="font-medium mb-2 text-gray-900">Polynomial Functions</h4>
                    <p className="text-sm text-gray-600 mb-3">Explore the behavior of polynomial graphs</p>
                    <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
                      Intermediate
                    </Badge>
                  </div>
                  <div className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors">
                    <h4 className="font-medium mb-2 text-gray-900">Trigonometric Identities</h4>
                    <p className="text-sm text-gray-600 mb-3">Master the fundamental trig identities</p>
                    <Badge variant="secondary" className="bg-orange-100 text-orange-800">
                      Advanced
                    </Badge>
                  </div>
                  <div className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors">
                    <h4 className="font-medium mb-2 text-gray-900">Systems of Equations</h4>
                    <p className="text-sm text-gray-600 mb-3">Solve multiple equations simultaneously</p>
                    <Badge variant="secondary" className="bg-green-100 text-green-800">
                      Beginner
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="progress" className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <Card className="bg-white">
                <CardHeader>
                  <CardTitle className="flex items-center text-gray-900">
                    <TrendingUp className="h-5 w-5 mr-2 text-green-600" />
                    Learning Progress
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between mb-2">
                        <span className="text-sm font-medium text-gray-900">Algebra</span>
                        <span className="text-sm text-gray-600">85%</span>
                      </div>
                      <Progress value={85} className="h-2" />
                    </div>
                    <div>
                      <div className="flex justify-between mb-2">
                        <span className="text-sm font-medium text-gray-900">Geometry</span>
                        <span className="text-sm text-gray-600">72%</span>
                      </div>
                      <Progress value={72} className="h-2" />
                    </div>
                    <div>
                      <div className="flex justify-between mb-2">
                        <span className="text-sm font-medium text-gray-900">Trigonometry</span>
                        <span className="text-sm text-gray-600">45%</span>
                      </div>
                      <Progress value={45} className="h-2" />
                    </div>
                    <div>
                      <div className="flex justify-between mb-2">
                        <span className="text-sm font-medium text-gray-900">Calculus</span>
                        <span className="text-sm text-gray-600">20%</span>
                      </div>
                      <Progress value={20} className="h-2" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white">
                <CardHeader>
                  <CardTitle className="flex items-center text-gray-900">
                    <BarChart3 className="h-5 w-5 mr-2 text-blue-600" />
                    Weekly Stats
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Problems Solved</span>
                      <span className="font-semibold text-gray-900">47</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Study Time</span>
                      <span className="font-semibold text-gray-900">8.5 hours</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Concepts Learned</span>
                      <span className="font-semibold text-gray-900">12</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Accuracy Rate</span>
                      <span className="font-semibold text-green-600">89%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="topics">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                { name: "Linear Equations", progress: 100, status: "completed" },
                { name: "Quadratic Functions", progress: 65, status: "in-progress" },
                { name: "Polynomial Operations", progress: 30, status: "in-progress" },
                { name: "Exponential Functions", progress: 0, status: "locked" },
                { name: "Logarithmic Functions", progress: 0, status: "locked" },
                { name: "Trigonometric Functions", progress: 0, status: "locked" },
              ].map((topic, index) => (
                <Card
                  key={index}
                  className={`bg-white ${
                    topic.status === "locked" ? "opacity-50" : "hover:shadow-lg transition-shadow cursor-pointer"
                  }`}
                >
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-semibold text-gray-900">{topic.name}</h3>
                      <Badge
                        variant="secondary"
                        className={
                          topic.status === "completed"
                            ? "bg-green-100 text-green-800"
                            : topic.status === "in-progress"
                              ? "bg-blue-100 text-blue-800"
                              : "bg-gray-100 text-gray-600"
                        }
                      >
                        {topic.status === "completed"
                          ? "Complete"
                          : topic.status === "in-progress"
                            ? "In Progress"
                            : "Locked"}
                      </Badge>
                    </div>
                    <Progress value={topic.progress} className="h-2 mb-2" />
                    <p className="text-sm text-gray-600">{topic.progress}% complete</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="achievements">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                { name: "First Steps", description: "Complete your first lesson", earned: true, points: 50 },
                { name: "Problem Solver", description: "Solve 100 problems", earned: true, points: 200 },
                { name: "Streak Master", description: "Maintain a 7-day streak", earned: true, points: 150 },
                {
                  name: "Speed Demon",
                  description: "Solve 10 problems in under 5 minutes",
                  earned: false,
                  points: 300,
                },
                { name: "Perfectionist", description: "Get 100% on 5 quizzes", earned: false, points: 250 },
                { name: "Explorer", description: "Try all topic areas", earned: false, points: 400 },
              ].map((achievement, index) => (
                <Card
                  key={index}
                  className={`bg-white ${achievement.earned ? "border-yellow-200 bg-yellow-50" : "opacity-75"}`}
                >
                  <CardContent className="p-6">
                    <div className="flex items-center space-x-4">
                      <div
                        className={`w-12 h-12 rounded-full flex items-center justify-center ${
                          achievement.earned ? "bg-yellow-100" : "bg-gray-100"
                        }`}
                      >
                        <Award className={`h-6 w-6 ${achievement.earned ? "text-yellow-600" : "text-gray-400"}`} />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900">{achievement.name}</h3>
                        <p className="text-sm text-gray-600">{achievement.description}</p>
                        <div className="flex items-center mt-2">
                          <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                            {achievement.points} points
                          </Badge>
                          {achievement.earned && <Badge className="ml-2 bg-green-100 text-green-800">Earned</Badge>}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
