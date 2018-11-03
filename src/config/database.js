const config = {
  default: {
    username: process.env.DB_USERNAME || 'postgres',
    password: process.env.DB_PASSWORD || 'vixolo',
    dialect: process.env.DB_DIALECT || 'postgres',
    database: process.env.DB_NAME || 'sluck_dev',
    host: process.env.DB_HOST || '127.0.0.1',
    operatorsAliases: false,
    // REAL host: 'charette10.ing.puc.cl'
  },
  development: {
    extend: 'default',
    database: 'sluck_dev',
  },
  test: {
    extend: 'default',
    database: 'sluck_test',
  },
  production: {
    extend: 'default',
    use_env_variable: 'DATABASE_URL',
  },
};

Object.keys(config).forEach((configKey) => {
  const configValue = config[configKey];
  if (configValue.extend) {
    config[configKey] = Object.assign({}, config[configValue.extend], configValue);
  }
});

module.exports = config;
