import './Textarea.css'

interface TextareaProps {
  id: string;
  name: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  required?: boolean;
  rows?: number;
}

export default function Textarea({
  id,
  name,
  label,
  value,
  onChange,
  placeholder,
  required = false,
  rows = 4,
}: TextareaProps) {
  return (
    <div className="textarea">
      <label htmlFor={id} className="textarea__label">
        {label}
        {required && <span className="textarea__required">*</span>}
      </label>
      <textarea
        id={id}
        name={name}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        required={required}
        rows={rows}
        className="textarea__field"
      />
    </div>
  )
}
