import React from 'react';

const Card = ({ className = '', children, ...props }) => {
  return (
    <div className={`rounded-lg border bg-card text-card-foreground shadow-sm p-6 ${className}`} {...props}>
      {children}
    </div>
  );
};

export default Card;
