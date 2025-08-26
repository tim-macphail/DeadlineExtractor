import { Deadline } from "../../types";
import { DeadlineCalendar } from "../DeadlineCalendar/DeadlineCalendar";

export interface PreviewModalContentProps {
    deadlines: Array<Deadline>;
}

const PreviewModalContent = ({ deadlines }: PreviewModalContentProps) => {
    return (
        <div style={{ width: '100%', height: '100%' }}>
            <DeadlineCalendar onEventClick={() => { }} deadlines={deadlines} />
            <button>
                Download .ics
            </button>
        </div>
    )
}

export default PreviewModalContent;