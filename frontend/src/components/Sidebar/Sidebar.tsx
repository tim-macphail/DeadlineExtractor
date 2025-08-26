import type { IHighlight } from "react-pdf-highlighter";
import { DeadlineCalendar } from "../DeadlineCalendar/DeadlineCalendar";
import { DeadlineList } from "../DeadlineList/DeadlineList";
import { UpsertDeadlineForm } from "../UpsertDeadlineForm/UpsertDeadlineForm";
import { Deadline } from "../../types";

export interface SidebarProps {
  deadlines: Array<Deadline>;
  highlights: Array<IHighlight>;
  resetToUpload: () => void;
  onDeadlineClick?: (deadline: Deadline) => void;
  onDeleteDeadline: (deadlineId: string) => void;
  showAddForm?: boolean;
  onShowAddForm?: (show: boolean) => void;
  onAddDeadline?: (deadlineData: { name: string; date: string; description?: string }) => void;
  onEditDeadline: (deadline: Deadline) => void;
  onAddStandaloneDeadlineAndEdit: () => void;
}

const updateHash = (highlight: IHighlight) => {
  document.location.hash = `highlight-${highlight.id}`;
};

const handleDeadlineClick = (deadline: Deadline, onDeadlineClick?: (deadline: Deadline) => void) => {
  const associatedHighlight = deadline.highlight;
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
      <div style={{
        flex: 1,
        overflow: 'hidden',
        borderRight: '1px solid #ccc',
      }}>
        {showAddForm ? (
          <UpsertDeadlineForm
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
            onEditDeadline={onEditDeadline}
            onAddStandaloneDeadlineAndEdit={onAddStandaloneDeadlineAndEdit}
          />
        )}
      </div>
    </div>
  );
}
