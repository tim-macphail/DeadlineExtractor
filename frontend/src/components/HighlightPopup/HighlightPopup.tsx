interface HighlightPopupProps {
  comment: { text: string; emoji: string };
}

export const HighlightPopup = ({ comment }: HighlightPopupProps) =>
  comment.text ? (
    <div className="Highlight__popup">
      {comment.emoji} {comment.text}
    </div>
  ) : null;
