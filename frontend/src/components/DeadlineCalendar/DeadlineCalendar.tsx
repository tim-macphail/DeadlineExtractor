
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';

import './DeadlineCalendar.css';
import { Deadline } from '../../types';

export interface DeadlineCalendarProps {
  deadlines: Array<Deadline>;
  onEventClick: (deadline: Deadline) => void;
}


export function DeadlineCalendar({ deadlines, onEventClick }: DeadlineCalendarProps) {
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

  // Render content for calendar tiles
  const tileContent = ({ date, view }: { date: Date; view: string }) => {
    if (view !== 'month') return null;

    const events = getEventsForDate(date);


    return (
      <div style={{ height: '3em', overflowY: 'auto' }}>
        {events.map((event, _index) => (
          <div key={event.id} style={{
            backgroundColor: 'rosybrown',
            color: '#333',
            borderRadius: '0.5em',
            marginBottom: '2px',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            fontWeight: 500,
            fontSize: '1em',
          }}
            title={event.name}
          >
            <span>{event.name}</span>
          </div>
        ))}
      </div >
    );
  };

  return (
    <Calendar
      value={null}
      className="deadline-calendar"
      tileContent={tileContent}
    />
  );
}
