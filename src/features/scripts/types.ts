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

export interface ScriptActionHandlers {
  onCopyJson: (jsonUrl: string, scriptId: string) => void
  onDownloadJson: (jsonUrl: string, scriptId: string) => void
  onDownloadPdf: (pdfUrl: string, scriptId: string) => void
  copiedId: string | null
  downloadingId: string | null
}

export interface ScriptCategoryProps extends ScriptActionHandlers {
  title: string
  scripts: Script[]
}

export interface ActionButtonsProps extends ScriptActionHandlers {
  script: Script
}
