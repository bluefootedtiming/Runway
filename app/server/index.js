import net from 'net';

export default class RfidRelay {
  rfidListener: net.Server;
  port: number = 3988;
  runScoreConn: net.Socket;

  constructor() {
    this.rfidListener = net.createServer();
  }

  start() {
    this._startRfidListener(); // eslint-disable-line
    this._connectToRunScore(); // eslint-disable-line
  }

  stop() {
    this.rfidListener.close();
    this.runScoreConn.destroy();
  }

  _startRfidListener() {
    this.rfidListener.on('connection', this.handleConnection);
    this.rfidListener.listen(this.port, () => {
      console.log('RFID listener started');
    });
  }

  _connectToRunScore() {
    const runScore = net.connect({
      host: '192.168.1.4',
      port: 3988
    });

    runScore.on('connect', (conn) => {
      console.log('Connected to RunScore');
      this.runScoreConn = conn;
    });

    runScore.on('close', () => {
      console.log('Disconnected from RunScore');
      this.runScoreConn = null;
    });
  }

  handleConnection(conn) { // eslint-disable-line
    conn.setEncoding('utf8');

    conn.on('data', (data) => {
      console.log('Data: ', data);
      this.runScore.write(data);
    });
  }

}


