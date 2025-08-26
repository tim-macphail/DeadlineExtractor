import type { IHighlight } from "react-pdf-highlighter";
import { Deadline } from "../../types";
import TrashIcon from "../../icons/Trash";

export interface DeadlineListProps {
  deadlines: Array<Deadline>;
  onDeleteDeadline: (deadlineId: string) => void;
  onEditDeadline: (deadline: Deadline) => void;
  onAddStandaloneDeadlineAndEdit: () => void;
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


export function DeadlineList({
  deadlines,
  onDeleteDeadline,
  onEditDeadline,
  onAddStandaloneDeadlineAndEdit,
}: DeadlineListProps) {
  return (
    <div
      style={{
        height: "100%",
        overflowY: "auto",
      }}
    >
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
                cursor: "pointer",
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
                        title="View source"
                        onMouseOver={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = "#007bff"; }}
                        onMouseOut={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = "inherit"; }}
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
                    title="Delete"
                    style={{
                      position: "absolute",
                      top: "8px",
                      right: "8px",
                      border: "none",
                      background: "none",
                      cursor: "pointer",
                      borderRadius: "4px",
                    }}
                    onMouseOver={(e) => { (e.currentTarget as HTMLButtonElement).style.backgroundColor = "#acacacff"; }}
                    onMouseOut={(e) => { (e.currentTarget as HTMLButtonElement).style.backgroundColor = "transparent"; }}
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
        <div
          style={{
            borderBottom: "1px solid #ccc",
            position: "relative",
          }}
          // darken when hovered
          onMouseOver={(e) => { (e.currentTarget as HTMLDivElement).style.backgroundColor = "#dddbdbff"; }}
          onMouseOut={(e) => { (e.currentTarget as HTMLDivElement).style.backgroundColor = "transparent"; }}
        >
          <div style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}>
            <button
              onClick={onAddStandaloneDeadlineAndEdit}
              style={{
                borderRadius: "50%",
                width: "40px",
                height: "40px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: "#007bff",
                border: "none",
                color: "white",
                fontSize: "24px",
                cursor: "pointer",
                margin: "16px",
                boxShadow: "0 2px 6px black",
              }}
            >
              +
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
