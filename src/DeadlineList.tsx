import type { IHighlight } from "react-pdf-highlighter";
import type { Deadline } from "./App";

interface DeadlineListProps {
  deadlines: Array<Deadline>;
  highlights: Array<IHighlight>;
  onDeadlineClick?: (deadline: Deadline) => void;
  onDeleteDeadline: (deadlineId: string) => void;
  onShowAddForm?: () => void;
  onEditDeadline: (deadline: Deadline) => void;
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
  onShowAddForm,
  onEditDeadline,
}: DeadlineListProps) {
  return (
    <ul className="sidebar__highlights" style={{ margin: 0 }}>
      <li>
        <div style={{ padding: "1rem", paddingBottom: "0.5rem" }}>
          <button
            onClick={onShowAddForm}
            style={{
              width: "100%",
              padding: "0.75rem 1rem",
              backgroundColor: "#007bff",
              color: "white",
              border: "none",
              borderRadius: "6px",
              fontSize: "14px",
              fontWeight: "600",
              cursor: "pointer",
              transition: "background-color 0.2s ease",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "0.5rem"
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.backgroundColor = "#0056b3";
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.backgroundColor = "#007bff";
            }}
          >
            <span style={{ fontSize: "1.2em" }}>+</span>
            Add Deadline
          </button>
        </div>
      </li>
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

            <button
              onClick={(e) => {
                e.stopPropagation();
                onEditDeadline(deadline);
              }}
              style={{
                position: "absolute",
                top: "0.5rem",
                right: "2.5rem",
                background: "none",
                border: "none",
                fontSize: "1.1em",
                cursor: "pointer",
                color: "#666",
                padding: "0.2rem 0.4rem",
                borderRadius: "3px",
                transition: "all 0.2s ease"
              }}
              title="Edit deadline"
            >
              ✏️
            </button>
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
                🗑
              </button>
          </li>
        );
      })}

    </ul>
  );
}
