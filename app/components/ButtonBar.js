import React from 'react';
import PropTypes from 'prop-types';

import styles from './ButtonBar.scss';

const { node } = PropTypes;

const ButtonBar = (props) => {
  const children = props.children.length ? props.children : [props.children];

  return (
    <div className={styles.buttonbar_button_container} >
      <div className={styles.left_buttons}>
        {children.map(e => (
          e.props.isLeftButton && e
        ))}
      </div>
      <div>
        {children.map(e => (
          !e.props.isLeftButton && e
        ))}
      </div>
    </div>
  );
};

ButtonBar.propTypes = {
  children: node.isRequired
};

export default ButtonBar;
