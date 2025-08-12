
import React from 'react';
import { FieldDefinition } from '../types';

interface PromptCardProps {
  field: FieldDefinition;
  value: string;
  onChange: (key: string, value: string) => void;
  color: string;
}

const PromptCard: React.FC<PromptCardProps> = ({ field, value, onChange, color }) => {
  const { key, label, placeholder, type = 'text', options } = field;
  const isTextarea = placeholder.length > 50 || type === 'textarea';

  const commonClasses = "w-full bg-transparent text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-0 border-0 p-0";

  const inputElement =
    type === 'select' && options ? (
      <select
        id={key}
        value={value}
        onChange={(e) => onChange(key, e.target.value)}
        className={`${commonClasses} appearance-none cursor-pointer`}
        style={{
          backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%2364748b' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
          backgroundPosition: 'right 0.5rem center',
          backgroundRepeat: 'no-repeat',
          backgroundSize: '1.5em 1.5em',
          paddingRight: '2.5rem',
        }}
      >
        <option value="">{placeholder}</option>
        {options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
      </select>
    ) : isTextarea ? (
      <textarea
        id={key}
        value={value}
        onChange={(e) => onChange(key, e.target.value)}
        placeholder={placeholder}
        className={`${commonClasses} min-h-[60px] resize-y`}
        rows={3}
      />
    ) : (
      <input
        type="text"
        id={key}
        value={value}
        onChange={(e) => onChange(key, e.target.value)}
        placeholder={placeholder}
        className={commonClasses}
      />
    );


  return (
    <div
      className="bg-white/30 backdrop-blur-lg rounded-2xl p-4 shadow-md transition-all duration-300 hover:shadow-xl hover:scale-[1.02]"
      style={{ borderTop: `4px solid ${color}` }}
    >
      <label htmlFor={key} className="block text-sm font-bold text-slate-600 mb-2">
        {label}
      </label>
      {inputElement}
    </div>
  );
};

export default PromptCard;
