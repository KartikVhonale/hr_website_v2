import React from 'react';
import '../../css/FormComponents.css';

const TextInput = ({
  id,
  value,
  onChange,
  required = false,
  type = 'text',
  className = '',
  placeholder,
  onKeyDown,
  list,
  ...otherProps
}) => {
  return (
    <input
      type={type}
      id={id}
      value={value}
      onChange={onChange}
      onKeyDown={onKeyDown}
      required={required}
      placeholder={placeholder}
      list={list}
      className={`text-input ${className}`}
      {...otherProps}
    />
  );
};

export default TextInput;
