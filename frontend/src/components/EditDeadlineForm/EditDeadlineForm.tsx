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
  const [time, setTime] = useState("");
  const [hasTime, setHasTime] = useState(false);
  const [description, setDescription] = useState("");

  useEffect(() => {
    onOpen();
  }, []);

  useEffect(() => {
    if (editingDeadline) {
      setName(editingDeadline.name);
      const deadlineDate = editingDeadline.date;
      setDescription(editingDeadline.description || "");

      // Check if date includes time (format: YYYY-MM-DDTHH:MM)
      if (deadlineDate.includes('T')) {
        const [datePart, timePart] = deadlineDate.split('T');
        setDate(datePart);
        setTime(timePart);
        setHasTime(true);
      } else {
        setDate(deadlineDate);
        setTime("");
        setHasTime(false);
      }
    }
  }, [editingDeadline]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const finalDate = hasTime && time ? `${date}T${time}` : date;
    const deadlineData = {
      name: name.trim(),
      date: finalDate,
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
    setTime("");
    setHasTime(false);
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
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            style={{ width: "100%" }}
            required
          />
        </div>

        <div>
          <label style={{ display: "flex", alignItems: "center", gap: "0.5em" }}>
            <input
              type="checkbox"
              checked={hasTime}
              onChange={(e) => {
                setHasTime(e.target.checked);
                if (!e.target.checked) {
                  setTime("");
                }
              }}
            />
            Include time
          </label>
          {hasTime && (
            <input
              type="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              style={{ width: "100%", marginTop: "0.5em" }}
              required
            />
          )}
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
