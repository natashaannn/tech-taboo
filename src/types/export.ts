export type ExportFormat = "svg" | "png" | "pdf";

export interface ExportOptions {
  format: ExportFormat;
  quality?: number;
  width?: number;
  height?: number;
  filename?: string;
}

export interface ExportProgress {
  id: string;
  status: "pending" | "processing" | "completed" | "error";
  progress: number;
  error?: string;
}

export interface ExportResult {
  blob: Blob;
  filename: string;
  size: number;
}
