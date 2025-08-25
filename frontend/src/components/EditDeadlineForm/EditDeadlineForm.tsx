import { useEffect, useState } from "react";
import { Deadline, DeadlineData } from "../../types";
import { secondary } from "../../style/constants";


export interface EditDeadlineFormProps {
  onOpen: () => void;
  onClose: () => void;
  editingDeadline: Deadline;
  onSave: (deadlineId: string, deadlineData: DeadlineData) => void;
}

export const EditDeadlineForm = ({
  onOpen,
  onClose,
  editingDeadline,
  onSave
}: EditDeadlineFormProps) => {
  const [name, setName] = useState("");
  const [date, setDate] = useState("");
  const [description, setDescription] = useState("");

  useEffect(() => {
    onOpen();
  }, []);

  useEffect(() => {
    setName(editingDeadline.name);
    setDate(editingDeadline.date);
    setDescription(editingDeadline.description || "");
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const deadlineData = {
      name: name.trim(),
      date,
      description: description.trim() || undefined
    };


    console.log("Saving edited deadline:", editingDeadline.id, deadlineData);
    
    onSave(editingDeadline.id, deadlineData);
  };

  const handleClose = () => {
    setName("");
    setDate("");
    setDescription("");
    onClose();
  };

  return (
    <div style={{ backgroundColor: secondary }}>
      <div style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: "20px"
      }}>
        <h3>
          Edit Deadline
        </h3>
        <button onClick={handleClose}>x</button>
      </div>

      <form onSubmit={handleSubmit}>
        <div>
          <label>
            Name
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            style={{ width: "100%" }}
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
            onChange={(e) => setDate(e.target.value)}
            style={{ width: "100%" }}
            // required
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
          style={{ width: "100%" }}
        >
          Save
        </button>
      </form>
    </div>
  );
};
