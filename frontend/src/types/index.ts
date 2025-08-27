import type { IHighlight } from "react-pdf-highlighter";

export interface Deadline {
  id: string;
  name: string;
  date: string; // format: 2025-08-26 or 2025-08-26T23:11
  description?: string;
  highlight?: IHighlight;
}

export interface DeadlineData {
  name: string;
  date: string;
  description?: string;
}
