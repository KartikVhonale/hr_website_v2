import React from 'react';
import '../../css/FormComponents.css';

const SelectInput = ({ 
  id,
  value,
  onChange,
  required = false,
  options = [],
  className = ''
}) => {
  return (
    <select 
      id={id}
      value={value}
      onChange={onChange}
      required={required}
      className={`select-input ${className}`}
    >
      {options.map((option, index) => (
        <option key={`${option}-${index}`} value={option}>
          {option}
        </option>
      ))}
    </select>
  );
};

export default SelectInput;
