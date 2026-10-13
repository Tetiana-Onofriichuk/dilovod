import { join } from 'path';

export const getOporaRootPath = (): string => {
  if (process.env.OPORA_DATA_PATH) {
    return process.env.OPORA_DATA_PATH;
  }

  if (process.env.NODE_ENV !== 'production') {
    return process.cwd();
  }

  const appDataPath = process.env.APPDATA;

  if (!appDataPath) {
    throw new Error('Не вдалося визначити папку APPDATA');
  }

  return join(appDataPath, 'OPORA');
};

export const getDatabasePath = (): string => {
  return join(getOporaRootPath(), 'dilovod.sqlite');
};
