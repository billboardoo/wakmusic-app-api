module.exports = {
  apps: [
    {
      name: 'wakmusic-app',
      script: './dist/main.js',
      exec_mode: 'cluster',
      instances: '2',
      wait_ready: true,
      listen_timeout: 50000,
      kill_timeout: 5000,
    },
  ],
};
