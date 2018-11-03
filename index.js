<<<<<<< HEAD
/* eslint no-console: "off" */
=======
>>>>>>> 2e50f519a341d973f8e2328d2086b028b76f4ff7
const app = require('./src/app');
const db = require('./src/models');

const PORT = process.env.PORT || 9999;

db.sequelize
  .authenticate()
  .then(() => {
    console.log('Connection to the database has been established successfully.');
    app.listen(PORT, (err) => {
      if (err) {
        return console.error('Failed', err);
      }
      console.log(`Listening on port ${PORT}`);
      return app;
    });
  })
  .catch(err => console.error('Unable to connect to the database:', err));
