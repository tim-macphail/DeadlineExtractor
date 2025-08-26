import { Deadline } from "../../types";
import { DeadlineCalendar } from "../DeadlineCalendar/DeadlineCalendar";

export interface PreviewModalContentProps {
    deadlines: Array<Deadline>;
}

const handleDownloadClick = (deadlines: Array<Deadline>) => {
    // Create a simple .ics file content
    let icsContent = `BEGIN:VCALENDAR
VERSION:2.0
CALSCALE:GREGORIAN
`;

    deadlines.forEach(deadline => {
        icsContent += `BEGIN:VEVENT
SUMMARY:${deadline.name}
DTSTART:${deadline.date}
DESCRIPTION:${deadline.description || ""}
END:VEVENT
`;
    });

    icsContent += `END:VCALENDAR`;

    // Create a blob and download the .ics file
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
        <div style={{ width: '100%', height: '100%' }}>
            <DeadlineCalendar onEventClick={() => { }} deadlines={deadlines} />
            <button onClick={() => handleDownloadClick(deadlines)}>
                Download .ics
            </button>
        </div>
    )
}

export default PreviewModalContent;