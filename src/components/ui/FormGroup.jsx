import React from 'react';
import '../../css/FormComponents.css';

const FormGroup = ({ 
  label,
  children,
  className = ''
}) => {
  return (
    <div className={`form-group ${className}`}>
      <label htmlFor={children.props.id}>{label}</label>
      {children}
    </div>
  );
};

export default FormGroup;
