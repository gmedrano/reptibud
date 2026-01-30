import './Input.css'

interface InputProps {
  id: string;
  name: string;
  type?: 'text' | 'email' | 'password';
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  required?: boolean;
  error?: string;
}

export default function Input({
  id,
  name,
  type = 'text',
  label,
  value,
  onChange,
  placeholder,
  required = false,
  error,
}: InputProps) {
  return (
    <div className="input">
      <label htmlFor={id} className="input__label">
        {label}
        {required && <span className="input__required">*</span>}
      </label>
      <input
        id={id}
        name={name}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        required={required}
        className={`input__field ${error ? 'input__field--error' : ''}`}
      />
      {error && <span className="input__error">{error}</span>}
    </div>
  )
}
