import net from 'net';
import { bindActionCreators } from 'redux';
import * as CounterActions from '../actions/counter';

export default class RfidRelay {
  store;
  rfidListener: net.Server;
  port: number = 3988;
  runScoreConn: net.Socket;

  constructor(store) {
    this.store = store;
  }

  start() {
    this._startRfidListener(); // eslint-disable-line
    this._connectToRunScore(); // eslint-disable-line
  }

  stop() {
    console.log('Stopping');
    this.rfidListener.close();
    this.runScoreConn.destroy();
  }

  _startRfidListener() {
    this.rfidListener = net.createServer();
    this.rfidListener.on('connection', this.handleConnection);

    this.rfidListener.listen(3988, () => {
      this.store.dispatch(CounterActions.decrement());
      console.log('RFID listener started');
    });
  }

  _connectToRunScore() {
    this.runScore = net.connect({
      host: '192.168.1.4',
      port: 3988
    });

    this.runScore.on('connect', (conn) => {
      console.log('Connected to RunScore');
      this.store.dispatch(CounterActions.decrement());
      this.runScoreConn = conn;
    });

    this.runScore.on('close', () => {
      console.log('Disconnected from RunScore');
      this.runScoreConn = null;
    });
  }

  handleConnection = (conn) => {
    const dispatch = this.store.dispatch;
    const runScore = this.runScore;
    if (!runScore) return;

    conn.setEncoding('utf8');

    conn.on('data', (data) => {
      dispatch(CounterActions.increment());
      runScore.write(data);
    });
  };

}


