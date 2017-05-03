const { app } = require('electron').remote;

export const DOCUMENTS_PATH = app.getPath('documents');
export const LOCAL_FOLDER = 'AlienRunwayData';
export const LOGS_PATH = `${DOCUMENTS_PATH}/${LOCAL_FOLDER}`;
export const CONFIG_PATH = `${LOGS_PATH}/config.json`;

export const MAX_CONNECT_ATTEMPTS = 5;
