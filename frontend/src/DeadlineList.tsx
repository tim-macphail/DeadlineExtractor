import type { IHighlight } from "react-pdf-highlighter";
import type { Deadline } from "./App";
import { primary, secondary } from "./style/constants";

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
  onDeadlineClick?: (deadline: Deadline) => void
) => {
  const associatedHighlight = deadline.highlight;
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
    <div
      style={{
        backgroundColor: secondary,
        height: "100%",
        overflowY: "auto",
      }}
    >
      <button
        onClick={onShowAddForm}
        style={{ width: "100%" }}
      >
        Add Deadline
      </button>
      <div>
        {deadlines.sort(sortDeadlines).map((deadline, index) => {
          const associatedHighlight = deadline.highlight;
          return (
            <div
              key={index}
              onClick={() => handleDeadlineClick(deadline, onDeadlineClick)}
              style={{
                borderBottom: "1px solid #ccc",
              }}
            >
              <div>
                <div>
                  {deadline.name}
                </div>
                <div>
                  {new Date(deadline.date).toLocaleDateString()}
                </div>
                {deadline.description &&
                  <blockquote>
                    {deadline.description}
                  </blockquote>
                }
              </div>
              {associatedHighlight && (
                <div>
                  Page {associatedHighlight.position.pageNumber}
                </div>
              )}

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onEditDeadline(deadline);
                }}
                title="Edit deadline"
              >
                Edit
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDeleteDeadline(deadline.id);
                }}
                title="Delete deadline"
              >
                Delete
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
