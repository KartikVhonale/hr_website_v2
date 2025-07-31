import React from 'react';
import '../../css/FormComponents.css';

const FormRow = ({ 
  children,
  className = ''
}) => {
  return (
    <div className={`form-row ${className}`}>
      {React.Children.map(children, (child, index) => (
        <div key={index} className="form-row-item">
          {child}
        </div>
      ))}
    </div>
  );
};

export default FormRow;
