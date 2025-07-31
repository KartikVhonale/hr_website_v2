import React from 'react';
import PropTypes from 'prop-types';
import '../../css/Card.css';

const Card = ({ title, children, className, onClick }) => {
  return (
    <div className={`card ${className || ''}`} onClick={onClick}>
      {title && <h3 className="card-title">{title}</h3>}
      <div className="card-content">
        {children}
      </div>
    </div>
  );
};

Card.propTypes = {
  title: PropTypes.string,
  children: PropTypes.node,
  className: PropTypes.string,
  onClick: PropTypes.func
};

Card.defaultProps = {
  title: '',
  className: '',
  onClick: null
};

export default Card;
