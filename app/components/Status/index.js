import React, { Component } from 'react';
import PropTypes from 'prop-types';

import styles from './Status.scss';

class Status extends Component {
  props: {
    messages: Array<string>
  }

  static defaultProps: {
    messages: []
  }

  componentDidMount() {
    this.scrollToBottom();
  }

  componentWillReceiveProps() {
    this.scrollToBottom();
  }

  scrollToBottom = () => {
    const textarea = document.getElementById('status');
    textarea.scrollTop = textarea.scrollHeight;
  }

  render() {
    const { messages } = this.props;
    const textareaProps = {
      rows: messages.length,
      value: messages.join('\n'),
      readOnly: true
    };

    return (
      <div className={styles.status_container}>
        <textarea id="status" {...textareaProps} />
      </div>
    );
  }
}

Status.propTypes = {
  messages: PropTypes.arrayOf(
    PropTypes.string
  ).isRequired
};

export default Status;
