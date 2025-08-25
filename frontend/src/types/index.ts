import type { IHighlight } from "react-pdf-highlighter";

export interface Deadline {
  id: string;
  name: string;
  date: string;
  description?: string;
  highlight?: IHighlight;
}

export interface DeadlineData {
  name: string;
  date: string;
  description?: string;
}
