import type { IHighlight } from "react-pdf-highlighter";
import type { Deadline } from "./App";
import { DeadlineCalendar } from "./Calendar";

interface Props {
  deadlines: Array<Deadline>;
  highlights: Array<IHighlight>;
  resetHighlights: () => void;
  resetToUpload: () => void;
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

const handleDeadlineClick = (deadline: Deadline, highlights: Array<IHighlight>, onDeadlineClick?: (deadline: Deadline) => void) => {
  const associatedHighlight = highlights.find(h => h.id === deadline.highlightId);
  if (associatedHighlight) {
    updateHash(associatedHighlight);
  }
  if (onDeadlineClick) {
    onDeadlineClick(deadline);
  }
};

export function Sidebar({
  deadlines,
  highlights,
  resetToUpload,
  resetHighlights,
  onDeadlineClick,
}: Props) {
  return (
    <div className="sidebar" style={{
      width: "25vw",
      height: "100vh",
      display: "flex",
      flexDirection: "column",
      overflow: "hidden"
    }}>
      <div className="description" style={{ padding: "1rem", flexShrink: 0 }}>
        <h2 style={{ marginBottom: "1rem" }}>
          Deadline Extractor
        </h2>

        <p>
          <small>
            To create area highlight hold ⌥ Option key (Alt), then click and
            drag.
          </small>
        </p>
      </div>

      <div style={{
        flex: 1,
        overflow: "hidden",
        display: "flex",
        flexDirection: "column"
      }}>
        <div style={{
          flex: 1,
          overflowY: "auto",
          paddingBottom: "1rem"
        }}>
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
        </div>

        <DeadlineCalendar
          deadlines={deadlines}
          onEventClick={(deadline) => handleDeadlineClick(deadline, highlights, onDeadlineClick)}
        />
      </div>

      <div style={{ padding: "1rem", flexShrink: 0 }}>
        {deadlines.length > 0 ? (
          <button
            type="button"
            onClick={resetHighlights}
            style={{
              width: "100%",
              padding: "0.5rem",
              marginBottom: "0.5rem",
              border: "1px solid #ccc",
              borderRadius: "4px",
              backgroundColor: "#f8f9fa",
              cursor: "pointer",
            }}
          >
            Reset deadlines
          </button>
        ) : null}
        <button
          type="button"
          onClick={resetToUpload}
          style={{
            width: "100%",
            padding: "0.5rem",
            border: "1px solid #007bff",
            borderRadius: "4px",
            backgroundColor: "#007bff",
            color: "white",
            cursor: "pointer",
          }}
        >
          Upload New PDF
        </button>
      </div>
    </div>
  );
}
