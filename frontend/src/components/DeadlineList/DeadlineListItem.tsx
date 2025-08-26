import { Deadline } from "../../types";
import TrashIcon from "../../icons/Trash";

export interface DeadlineListItemProps {
  deadline: Deadline;
  onDeleteDeadline: (deadlineId: string) => void;
  onEditDeadline: (deadline: Deadline) => void;
}

export function DeadlineListItem({
  deadline,
  onDeleteDeadline,
  onEditDeadline,
}: DeadlineListItemProps) {
  return (
    <div
      style={{
        borderBottom: "1px solid #ccc",
        position: "relative",
        padding: "8px",
        cursor: "pointer",
        // shadow on bottom
        boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
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
          {deadline.highlight && (
            <>
              &nbsp;(<a onClick={(e) => {
                e.stopPropagation();
              }}
                href={`#highlight-${deadline.highlight.id}`}
                style={{ textDecoration: "underline", color: "inherit", cursor: "pointer" }}
                title="View source"
                onMouseOver={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = "#007bff"; }}
                onMouseOut={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = "inherit"; }}
              >
                page {deadline.highlight.position.pageNumber}
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
}
