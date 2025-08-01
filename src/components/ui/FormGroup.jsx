import React from 'react';
import '../../css/FormComponents.css';

const FormGroup = ({
  label,
  children,
  className = ''
}) => {
  // Safely get the id from children if it exists
  const getChildId = () => {
    if (React.isValidElement(children) && children.props && children.props.id) {
      return children.props.id;
    }
    return undefined;
  };

  return (
    <div className={`form-group ${className}`}>
      <label htmlFor={getChildId()}>{label}</label>
      {children}
    </div>
  );
};

export default FormGroup;
