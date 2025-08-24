import type { IHighlight } from "react-pdf-highlighter";
import type { Deadline } from "./App";
import { DeadlineCalendar } from "./Calendar";
import { DeadlineList } from "./DeadlineList";
import { AddDeadlineForm } from "./AddDeadlineForm";

interface Props {
  deadlines: Array<Deadline>;
  highlights: Array<IHighlight>;
  resetToUpload: () => void;
  onDeadlineClick?: (deadline: Deadline) => void;
  onDeleteDeadline?: (deadlineId: string) => void;
  showAddForm?: boolean;
  onShowAddForm?: (show: boolean) => void;
  onAddDeadline?: (deadlineData: { name: string; date: string; description?: string }) => void;
}

const updateHash = (highlight: IHighlight) => {
  document.location.hash = `highlight-${highlight.id}`;
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
  onDeadlineClick,
  onDeleteDeadline,
  showAddForm,
  onShowAddForm,
  onAddDeadline,
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
          {!showAddForm && (
            <div style={{ padding: "1rem", paddingBottom: "0.5rem" }}>
              <button
                onClick={() => onShowAddForm?.(true)}
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
          )}
          {showAddForm ? (
            <div style={{ padding: "1rem" }}>
              <div style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "1rem"
              }}>
                <h3 style={{ margin: 0, color: "#1a1a1a" }}>Add New Deadline</h3>
                <button
                  onClick={() => onShowAddForm?.(false)}
                  style={{
                    background: "none",
                    border: "none",
                    fontSize: "1.5em",
                    cursor: "pointer",
                    color: "#666",
                    padding: "0.2rem 0.5rem",
                    borderRadius: "4px",
                    transition: "all 0.2s ease"
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.backgroundColor = "#f0f0f0";
                    e.currentTarget.style.color = "#333";
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.backgroundColor = "transparent";
                    e.currentTarget.style.color = "#666";
                  }}
                  title="Cancel"
                >
                  ×
                </button>
              </div>
              <AddDeadlineForm
                onOpen={() => {}}
                onAdd={(deadlineData) => {
                  onAddDeadline?.(deadlineData);
                  onShowAddForm?.(false);
                }}
              />
            </div>
          ) : (
            <DeadlineList
              deadlines={deadlines}
              highlights={highlights}
              onDeadlineClick={onDeadlineClick}
              onDeleteDeadline={onDeleteDeadline}
              onShowAddForm={() => onShowAddForm?.(true)}
            />
          )}
        </div>

        <DeadlineCalendar
          deadlines={deadlines}
          onEventClick={(deadline) => handleDeadlineClick(deadline, highlights, onDeadlineClick)}
        />
      </div>

      <div style={{ padding: "1rem", flexShrink: 0 }}>
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
