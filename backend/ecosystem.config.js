module.exports = {
  apps: [{
    name: 'memory-game-backend',
    script: './dist/index.js', 
    instances: 1,
    exec_mode: 'fork',
    cwd: '/var/www/memory-game/backend',
    watch: false,
    max_memory_restart: '1G',
    error_file: './logs/err.log',
    out_file: './logs/out.log',
    log_file: './logs/combined.log',
    time: true,
    
    env: {
      NODE_ENV: 'production',
      PORT: 3001,
      CORS_ORIGIN: 'https://memory-game.peterbot.dev',
     
      RATE_LIMIT_WINDOW_MS: 900000,
      RATE_LIMIT_MAX_REQUESTS: 100,
      LOG_LEVEL: 'info'
     
    }
  }]
};