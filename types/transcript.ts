export interface Grade {
    code: string
    majorName: string
    value: number
    credit: number
    mention: string
  }
  
  export interface Transcript {
    name: string
    registerNumber: string
    major: string
    level: string
    universityYear: string
    semester: string
    grades: Grade[]
    creditsRegistered: number
    creditsValid: number
    averageGenerale: number
    generalMention: string
    result: string
    totalCreditsValid: number
    cumulativeAverage: number
    signatureDate: string
    reference: string
  }
  
  export interface TranscriptFilters {
    studentIds: number[]
    semesterIds: number[]
    universityYear: string
  }
  
  export interface ApiResponse<T> {
    data: T
    message?: string
  }
  