import React, { Component } from 'react';
import moment from 'moment';

class Timer extends Component {
  props: {
    startTimer: () => void,
    stopTimer: () => void,
    running: boolean,
    startTime: number // optional but https://github.com/facebook/flow/issues/1660
  };

  state: {
    hours: number,
    minutes: number,
    seconds: number
  };

  static defaultProps = {
    startTime: 0
  };

  constructor() {
    super();
    this.state = {
      hours: 0,
      minutes: 0,
      seconds: 0
    };
  }

  // Update hours, minutes, or seconds in state
  handleChange = (event) => {
    const { name, value } = event.target;
    this.setState({
      [name]: value
    });
  }

  /**
   * Updates the elapsed time display
   * @memberOf Timer
   */
  updateTime = () => {
    const { startTime } = this.props;
    const elapsed = moment.duration(Date.now() - startTime);

    this.setState({
      hours: elapsed.hours(),
      minutes: elapsed.minutes(),
      seconds: elapsed.seconds()
    });
  }

  toggleTimer = () => {
    const { running, startTimer, stopTimer } = this.props;

    if (running) {
      stopTimer();
      clearInterval(this.interval);
    } else {
      const { hours, minutes, seconds } = this.state;
      const startTime = moment().subtract({ hours, minutes, seconds });

      startTimer(+startTime); // milliseconds since start
      this.interval = setInterval(this.updateTime, 5);
    }
  }

  render() {
    const { running } = this.props;
    const { hours, minutes, seconds } = this.state;

    return (
      <div>
        <input name="hours" onChange={this.handleChange} value={hours} disabled={running} />
        <input name="minutes" onChange={this.handleChange} value={minutes} disabled={running} />
        <input name="seconds" onChange={this.handleChange} value={seconds} disabled={running} />

        <button onClick={this.toggleTimer}>
          {running ? 'Stop' : 'Start'}
        </button>
      </div>
    );
  }
}

export default Timer;
