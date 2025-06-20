"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertCircle, RefreshCw, Lock, LogIn } from "lucide-react"

interface PdfTranscriptErrorProps {
  error: Error
  onRetry: () => void
}

export function PdfTranscriptError({ error, onRetry }: PdfTranscriptErrorProps) {
  const isAuthError = error.message.includes("permission") || error.message.includes("log in")
  const isTimeoutError = error.message.includes("timed out")

  const getErrorIcon = () => {
    if (isAuthError) return <Lock className="h-6 w-6 text-destructive" />
    return <AlertCircle className="h-6 w-6 text-destructive" />
  }

  const getErrorTitle = () => {
    if (isAuthError) return "Access Denied"
    if (isTimeoutError) return "Request Timeout"
    return "Something went wrong"
  }

  const getErrorDescription = () => {
    if (isAuthError) return error.message
    if (isTimeoutError) return error.message
    return error.message || "Failed to load PDF transcript requests. Please try again."
  }

  const handleAuthRedirect = () => {
    window.location.href = "/login"
  }

  return (
    <div className="flex items-center justify-center py-12">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10">
            {getErrorIcon()}
          </div>
          <CardTitle>{getErrorTitle()}</CardTitle>
          <CardDescription>{getErrorDescription()}</CardDescription>
        </CardHeader>
        <CardContent className="text-center space-y-2">
          {isAuthError ? (
            <Button onClick={handleAuthRedirect} className="w-full">
              <LogIn className="mr-2 h-4 w-4" />
              Accéder à la connexion
            </Button>
          ) : (
            <Button onClick={onRetry} variant="outline" className="w-full">
              <RefreshCw className="mr-2 h-4 w-4" />
              Essayer à nouveau
            </Button>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
