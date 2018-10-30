/* eslint no-console: "off" */

const app = require('./src/app');
const db = require('./src/models');

const PORT = process.env.PORT || 9999;

<<<<<<< HEAD
app.listen(PORT, (err) => {
  if (err) {
    return console.error('Failed', err);
  }
  console.log(`Listening on port ${PORT}`);
  return app;
});
=======
    app.listen(PORT, (err) => {
      if (err) {
        return console.error('Failed', err);
      }
      console.log(`Listening on port ${PORT}`);
      return app;
    });
>>>>>>> ec08d5a8fb12b57d5d6105a6b52513d9cce4e924
