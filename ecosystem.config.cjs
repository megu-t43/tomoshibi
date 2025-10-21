module.exports = {
  apps: [
    {
      name: 'webapp',
      script: 'npx',
      args: 'vite preview --host 0.0.0.0 --port 3000',
      env: {
        NODE_ENV: 'production',
        PORT: 3000
      },
      watch: false,
      instances: 1,
      exec_mode: 'fork'
    }
  ]
};
