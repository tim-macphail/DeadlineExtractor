import { Deadline } from "../../types";
import { PlusButton } from "../PlusButton/PlusButton";
import { DeadlineListItem } from "./DeadlineListItem";

export interface DeadlineListProps {
  deadlines: Array<Deadline>;
  onDeleteDeadline: (deadlineId: string) => void;
  onEditDeadline: (deadline: Deadline) => void;
  onAddStandaloneDeadlineAndEdit: () => void;
}

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
        overflowY: "scroll",
      }}
    >
      <div>
        {deadlines.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '20px' }}>No deadlines</div>
        ) : (
          deadlines.sort(sortDeadlines).map((deadline, index) => (
            <DeadlineListItem
              key={index}
              deadline={deadline}
              onDeleteDeadline={onDeleteDeadline}
              onEditDeadline={onEditDeadline}
            />
          ))
        )}
        <div
          style={{
            borderBottom: "1px solid #ccc",
            // position: "relative",
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
            <PlusButton onClick={onAddStandaloneDeadlineAndEdit} />
          </div>
        </div>
      </div>
    </div>
  );
}
