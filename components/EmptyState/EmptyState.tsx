import './EmptyState.css'

interface EmptyStateProps {
  title: string;
  message: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export default function EmptyState({ title, message, action }: EmptyStateProps) {
  return (
    <div className="empty-state">
      <h2 className="empty-state__title">{title}</h2>
      <p className="empty-state__message">{message}</p>
      {action && (
        <button onClick={action.onClick} className="empty-state__action">
          {action.label}
        </button>
      )}
    </div>
  )
}
