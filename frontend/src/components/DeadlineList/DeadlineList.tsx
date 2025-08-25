import type { IHighlight } from "react-pdf-highlighter";
import { Deadline } from "../../types";
import TrashIcon from "../../icons/Trash";

export interface DeadlineListProps {
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
              style={{
                borderBottom: "1px solid #ccc",
                position: "relative",
                padding: "8px",
              }}
              onClick={(e) => {
                e.stopPropagation();
                onEditDeadline(deadline);
              }}
              // darken when hovered
              onMouseOver={(e) => { (e.currentTarget as HTMLDivElement).style.backgroundColor = "#dddbdbff"; }}
              onMouseOut={(e) => { (e.currentTarget as HTMLDivElement).style.backgroundColor = "transparent"; }}
            >
              <div>
                <div>
                  <strong>
                    {deadline.name}
                  </strong>
                  {associatedHighlight && (
                    <>
                      &nbsp;(<a onClick={(e) => {
                        e.stopPropagation();
                        updateHash(associatedHighlight);
                      }}
                        href={`#highlight-${associatedHighlight.id}`}
                        style={{ textDecoration: "underline", color: "inherit", cursor: "pointer" }}
                      >
                        page {associatedHighlight.position.pageNumber}
                      </a>)
                    </>
                  )}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteDeadline(deadline.id);
                    }}
                    title="Delete deadline"
                    style={{
                      position: "absolute",
                      top: "8px",
                      right: "8px",
                      border: "none",
                      background: "none",
                      cursor: "pointer",
                    }}
                  >
                    <TrashIcon />
                  </button>
                </div>
                <div>
                  {new Date(deadline.date).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </div>
                <div style={{
                  height: "1.5em",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  marginTop: "4px",
                  color: "#555",
                }}>
                  {deadline.description}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
