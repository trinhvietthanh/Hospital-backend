import { Provider } from '@nestjs/common';
import * as dotenv from 'dotenv';
import * as config from 'config';

export const CONFIG = 'ConfigProvider';

export const ConfigProvider: Provider = {
  provide: CONFIG,
  useFactory: () => {
    dotenv.config();
    return config;
  },
};

export const getConfig = () => {
  return config;
};
