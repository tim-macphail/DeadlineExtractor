import { useState } from "react";
import type { IHighlight, ScaledPosition } from "react-pdf-highlighter";
import type { Deadline, DeadlineData } from "../types";
import { getNextId } from "../utils/helpers";

export const useDeadlineHighlightManagement = () => {
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

  const updateHighlight = (
    highlightId: string,
    position: Partial<ScaledPosition>,
    content: Partial<{ text?: string; image?: string }>,
  ) => {
    console.log("Updating highlight", highlightId, position, content);
    setDeadlines((prevDeadlines) =>
      prevDeadlines.map((deadline) => {
        if (deadline.highlight?.id === highlightId) {
          const updatedHighlight = {
            ...deadline.highlight,
            position: { ...deadline.highlight.position, ...position },
            content: { ...deadline.highlight.content, ...content },
          };
          return { ...deadline, highlight: updatedHighlight };
        }
        return deadline;
      }),
    );
  };

  const handleShowEditForm = (show: boolean, deadline?: Deadline) => {
    setShowEditForm(show);
    setEditingDeadline(deadline);
    if (!show) {
      setEditingDeadline(undefined);
    }
  };

  const addDeadlineWithHighlightAndEdit = (
    position: ScaledPosition,
    content: { text?: string; image?: string },
    onOpenEditModal: (deadline: Deadline) => void
  ) => {
    // Create highlight first
    const newHighlightId = getNextId();
    const newHighlight: IHighlight = {
      id: newHighlightId,
      content,
      position,
      comment: {
        text: "New deadline",
        emoji: "⏰"
      }
    };

    // Create deadline with default name
    const newDeadline: Deadline = {
      id: getNextId(),
      name: "New Deadline",
      date: "",
      description: "",
      highlight: newHighlight,
    };

    // Add to deadlines list
    setDeadlines((prevDeadlines) => [newDeadline, ...prevDeadlines]);

    // Open edit modal immediately
    onOpenEditModal(newDeadline);
  };

  const addStandaloneDeadlineAndEdit = (onOpenEditModal: (deadline: Deadline) => void) => {
    // Create standalone deadline with default name (no highlight)
    const newDeadline: Deadline = {
      id: getNextId(),
      name: "New Deadline",
      date: "",
      description: "",
      // No highlight for standalone deadlines
    };

    // Add to deadlines list
    setDeadlines((prevDeadlines) => [newDeadline, ...prevDeadlines]);

    // Open edit modal immediately
    onOpenEditModal(newDeadline);
  };

  const resetDeadlines = () => {
    setDeadlines([]);
  };

  // Compute highlights array from deadlines for PdfHighlighter
  const highlights = deadlines
    .filter(deadline => deadline.highlight)
    .map(deadline => deadline.highlight!);

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
    updateHighlight,
    handleShowEditForm,
    addDeadlineWithHighlightAndEdit,
    addStandaloneDeadlineAndEdit,
    resetDeadlines,
    highlights,
  };
};
