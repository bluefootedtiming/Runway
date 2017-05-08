const { app } = require('electron').remote;

export const DOCUMENTS_PATH = app.getPath('documents');
export const LOCAL_FOLDER = 'AlienRunwayData';
export const LOGS_PATH = `${DOCUMENTS_PATH}/${LOCAL_FOLDER}`;
export const CONFIG_PATH = `${LOGS_PATH}/config.json`;
export const APP_HEIGHT = 215;
export const APP_WIDTH = 400;
export const APP_EXTENDED_HEIGHT = 500;

export const MAX_CONNECT_ATTEMPTS = 5;
