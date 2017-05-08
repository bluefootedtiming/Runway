import React, { Component } from 'react';
import PropTypes from 'prop-types';

import ButtonBar from './ButtonBar';
import Button from './Button';

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

class EditEvents extends Component {
  props: {
    onClickConfig: () => void,
    addEvent: () => void,
    delEvent: () => void,
    events: Array<string>
  }

  static defaultProps: {
    events: []
  }

  state: {
    newEvent: string
  }

  constructor() {
    super();
    this.state = {
      newEvent: ''
    };
  }

  handleChangeNewEvent = (c) => {
    this.setState({ newEvent: c.target.value });
  }

  handleAddEvent = () => {
    if (this.state.newEvent) {
      this.props.addEvent(this.state.newEvent);
      this.setState({ newEvent: '' });
    }
  }

  handleRemoveEvent = (event) => {
    this.props.delEvent(event);
  }

  render() {
    return (
      <section>
        <h1>Edit Events</h1>
        <div>
          <input placeholder="Event/Reader Name" onChange={(c) => this.handleChangeNewEvent(c)} value={this.state.newEvent} />
          <Button onClick={this.handleAddEvent} style={{ margin: 0 }}>
            {/*<i className="fa fa-plus-circle" />*/}
            Add Event
          </Button>
        </div>
        <br />
        {this.props.events.map((event) => (
          <EventRow key={`${event}`} event={event} onClickRemoveEvent={this.handleRemoveEvent} />
        ))}
        <ButtonBar>
          {/* TODO: Currently isn't an elegant solution to this
            besides abstracting the save function*/}
          {/*
          <Button onClick={this.props.onClickConfig}>
            Save
          </Button>
          */}
          <Button onClick={this.props.onClickConfig} isLeftButton>
            Back to Config
          </Button>
        </ButtonBar>
      </section>
    );
  }
}

export default EditEvents;
