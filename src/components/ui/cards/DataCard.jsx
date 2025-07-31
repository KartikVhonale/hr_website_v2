import React from 'react';
import PropTypes from 'prop-types';
import '../../../css/Card.css';

const DataCard = ({ 
  title,
  children,
  footer,
  actions,
  className = '',
  ...props 
}) => {
  return (
    <div className={`data-card ${className}`} {...props}>
      {title && <div className="card-header">
        <h3>{title}</h3>
      </div>}
      <div className="card-body">
        {children}
      </div>
      {(footer || actions) && <div className="card-footer">
        {footer}
        {actions && <div className="card-actions">
          {actions}
        </div>}
      </div>}
    </div>
  );
};

DataCard.propTypes = {
  title: PropTypes.string,
  children: PropTypes.node.isRequired,
  footer: PropTypes.node,
  actions: PropTypes.node,
  className: PropTypes.string,
};

export default DataCard;
