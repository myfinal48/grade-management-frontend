"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Download, FileText, Clock, CheckCircle, XCircle, Loader2 } from "lucide-react"
import { useDownloadPdf } from "@/hooks/usePdfTranscript"
import { PdfTranscriptRequest } from "@/types/pdfTranscript"

interface PdfTranscriptCardProps {
  request: PdfTranscriptRequest
}

type BadgeVariant = "default" | "secondary" | "destructive" | "outline"

export function PdfTranscriptCard({ request }: Readonly<PdfTranscriptCardProps>) {
  const downloadPdf = useDownloadPdf()

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const getStatusIcon = () => {
    switch (request.status) {
      case "pending":
        return <Clock className="h-4 w-4" />
      case "processing":
        return <Loader2 className="h-4 w-4 animate-spin" />
      case "completed":
        return <CheckCircle className="h-4 w-4" />
      case "failed":
        return <XCircle className="h-4 w-4" />
      default:
        return <Clock className="h-4 w-4" />
    }
  }

  const getStatusColor = (): BadgeVariant => {
    switch (request.status) {
      case "pending":
        return "secondary"
      case "processing":
        return "default"
      case "completed":
        return "default"
      case "failed":
        return "destructive"
      default:
        return "secondary"
    }
  }

  const handleDownload = async () => {
    if (request.downloadUrl) {
      const link = document.createElement("a")
      link.href = request.downloadUrl
      link.download = request.fileName ?? `transcript-${request.id}.pdf`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    } else {
      await downloadPdf.mutateAsync(request.id)
    }
  }

  return (
    <Card className="h-full">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <CardTitle className="text-lg flex items-center gap-2">
              <FileText className="h-5 w-5" />
              PDF Request #{request.id}
            </CardTitle>
            <div className="flex gap-2">
              <Badge variant={getStatusColor()} className="text-xs flex items-center gap-1">
                {getStatusIcon()}
                {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
              </Badge>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div>
            <p className="text-sm font-medium">University Year</p>
            <p className="text-sm text-muted-foreground">{request.universityYear}</p>
          </div>

          <div>
            <p className="text-sm font-medium">Students ({request.studentIds.length})</p>
            <div className="flex flex-wrap gap-1 mt-1">
              {request.studentNames?.slice(0, 3).map((name, index) => (
                <Badge key={index} variant="outline" className="text-xs">
                  {name}
                </Badge>
              ))}
              {request.studentNames && request.studentNames.length > 3 && (
                <Badge variant="outline" className="text-xs">
                  +{request.studentNames.length - 3} more
                </Badge>
              )}
            </div>
          </div>

          <div>
            <p className="text-sm font-medium">Semesters ({request.semesterIds.length})</p>
            <div className="flex flex-wrap gap-1 mt-1">
              {request.semesterNames?.slice(0, 2).map((name, index) => (
                <Badge key={index} variant="outline" className="text-xs">
                  {name}
                </Badge>
              ))}
              {request.semesterNames && request.semesterNames.length > 2 && (
                <Badge variant="outline" className="text-xs">
                  +{request.semesterNames.length - 2} more
                </Badge>
              )}
            </div>
          </div>

          <div className="text-xs text-muted-foreground">
            <p>Created: {formatDate(request.createdAt)}</p>
            {request.completedAt && <p>Completed: {formatDate(request.completedAt)}</p>}
          </div>
        </div>
      </CardContent>
      <CardFooter className="pt-0">
        <div className="flex gap-2 w-full">
          {request.status === "completed" && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleDownload}
              disabled={downloadPdf.isPending}
              className="flex-1"
            >
              <Download className="mr-2 h-4 w-4" />
              {downloadPdf.isPending ? "Downloading..." : "Download"}
            </Button>
          )}
          {request.status === "failed" && (
            <Button variant="outline" size="sm" disabled className="flex-1">
              Failed - Cannot Download
            </Button>
          )}
          {(request.status === "pending" || request.status === "processing") && (
            <Button variant="outline" size="sm" disabled className="flex-1">
              {request.status === "processing" ? "Processing..." : "Pending..."}
            </Button>
          )}
        </div>
      </CardFooter>
    </Card>
  )
}
