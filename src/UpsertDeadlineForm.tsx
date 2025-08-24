import { useEffect, useState } from "react";

interface DeadlineData {
  name: string;
  date: string;
  description?: string;
}

interface Deadline {
  id: string;
  name: string;
  date: string;
  description?: string;
  highlightId: string;
}

interface UpsertDeadlineFormProps {
  onAdd: (deadlineData: DeadlineData) => void;
  onOpen: () => void;
  onClose: () => void;
  isEditing?: boolean;
  editingDeadline?: Deadline;
  onUpdate?: (deadlineId: string, deadlineData: DeadlineData) => void;
}


export const UpsertDeadlineForm = ({
  onAdd,
  onOpen,
  onClose,
  isEditing = false,
  editingDeadline,
  onUpdate
}: UpsertDeadlineFormProps) => {
  const [name, setName] = useState("");
  const [date, setDate] = useState("");
  const [description, setDescription] = useState("");

  useEffect(() => {
    onOpen();
  }, []);

  useEffect(() => {
    if (isEditing && editingDeadline) {
      setName(editingDeadline.name);
      setDate(editingDeadline.date);
      setDescription(editingDeadline.description || "");
    }
  }, [isEditing, editingDeadline]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const deadlineData = {
      name: name.trim(),
      date,
      description: description.trim() || undefined
    };

    if (isEditing && editingDeadline && onUpdate) {
      onUpdate(editingDeadline.id, deadlineData);
    } else {
      onAdd(deadlineData);
    }

    // Only clear form if not editing
    if (!isEditing) {
      setName("");
      setDate("");
      setDescription("");
    }
  };

  const handleClose = () => {
    setName("");
    setDate("");
    setDescription("");
    onClose();
  };

  return (
    <div style={{
      background: "white",
      borderRadius: "12px",
      padding: "24px",
      boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)",
      border: "1px solid #e1e5e9",
    }}>
      <div style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: "20px"
      }}>
        <h3 style={{
          margin: "0",
          color: "#1a1a1a",
          fontSize: "18px",
          fontWeight: "600",
          flex: 1
        }}>
          {isEditing ? "Edit" : "Add"} Deadline
        </h3>
        <button onClick={handleClose}>x</button>
      </div>

      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: "16px" }}>
          <label style={{
            display: "block",
            marginBottom: "6px",
            color: "#374151",
            fontSize: "14px",
            fontWeight: "500"
          }}>
            Name
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="start typing..."
            style={{
              width: "100%",
              padding: "12px 16px",
              border: "2px solid #e5e7eb",
              borderRadius: "8px",
              fontSize: "14px",
              transition: "border-color 0.2s ease",
              boxSizing: "border-box"
            }}
            onFocus={(e) => e.target.style.borderColor = "#3b82f6"}
            onBlur={(e) => e.target.style.borderColor = "#e5e7eb"}
            required
          />
        </div>

        <div style={{ marginBottom: "16px" }}>
          <label style={{
            display: "block",
            marginBottom: "6px",
            color: "#374151",
            fontSize: "14px",
            fontWeight: "500"
          }}>
            Due Date
          </label>
          <input
            type="datetime-local"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            style={{
              width: "100%",
              padding: "12px 16px",
              border: "2px solid #e5e7eb",
              borderRadius: "8px",
              fontSize: "14px",
              transition: "border-color 0.2s ease",
              boxSizing: "border-box"
            }}
            onFocus={(e) => e.target.style.borderColor = "#3b82f6"}
            onBlur={(e) => e.target.style.borderColor = "#e5e7eb"}
          // required
          />
        </div>

        <div style={{ marginBottom: "20px" }}>
          <label style={{
            display: "block",
            marginBottom: "6px",
            color: "#374151",
            fontSize: "14px",
            fontWeight: "500"
          }}>
            Description (optional)
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="start typing..."
            rows={3}
            style={{
              width: "100%",
              padding: "12px 16px",
              border: "2px solid #e5e7eb",
              borderRadius: "8px",
              fontSize: "14px",
              fontFamily: "inherit",
              resize: "vertical",
              transition: "border-color 0.2s ease",
              boxSizing: "border-box"
            }}
            onFocus={(e) => e.target.style.borderColor = "#3b82f6"}
            onBlur={(e) => e.target.style.borderColor = "#e5e7eb"}
          />
        </div>

        <button
          type="submit"
          style={{
            width: "100%",
            padding: "12px 16px",
            backgroundColor: "#3b82f6",
            color: "white",
            border: "none",
            borderRadius: "8px",
            fontSize: "14px",
            fontWeight: "600",
            cursor: "pointer",
            transition: "background-color 0.2s ease",
            boxSizing: "border-box"
          }}
          onMouseOver={(e) => e.currentTarget.style.backgroundColor = "#2563eb"}
          onMouseOut={(e) => e.currentTarget.style.backgroundColor = "#3b82f6"}
        >
          {isEditing ? "Save" : "Add"}
        </button>
      </form>
    </div>
  );
};
