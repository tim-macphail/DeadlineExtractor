import type { IHighlight } from "react-pdf-highlighter";
import type { Deadline } from "./App";

interface DeadlineListProps {
  deadlines: Array<Deadline>;
  highlights: Array<IHighlight>;
  onDeadlineClick?: (deadline: Deadline) => void;
  onDeleteDeadline?: (deadlineId: string) => void;
  onAddDeadline?: () => void;
}

const updateHash = (highlight: IHighlight) => {
  document.location.hash = `highlight-${highlight.id}`;
};

const sortDeadlines = (a: Deadline, b: Deadline) => {
  // Sort by date first (earliest first)
  const dateA = new Date(a.date);
  const dateB = new Date(b.date);
  if (dateA.getTime() !== dateB.getTime()) {
    return dateA.getTime() - dateB.getTime();
  }
  // Tie break by name alphabetically
  return a.name.localeCompare(b.name);
};

const handleDeadlineClick = (
  deadline: Deadline,
  highlights: Array<IHighlight>,
  onDeadlineClick?: (deadline: Deadline) => void
) => {
  const associatedHighlight = highlights.find(h => h.id === deadline.highlightId);
  if (associatedHighlight) {
    updateHash(associatedHighlight);
  }
  if (onDeadlineClick) {
    onDeadlineClick(deadline);
  }
};

export function DeadlineList({
  deadlines,
  highlights,
  onDeadlineClick,
  onDeleteDeadline,
  onAddDeadline,
}: DeadlineListProps) {
  return (
    <ul className="sidebar__highlights" style={{ margin: 0 }}>
      {deadlines.sort(sortDeadlines).map((deadline, index) => {
        const associatedHighlight = highlights.find(h => h.id === deadline.highlightId);
        return (
          <li
            // biome-ignore lint/suspicious/noArrayIndexKey: This is an example app
            key={index}
            className="sidebar__highlight"
            onClick={() => handleDeadlineClick(deadline, highlights, onDeadlineClick)}
            style={{ position: "relative" }}
          >
            <div>
              <strong style={{ fontSize: "1.1em", color: "#333" }}>
                {deadline.name}
              </strong>
              <div style={{
                marginTop: "0.25rem",
                fontSize: "0.9em",
                color: "#666",
                fontWeight: "500"
              }}>
                {new Date(deadline.date).toLocaleDateString()}
              </div>
              {deadline.description ? (
                <blockquote style={{ marginTop: "0.5rem", fontStyle: "italic" }}>
                  {deadline.description}
                </blockquote>
              ) : null}
            </div>
            {associatedHighlight && (
              <div className="highlight__location">
                Page {associatedHighlight.position.pageNumber}
              </div>
            )}
            {onDeleteDeadline && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDeleteDeadline(deadline.id);
                }}
                style={{
                  position: "absolute",
                  top: "0.5rem",
                  right: "0.5rem",
                  background: "none",
                  border: "none",
                  fontSize: "1.2em",
                  cursor: "pointer",
                  color: "#999",
                  padding: "0.2rem 0.4rem",
                  borderRadius: "3px",
                  transition: "all 0.2s ease"
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.backgroundColor = "#ffebee";
                  e.currentTarget.style.color = "#d32f2f";
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.backgroundColor = "transparent";
                  e.currentTarget.style.color = "#999";
                }}
                title="Delete deadline"
              >
                ×
              </button>
            )}
          </li>
        );
      })}
      {onAddDeadline && (
        <li
          className="sidebar__highlight"
          onClick={onAddDeadline}
          style={{
            position: "relative",
            cursor: "pointer",
            border: "2px dashed #007bff",
            backgroundColor: "#f8f9ff",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            minHeight: "60px",
            transition: "all 0.2s ease"
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.backgroundColor = "#e8f2ff";
            e.currentTarget.style.borderColor = "#0056b3";
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.backgroundColor = "#f8f9ff";
            e.currentTarget.style.borderColor = "#007bff";
          }}
          title="Add new deadline"
        >
          <span style={{
            fontSize: "2em",
            color: "#007bff",
            fontWeight: "bold",
            userSelect: "none"
          }}>
            +
          </span>
        </li>
      )}
    </ul>
  );
}
