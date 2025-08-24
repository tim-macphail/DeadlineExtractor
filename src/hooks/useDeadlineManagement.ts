import { useState } from "react";
import type { IHighlight } from "react-pdf-highlighter";
import type { Deadline, DeadlineData } from "../types";
import { getNextId } from "../utils/helpers";

export const useDeadlineManagement = () => {
  const [deadlines, setDeadlines] = useState<Array<Deadline>>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingDeadline, setEditingDeadline] = useState<Deadline>();
  const [showEditForm, setShowEditForm] = useState(false);

  const addDeadline = (deadlineData: DeadlineData, highlight: IHighlight) => {
    const newDeadline: Deadline = {
      id: getNextId(),
      name: deadlineData.name,
      date: deadlineData.date,
      description: deadlineData.description,
      highlight: highlight,
    };
    setDeadlines((prevDeadlines) => [newDeadline, ...prevDeadlines]);
  };

  const addStandaloneDeadline = (deadlineData: DeadlineData) => {
    const newDeadline: Deadline = {
      id: getNextId(),
      name: deadlineData.name,
      date: deadlineData.date,
      description: deadlineData.description,
      // No highlight for standalone deadlines
    };
    setDeadlines((prevDeadlines) => [newDeadline, ...prevDeadlines]);
    setShowAddForm(false);
    setShowEditForm(false);
  };

  const deleteDeadline = (deadlineId: string) => {
    setDeadlines((prevDeadlines) =>
      prevDeadlines.filter(deadline => deadline.id !== deadlineId)
    );
  };

  const updateDeadline = (deadlineId: string, deadlineData: DeadlineData) => {
    setDeadlines((prevDeadlines) =>
      prevDeadlines.map(deadline => {
        if (deadline.id === deadlineId) {
          const updatedDeadline = { ...deadline, ...deadlineData };

          // If there's a highlight, update its comment
          if (updatedDeadline.highlight) {
            const deadlineText = `${deadlineData.name} - ${new Date(deadlineData.date).toLocaleString()}`;
            updatedDeadline.highlight = {
              ...updatedDeadline.highlight,
              comment: {
                text: deadlineText,
                emoji: "⏰"
              }
            };
          }

          return updatedDeadline;
        }
        return deadline;
      })
    );
  };

  const handleShowEditForm = (show: boolean, deadline?: Deadline) => {
    setShowEditForm(show);
    setEditingDeadline(deadline);
    if (!show) {
      setEditingDeadline(undefined);
    }
  };

  const resetDeadlines = () => {
    setDeadlines([]);
  };

  return {
    deadlines,
    setDeadlines,
    showAddForm,
    setShowAddForm,
    editingDeadline,
    showEditForm,
    addDeadline,
    addStandaloneDeadline,
    deleteDeadline,
    updateDeadline,
    handleShowEditForm,
    resetDeadlines,
  };
};
