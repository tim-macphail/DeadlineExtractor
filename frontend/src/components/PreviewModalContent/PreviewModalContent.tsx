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
        <div style={{ width: '100%', height: '100%' }}>
            <DeadlineCalendar onEventClick={() => { }} deadlines={deadlines} />
            <button onClick={() => handleDownloadClick(deadlines)}>
                Download .ics
            </button>
        </div>
    )
}

export default PreviewModalContent;