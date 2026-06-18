//Local (uses env block - development)
//pm2 start ecosystem.config.js

//Production (uses env_production block)
//pm2 start ecosystem.config.js --env production

module.exports = {
  apps: [
    {
      name: "indexly-blog",
      script: "server.js",
      node_args: "--max-old-space-size=2048",
      time: true,
      log_date_format: "YYYY-MM-DD HH:mm:ss Z",
      ignore_watch: ["node_modules", ".next"],
      env: {
        NODE_ENV: "development",
        SERVER_PORT: 3002,
      },
      env_production: {
        NODE_ENV: "production",
        SERVER_PORT: 3002,
      },
      watch: process.env.NODE_ENV !== "production",
    },
  ],
};
