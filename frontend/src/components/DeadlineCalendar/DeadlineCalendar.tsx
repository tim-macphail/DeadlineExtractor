
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';

import './DeadlineCalendar.css';
import { Deadline } from '../../types';

// Helper function to truncate text
const truncateText = (text: string, maxLength: number = 15): string => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength - 3) + '...';
};

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
    if (events.length === 0) return null;

    // Show up to 3 events, truncate titles
    const displayEvents = events.slice(0, 3);
    const hasMore = events.length > 3;

    return (
      <div className="calendar-events">
        {displayEvents.map((event, _index) => (
          <div key={event.id} className="calendar-event-item">
            {truncateText(event.name)}
          </div>
        ))}
        {hasMore && (
          <div className="calendar-event-more">
            +{events.length - 3} more
          </div>
        )}
      </div>
    );
  };

  return (
    <div>
      <Calendar
        value={null}
        className="deadline-calendar"
        tileContent={tileContent}
      />
    </div>
  );
}
