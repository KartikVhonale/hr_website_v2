import React from 'react';
import '../../css/FormComponents.css';

const TextArea = ({ 
  id,
  value,
  onChange,
  required = false,
  className = '',
  rows = 4
}) => {
  return (
    <textarea
      id={id}
      value={value}
      onChange={onChange}
      required={required}
      className={`text-area ${className}`}
      rows={rows}
    />
  );
};

export default TextArea;
