import { useEffect, useState } from "react";
import { Deadline, DeadlineData } from "../../types";


export interface EditDeadlineFormProps {
  onAdd: (deadlineData: DeadlineData) => void;
  onOpen: () => void;
  onClose: () => void;
  editingDeadline?: Deadline;
  onUpdate?: (deadlineId: string, deadlineData: DeadlineData) => void;
}

export const EditDeadlineForm = ({
  onAdd,
  onOpen,
  onClose,
  editingDeadline,
  onUpdate
}: EditDeadlineFormProps) => {
  const [name, setName] = useState("");
  const [date, setDate] = useState("");
  const [description, setDescription] = useState("");

  useEffect(() => {
    onOpen();
  }, []);

  useEffect(() => {
    if (editingDeadline) {
      setName(editingDeadline.name);
      setDate(editingDeadline.date);
      setDescription(editingDeadline.description || "");
    }
  }, [editingDeadline]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const deadlineData = {
      name: name.trim(),
      date,
      description: description.trim() || undefined
    };

    if (editingDeadline && onUpdate) {
      onUpdate(editingDeadline.id, deadlineData);
    } else {
      onAdd(deadlineData);
    }
  };

  const handleClose = () => {
    setName("");
    setDate("");
    setDescription("");
    onClose();
  };

  return (
    <div
      style={{
        padding: "1em",
        display: "flex",
        flexDirection: "column",
        gap: "1em",
      }}
    >
      <div style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        // backgroundColor: "#6e2121ff",
      }}>
        <div>
          Edit Deadline
        </div>
        <button
          style={{
            background: "none",
            border: "none",
            fontSize: "1.5em",
            cursor: "pointer",
            lineHeight: "1em",
            padding: 0,
            margin: 0,
          }}
          onClick={handleClose}>
          x
        </button>
      </div>

      <form
        style={{ display: "flex", flexDirection: "column", gap: "1em" }}
        onSubmit={handleSubmit}
      >
        <div>
          <label>
            Name
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            style={{ width: "100%" }}
            autoFocus
            required
          />
        </div>

        <div>
          <label>
            Due Date
          </label>
          <input
            type="datetime-local"
            value={date}
            onChange={(e) => {
              console.log(e.target.value);
              setDate(e.target.value);
            }}
            style={{ width: "100%" }}
            required
          />
        </div>

        <div>
          <label>
            Description (optional)
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="start typing..."
            rows={3}
            style={{
              width: "100%",
              resize: "vertical",
              maxHeight: "250px",
              minHeight: "1em"
            }}
          />
        </div>

        <button
          type="submit"
          style={{
            backgroundColor: "#007bff",
            padding: "0.5em 1em",
            color: "white",
            border: "none",
            borderRadius: "0.5em",
            cursor: "pointer",
            fontSize: "1em",
            boxShadow: "0 2px 10px rgba(0, 0, 0, 0.3)",
          }}
        >
          Save
        </button>
      </form>
    </div>
  );
};
