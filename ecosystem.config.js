module.exports = {
  apps: [
    {
      name: 'medication-ms',
      script: './medication-service/src/main.js',
      watch: './medication-service',
      env: {
        MODE: 'development',
      },
      env_production: {
        MODE: 'production',
      },
    },
  ],
};
