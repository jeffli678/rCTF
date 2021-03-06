const config = {
  ...require('./shared'),
  challengeProvider: {
    name: 'challenges/rdeploy-blob',
    options: {
      rDeployDirectory: '.rdeploy',
      rDeployFiles: 'files',
      updateInterval: 60 * 1000
    }
  },
  uploadProvider: {
    name: 'uploads/local',
    options: {
      uploadDirectory: 'uploads',
      endpoint: '/uploads'
    }
  },
  database: {
    sql: process.env.RCTF_DATABASE_URL || {
      host: process.env.RCTF_DATABASE_HOST,
      port: process.env.RCTF_DATABASE_PORT || 5432,
      username: process.env.RCTF_DATABASE_USERNAME,
      password: process.env.RCTF_DATABASE_PASSWORD,
      database: process.env.RCTF_DATABASE_DATABASE
    },
    redis: process.env.RCTF_REDIS_URL || {
      host: process.env.RCTF_REDIS_HOST,
      port: parseInt(process.env.RCTF_REDIS_PORT) || 6379,
      password: process.env.RCTF_REDIS_PASSWORD,
      database: process.env.RCTF_REDIS_DATABASE
    }
  },
  email: {
    smtpUrl: process.env.RCTF_SMTP_URL,
    from: process.env.RCTF_EMAIL_FROM
  },
  leaderboard: {
    maxLimit: 100,
    maxOffset: 2 ** 32,
    updateInterval: 10 * 1000,
    graphMaxTeams: 10,
    graphSampleTime: 10 * 60 * 1000
  },
  verifyEmail: false,
  removeDownloadHashes: true,
  tokenKey: process.env.RCTF_TOKEN_KEY,
  origin: process.env.RCTF_ORIGIN,
  corsOrigin: process.env.RCTF_CORS_ORIGIN,
  logFile: process.env.RCTF_LOG_FILE,
  ctftimeClientId: process.env.RCTF_CTFTIME_CLIENT_ID,
  ctftimeClientSecret: process.env.RCTF_CTFTIME_CLIENT_SECRET,
  loginTimeout: 10 * 60 * 1000,
  startTime: parseInt(process.env.RCTF_START_TIME) || Date.now() - 24 * 60 * 60 * 1000,
  endTime: parseInt(process.env.RCTF_END_TIME) || Date.now() + 24 * 60 * 60 * 1000
}

module.exports = config
