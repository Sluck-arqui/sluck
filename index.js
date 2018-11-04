const app = require('./src/app');
const db = require('./src/models');

const PORT = process.env.PORT || 9999;

app.listen(3000, '127.0.0.1');

