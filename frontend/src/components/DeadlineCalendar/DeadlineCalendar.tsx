
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import type { Deadline } from '../../App';

import './DeadlineCalendar.css';

interface Props {
  deadlines: Array<Deadline>;
  onEventClick: (deadline: Deadline) => void;
}

export function DeadlineCalendar({ deadlines, onEventClick }: Props) {
  // Get events for a specific date
  const getEventsForDate = (date: Date) => {
    return deadlines.filter(deadline => {
      const deadlineDate = new Date(deadline.date);
      return (
        deadlineDate.getDate() === date.getDate() &&
        deadlineDate.getMonth() === date.getMonth() &&
        deadlineDate.getFullYear() === date.getFullYear()
      );
    });
  };

  // Check if a date has events
  const hasEvents = (date: Date) => {
    return getEventsForDate(date).length > 0;
  };

  // Custom tile content to show event indicators
  const tileContent = ({ date, view }: { date: Date; view: string }) => {
    if (view === 'month') {
      const events = getEventsForDate(date);
      return (
        <div style={{
          position: 'relative',
          height: '14px',
          width: '100%',
        }}>
          {hasEvents(date) && (
            <div
              style={{
                position: 'absolute',
                top: '2px',
                right: '2px',
                borderRadius: '50%',
                backgroundColor: '#2563eb',
                color: 'white',
                width: '20px',
                height: '20px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '12px',
                fontWeight: 'bold',
                cursor: 'pointer',
                zIndex: 1
              }}
              onClick={(e) => {
                if (onEventClick) {
                  e.stopPropagation();
                  onEventClick(events[0]); // Pass the first event for now
                }
              }}
            >
              {events.length}
            </div>
          )}
        </div>
      );
    }
    return null;
  };

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      gap: '1rem'
    }}>
      <Calendar
        value={null}
        onChange={() => { }}
        tileContent={tileContent}
        className="deadline-calendar"
      />
    </div>
  );
}
