import React from 'react';
import '../../css/FormComponents.css';

const TextInput = ({ 
  id, 
  value, 
  onChange, 
  required = false, 
  type = 'text',
  className = ''
}) => {
  return (
    <input
      type={type}
      id={id}
      value={value}
      onChange={onChange}
      required={required}
      className={`text-input ${className}`}
    />
  );
};

export default TextInput;
