export enum ReportStatus {
  NotStarted = 'not-started',
  Generating = 'generating',
  Done = 'done',
  Failed = 'failed',
}

export type Report = {
  id: string
  name: string
  userId: number
  userType: string
  completedDate?: string
  startedDate?: string
  downloaded: boolean
  createdAt: string
  status: ReportStatus
}
