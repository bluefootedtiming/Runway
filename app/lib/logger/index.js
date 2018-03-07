import path from 'path';
import moment from 'moment';
import jetpack from 'fs-jetpack';
import { addMessage } from '../../actions/status';

const { app } = require('electron').remote;

class Log {
  store: null
  dataFolder: ''
  debugFileName: ''
  configFileName: ''

  constructor() {
    this.dataFolder = 'RunwayData';
    this.configFileName = 'config.json';
    this.debugFileName = 'debug.log';
  }

  dataPath() { return path.join(app.getPath('documents'), this.dataFolder); }

  debugPath() { return path.join(this.dataPath(), this.debugFileName); }

  configPath() { return path.join(this.dataPath(), this.configFileName); }

  file(messages: string | Array<string>, fileName: string | Array<string> = '') {
    const msg = Array.isArray(messages) ? messages.join('') : messages;
    switch (fileName) {
      case 'config':
        this.toConfig(msg);
        break;
      case 'debug':
        this.toDebug(msg);
        break;
      default:
        this.toFilename(msg, fileName);
    }
  }

  toFilename(msg: string, fileName: string | Array<string>) {
    jetpack.appendAsync(path.join(this.dataPath(), fileName), `${msg}\r`);
  }

  toDebug(msg: string) {
    jetpack.appendAsync(this.debugPath(), `[${moment()}]: ${msg}\r`);
  }

  toConfig(msg: string) {
    jetpack.write(path.join(this.configPath()), `${msg}\r`);
  }

  info(...messages: string | Array<string>) {
    this.write(0, messages);
  }

  hexInfo(...messages: string | Array<string>) {
    this.write(0, messages);
  }

  error(...messages: string | Array<string>) {
    this.write(1, messages);
  }

  write(code: number, messages: string | Array<string>) {
    if (Array.isArray(messages)) {
      this.store.dispatch(addMessage(messages.join(), code));
    } else {
      this.store.dispatch(addMessage(messages, code));
    }
  }
}

const log = new Log();
export default log;
