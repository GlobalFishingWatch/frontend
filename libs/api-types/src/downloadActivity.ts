export enum DownloadActivityStatus {
  NotStarted = 'not-started',
  Generating = 'generating',
  Done = 'done',
  Failed = 'failed',
}

export type DownloadActivity = {
  id: string
  name: string
  userId: number
  userType: string
  status: DownloadActivityStatus
}
