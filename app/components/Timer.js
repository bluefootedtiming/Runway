import React, { Component } from 'react';
import Input from 'react-debounce-input';
import moment from 'moment';

// import Input from 'react-toolbox/lib/input';
import styles from './Timer.scss';

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
  handleChange = event => {
    const { name } = event.target;
    let { value } = event.target;

    if (['minutes', 'seconds'].includes(name) && value > 59) {
      value = 59;
    }

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
    const inputProps = {
      maxLength: 2,
      debounceTimeout: 500,
      disabled: running,
      onChange: this.handleChange
    };

    const format = n => (n < 10 ? `0${Number(n)}` : n);

    return (
      <div className={styles.container}>
        <div className="clock">
          <Input name="hours" value={format(hours)} {...inputProps} />
          <Input name="minutes" value={format(minutes)} {...inputProps} />
          <Input name="seconds" value={format(seconds)} {...inputProps} />
        </div>

        <button onClick={this.toggleTimer} className={!running && 'running'}>
          {running ? 'Stop' : 'Start'}
        </button>
      </div>
    );
  }
}

export default Timer;
