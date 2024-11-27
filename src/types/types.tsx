export interface Script {
  id: string
  official: boolean
  teensyville: boolean
  synopsis: string
  logo: string
  name: string
  author: string
  note: string
  json: string
  pdf: string
}

export interface ScriptCategoryProps {
  title: string
  scripts: Script[]
  onCopyJson: (json: string, id: string) => void
  onDownloadJson: (json: string, id: string) => void
  onDownloadSheet: (pdf: string, id: string) => void
  copiedId: string | null
  downloadingId: string | null
}

export interface ActionButtonsProps {
  script: Script
  onCopyJson: (json: string, id: string) => void
  onDownloadJson: (json: string, id: string) => void
  onDownloadSheet: (pdf: string, id: string) => void
  copiedId: string | null
  downloadingId: string | null
}
