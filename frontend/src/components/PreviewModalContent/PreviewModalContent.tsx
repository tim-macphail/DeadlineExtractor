import { Deadline } from "../../types";
import { DeadlineCalendar } from "../DeadlineCalendar/DeadlineCalendar";

import ical from "ical-generator"

export interface PreviewModalContentProps {
  deadlines: Array<Deadline>;
}

const handleDownloadClick = (deadlines: Array<Deadline>) => {
  const cal = ical({ name: 'Deadlines', timezone: 'UTC' });

  deadlines.forEach(deadline => {
    cal.createEvent({
      start: new Date(deadline.date),
      summary: deadline.name,
      description: deadline.description || "",
    });
  });

  // Download the .ics file
  const icsContent = cal.toString();
  const blob = new Blob([icsContent], { type: 'text/calendar' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'deadlines.ics';
  a.click();
  URL.revokeObjectURL(url);
}

const PreviewModalContent = ({ deadlines }: PreviewModalContentProps) => {
  return (
    <div style={{
      width: '50vw',
      minWidth: '600px',
      maxHeight: '80vh',
      padding: '1em',
      display: 'flex',
      flexDirection: 'column',
      gap: '1em',
      alignItems: 'center',
      justifyContent: 'center',
    }}>
      <DeadlineCalendar onEventClick={() => { }} deadlines={deadlines} />
      <div style={{
        display: 'flex',
        gap: '1em',
      }}>
        <button
          style={{
            backgroundColor: "#007bff",
            padding: "1em 2em",
            color: "white",
            border: "none",
            borderRadius: "1em",
            cursor: "pointer",
            fontSize: "1em",
            boxShadow: "0 2px 10px rgba(0, 0, 0, 0.3)",
          }}
          onClick={() => handleDownloadClick(deadlines)}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = "#0056b3";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = "#007bff";
          }}
        >
          Download calendar
        </button>
        {/* <button
          style={{
            backgroundColor: "#b9b9b9b9",
            aspectRatio: "1 / 1",
            height: "2em",
            color: "white",
            border: "none",
            borderRadius: "50%",
            cursor: "pointer",
            fontSize: "1.5em",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          ?
        </button> */}
      </div>
    </div>
  )
}

export default PreviewModalContent;