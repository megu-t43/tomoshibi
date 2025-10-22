module.exports = {
  apps: [
    {
      name: 'tomoshibi-dashboard',
      script: 'python3',
      args: '-m http.server 3000 --bind 0.0.0.0 --directory /home/user/tomoshibi-dashboard/dist',
      cwd: '/home/user/tomoshibi-dashboard/dist',
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
