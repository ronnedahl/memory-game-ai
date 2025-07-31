import { cleanEnv, str, port, num } from 'envalid';

export const env = cleanEnv(process.env, {
  NODE_ENV: str({ choices: ['development', 'production', 'test'] }),
  PORT: port({ default: 3001 }),
  CORS_ORIGIN: str({ default: 'https://memory-game.peterbot.dev' }), // Ändrat från localhost
  GEMINI_API_KEY: str(),
  RATE_LIMIT_WINDOW_MS: num({ default: 900000 }),
  RATE_LIMIT_MAX_REQUESTS: num({ default: 100 }),
  LOG_LEVEL: str({
    default: 'info',
    choices: ['error', 'warn', 'info', 'debug']
  }),
});