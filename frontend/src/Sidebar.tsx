import type { IHighlight } from "react-pdf-highlighter";
import type { Deadline } from "./App";
import { DeadlineCalendar } from "./components/DeadlineCalendar/DeadlineCalendar";
import { DeadlineList } from "./DeadlineList";
import { UpsertDeadlineForm } from "./UpsertDeadlineForm";

interface Props {
  deadlines: Array<Deadline>;
  highlights: Array<IHighlight>;
  resetToUpload: () => void;
  onDeadlineClick?: (deadline: Deadline) => void;
  onDeleteDeadline: (deadlineId: string) => void;
  showAddForm?: boolean;
  onShowAddForm?: (show: boolean) => void;
  onAddDeadline?: (deadlineData: { name: string; date: string; description?: string }) => void;
  editingDeadline?: Deadline;
  showEditForm?: boolean;
  onShowEditForm?: (show: boolean, deadline?: Deadline) => void;
  onUpdateDeadline?: (deadlineId: string, deadlineData: { name: string; date: string; description?: string }) => void;
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
  editingDeadline,
  showEditForm,
  onShowEditForm,
  onUpdateDeadline,
}: Props) {
  return (
    <div className="sidebar" style={{
      width: "25vw",
      height: "100vh",
      maxHeight: "100vh",
      display: "flex",
      flexDirection: "column",
    }}>
      <div style={{
        flex: 1,
        overflow: 'hidden',
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
        ) : showEditForm ? (
          <UpsertDeadlineForm
            isEditing={true}
            editingDeadline={editingDeadline}
            onAdd={() => { }} // Not used in edit mode
            onClose={() => onShowEditForm?.(false)}
            onOpen={() => { }}
            onUpdate={(deadlineId, deadlineData) => {
              onUpdateDeadline?.(deadlineId, deadlineData);
              onShowEditForm?.(false);
            }}
          />
        ) : (
          <DeadlineList
            deadlines={deadlines}
            highlights={highlights}
            onDeadlineClick={onDeadlineClick}
            onDeleteDeadline={onDeleteDeadline}
            onShowAddForm={() => onShowAddForm?.(true)}
            onEditDeadline={(deadline) => onShowEditForm?.(true, deadline)}
          />
        )}
      </div>

      <div>
        <DeadlineCalendar
          deadlines={deadlines}
          onEventClick={(deadline) => handleDeadlineClick(deadline, onDeadlineClick)}
        />
      </div>
    </div>
  );
}
