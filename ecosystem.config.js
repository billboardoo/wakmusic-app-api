module.exports = {
  apps: [
    {
      name: 'wakmusic-app',
      script: './dist/src/main.js',
      exec_mode: 'fork',
      wait_ready: true,
      listen_timeout: 50000,
      kill_timeout: 5000,
    },
  ],
};
