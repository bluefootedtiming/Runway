import React from 'react';
import PropTypes from 'prop-types';

import styles from './ButtonBar.scss';

const { element, arrayOf } = PropTypes;

const ButtonBar = (props) => (
  <div className={styles.buttonbar_button_container} >
    <div className={styles.left_buttons}>
      {props.children.map(e => (
        e.props.isLeftButton && e
      ))}
    </div>
    <div>
      {props.children.map(e => (
        !e.props.isLeftButton && e
      ))}
    </div>
  </div>
);

ButtonBar.propTypes = {
  children: arrayOf(element).isRequired
};

export default ButtonBar;
