import React from 'react';
import PropTypes from 'prop-types';
import Button from '../Button';

const EventRow = (props) => (
  <div>
    <input placeholder="Event/Reader Name" defaultValue={props.event} contentEditable={false} />
    <Button onClick={() => props.onClickRemoveEvent(props.event)} style={{ background: 'white', margin: 0 }}>
      <i className="fa fa-minus-circle" />
    </Button>
  </div>
);

EventRow.propTypes = {
  event: PropTypes.string.isRequired,
  onClickRemoveEvent: PropTypes.func.isRequired
};

export default EventRow;
