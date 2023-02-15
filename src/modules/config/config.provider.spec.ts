import { Test, TestingModule } from '@nestjs/testing';
import { CONFIG, ConfigProvider } from './config.provider';
import { IConfig } from 'config';

describe('Config', () => {
  let provider: IConfig;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ConfigProvider],
    }).compile();

    provider = module.get(CONFIG);
  });

  it('should be defined', () => {
    expect(provider).toBeDefined();

    expect(provider.get('server.host')).toBe('127.0.0.1');
    expect(provider.get('server.port')).toBe(8888);
  });
});
