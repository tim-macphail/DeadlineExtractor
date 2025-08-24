import type { IHighlight } from "react-pdf-highlighter";
import type { Deadline } from "./App";

interface DeadlineListProps {
  deadlines: Array<Deadline>;
  highlights: Array<IHighlight>;
  onDeadlineClick?: (deadline: Deadline) => void;
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
          </li>
        );
      })}
    </ul>
  );
}
