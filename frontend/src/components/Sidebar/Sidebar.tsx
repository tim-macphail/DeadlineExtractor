import { DeadlineList } from "../DeadlineList/DeadlineList";
import { Deadline } from "../../types";

import "./Sidebar.css";

export interface SidebarProps {
  deadlines: Array<Deadline>;
  onDeleteDeadline: (deadlineId: string) => void;
  onEditDeadline: (deadline: Deadline) => void;
  onAddStandaloneDeadlineAndEdit: () => void;
}


export function Sidebar({
  deadlines,
  onDeleteDeadline,
  onEditDeadline,
  onAddStandaloneDeadlineAndEdit,
}: SidebarProps) {
  return (
    <div className="sidebar" style={{
      width: "300px",
      height: "100vh",
      maxHeight: "100vh",
      display: "flex",
      flexDirection: "column",
    }}>
      <div className="sidebar-header">Deadlines</div>
      <div style={{
        flex: 1,
        overflow: 'hidden',
        borderRight: '1px solid #ccc',
      }}>
        <DeadlineList
          deadlines={deadlines}
          onDeleteDeadline={onDeleteDeadline}
          onEditDeadline={onEditDeadline}
          onAddStandaloneDeadlineAndEdit={onAddStandaloneDeadlineAndEdit}
        />
      </div>
    </div>
  );
}
