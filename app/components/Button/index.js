import React from 'react';
import PropTypes from 'prop-types';

const { oneOfType, string, bool, element } = PropTypes;

const Button = ({ children, isLeftButton, ...buttonProps }) => (
  <button {...buttonProps} > {children} </button>
);

Button.defaultProps = {
  isLeftButton: false,
  children: null
};

Button.propTypes = {
  isLeftButton: bool,
  children: oneOfType([string, element])
};

export default Button;
