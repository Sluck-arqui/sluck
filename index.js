/* eslint no-console: "off" */

const app = require('./src/app');
const db = require('./src/models');

const PORT = process.env.PORT || 9999;

    app.listen(PORT, (err) => {
      if (err) {
        return console.error('Failed', err);
      }
      console.log(`Listening on port ${PORT}`);
      return app;
    });
