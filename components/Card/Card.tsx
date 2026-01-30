import './Card.css'

interface CardProps {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
}

export default function Card({ children, onClick, className = '' }: CardProps) {
  const cardClassName = `card ${className}`.trim()
  
  if (onClick) {
    return (
      <button onClick={onClick} className={`${cardClassName} card--clickable`}>
        {children}
      </button>
    )
  }

  return <div className={cardClassName}>{children}</div>
}
