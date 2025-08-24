import { useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import type { Deadline } from './App';

interface Props {
  deadlines: Array<Deadline>;
  onEventClick?: (deadline: Deadline) => void;
}

export function DeadlineCalendar({ deadlines, onEventClick }: Props) {
  const [date, setDate] = useState(new Date());

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
    if (view === 'month' && hasEvents(date)) {

      const events = getEventsForDate(date);
      console.log({ date, events });
      return (
        <div style={{ marginTop: '4px', textAlign: 'center' }}>
          {events.map((event, index) => (
            <div
              key={index}
              style={{
                backgroundColor: '#3b82f6',
                color: 'white',
                borderRadius: '12px',
                padding: '2px 6px',
                fontSize: '10px',
                marginTop: '2px',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}
              title={event.name + (event.description ? `: ${event.description}` : '')}
            >
              {event.name}
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  // Handle date click
  const handleDateClick = (value: any) => {
    if (value instanceof Date) {
      setDate(value);
      const events = getEventsForDate(value);
      if (events.length === 1 && onEventClick) {
        onEventClick(events[0]);
      }
    }
  };

  // Get events for selected date
  const selectedDateEvents = getEventsForDate(date);

  return (
    <div style={{
      borderTop: '1px solid #ddd',
      padding: '1rem',
      backgroundColor: '#fff'
    }}>
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem'
      }}>
        <Calendar
          onChange={handleDateClick}
          value={date}
          tileContent={tileContent}
          className="deadline-calendar"
        />
      </div>
    </div>
  );
}
