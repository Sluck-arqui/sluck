const config = {
  default: {
    username: 'mauricio',
    password: 'Candita5.',
    dialect: process.env.DB_DIALECT || 'postgres',
    database: 'mauriciodb',
    host: process.env.DB_HOST || '127.0.0.1',
    operatorsAliases: false,
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
