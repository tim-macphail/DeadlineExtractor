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
          {showAddForm ? (
            <AddDeadlineForm
              onClose={() => onShowAddForm?.(false)}
              onOpen={() => { }}
              onAdd={(deadlineData) => {
                onAddDeadline?.(deadlineData);
                onShowAddForm?.(false);
              }}
            />
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
