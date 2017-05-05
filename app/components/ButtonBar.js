import React from 'react';
import PropTypes from 'prop-types';
import styles from './ButtonBar.scss';

const { oneOfType, string, bool, element, arrayOf } = PropTypes;

export const Button = ({ children, isLeftButton, ...buttonProps }) => (
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

const ButtonBar = (props) => (
  <div className={styles.buttonbar_button_container} >
    <div className={styles.left_buttons}>
      {props.children.map(element => (
        element.props.isLeftButton && element
      ))}
    </div>
    <div>
      {props.children.map(element => (
        !element.props.isLeftButton && element
      ))}
    </div>
  </div>
);

ButtonBar.propTypes = {
  children: arrayOf(element).isRequired
};

export default ButtonBar;
