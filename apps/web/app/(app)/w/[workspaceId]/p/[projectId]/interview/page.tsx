"use client"

import { useState } from "react"
import { useParams } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

interface InterviewQuestion {
  id: string
  question: string
  fieldName: string
  answered: boolean
}

const INITIAL_QUESTIONS: InterviewQuestion[] = [
  {
    id: '1',
    question: 'What problem are you trying to solve?',
    fieldName: 'problem',
    answered: false,
  },
  {
    id: '2',
    question: 'Who is your target user?',
    fieldName: 'targetUser',
    answered: false,
  },
  {
    id: '3',
    question: 'What is your core value proposition?',
    fieldName: 'valueProposition',
    answered: false,
  },
  {
    id: '4',
    question: 'What are your constraints? (budget, timeline, team size)',
    fieldName: 'constraints',
    answered: false,
  },
]

export default function InterviewPage() {
  const params = useParams()
  const projectId = params.projectId as string
  
  const [questions, setQuestions] = useState(INITIAL_QUESTIONS)
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [answer, setAnswer] = useState('')
  const [interviewData, setInterviewData] = useState<Record<string, string>>({})
  const [saving, setSaving] = useState(false)

  const currentQuestion = questions[currentQuestionIndex]
  const progress = questions.filter(q => q.answered).length
  const total = questions.length

  const handleSubmitAnswer = async () => {
    if (!answer.trim()) return

    setSaving(true)
    try {
      // Save answer to interview data
      const newData = {
        ...interviewData,
        [currentQuestion.fieldName]: answer,
      }
      setInterviewData(newData)

      // Mark question as answered
      const updatedQuestions = [...questions]
      updatedQuestions[currentQuestionIndex].answered = true
      setQuestions(updatedQuestions)

      // Save to backend
      await fetch(`/api/v1/projects/${projectId}/interview`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ interviewData: newData }),
      })

      // Move to next question
      if (currentQuestionIndex < questions.length - 1) {
        setCurrentQuestionIndex(currentQuestionIndex + 1)
        setAnswer('')
      }
    } catch (error) {
      console.error('Failed to save answer:', error)
    } finally {
      setSaving(false)
    }
  }

  const handleSkip = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1)
      setAnswer('')
    }
  }

  const isComplete = progress === total

  return (
    <div className="container max-w-4xl py-8">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">AI Interview</h1>
          <p className="text-muted-foreground mt-2">
            Help us understand your project by answering a few questions
          </p>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Progress</CardTitle>
              <Badge variant={isComplete ? 'ready' : 'generating'}>
                {progress} / {total} completed
              </Badge>
            </div>
            <CardDescription>
              Answer all questions to proceed to validation
            </CardDescription>
          </CardHeader>
        </Card>

        {!isComplete ? (
          <Card>
            <CardHeader>
              <CardTitle>Question {currentQuestionIndex + 1}</CardTitle>
              <CardDescription>{currentQuestion.question}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <textarea
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                className="w-full min-h-[200px] rounded-md border border-input bg-background px-3 py-2 text-sm"
                placeholder="Type your answer here..."
              />
              <div className="flex gap-2">
                <Button onClick={handleSubmitAnswer} disabled={saving || !answer.trim()}>
                  {saving ? 'Saving...' : 'Submit Answer'}
                </Button>
                <Button variant="outline" onClick={handleSkip}>
                  Skip for Now
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle>Interview Complete!</CardTitle>
              <CardDescription>
                All questions answered. Ready to proceed to validation.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button>Continue to Validation</Button>
            </CardContent>
          </Card>
        )}

        <Card>
          <CardHeader>
            <CardTitle>Your Answers</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {questions.map((q) => (
              <div key={q.id} className="space-y-2">
                <p className="text-sm font-medium">{q.question}</p>
                <p className="text-sm text-muted-foreground">
                  {interviewData[q.fieldName] || 'Not answered yet'}
                </p>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
