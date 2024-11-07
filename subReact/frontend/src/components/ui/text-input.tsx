import React from "react";

interface TextInputProps {
  id: string;
  type: string;
  label: string;
  value: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const TextInput: React.FC<TextInputProps> = ({
  id,
  type,
  label,
  value,
  onChange,
}) => {
  return (
    <div className="flex flex-col">
      <label
        htmlFor={id}
        className="mb-2 text-sm font-medium text-gray-600 dark:text-gray-300"
      >
        {label}:
      </label>
      <input
        type={type}
        id={id}
        value={value}
        onChange={onChange}
        required
        className="rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 dark:border-white dark:bg-secondary dark:text-white"
      />
    </div>
  );
};

export default TextInput;
