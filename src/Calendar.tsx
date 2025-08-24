import React, { useState } from 'react';
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
      return (
        <div style={{
          position: 'absolute',
          bottom: '2px',
          left: '50%',
          transform: 'translateX(-50%)',
          display: 'flex',
          gap: '2px'
        }}>
          {events.slice(0, 3).map((_, index) => (
            <div
              key={index}
              style={{
                width: '4px',
                height: '4px',
                borderRadius: '50%',
                backgroundColor: '#007bff'
              }}
            />
          ))}
          {events.length > 3 && (
            <span style={{
              fontSize: '10px',
              color: '#007bff',
              fontWeight: 'bold'
            }}>
              +{events.length - 3}
            </span>
          )}
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

        {selectedDateEvents.length > 0 && (
          <div style={{
            maxHeight: '150px',
            overflowY: 'auto',
            border: '1px solid #eee',
            borderRadius: '4px',
            padding: '0.5rem'
          }}>
            <h4 style={{
              margin: '0 0 0.5rem 0',
              fontSize: '14px',
              color: '#333'
            }}>
              Events for {date.toLocaleDateString()}:
            </h4>
            {selectedDateEvents.map((deadline) => (
              <div
                key={deadline.id}
                onClick={() => onEventClick?.(deadline)}
                style={{
                  padding: '0.5rem',
                  marginBottom: '0.5rem',
                  backgroundColor: '#f8f9fa',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  border: '1px solid #dee2e6',
                  fontSize: '12px'
                }}
              >
                <div style={{
                  fontWeight: 'bold',
                  color: '#007bff',
                  marginBottom: '0.25rem'
                }}>
                  {deadline.name}
                </div>
                {deadline.description && (
                  <div style={{
                    color: '#666',
                    fontStyle: 'italic',
                    marginBottom: '0.25rem'
                  }}>
                    {deadline.description}
                  </div>
                )}
                <div style={{
                  color: '#999',
                  fontSize: '11px'
                }}>
                  {new Date(deadline.date).toLocaleTimeString()}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
