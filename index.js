const express = require('express');
require('dotenv').config();

const app = express();

require('./startup/routes')(app);

require('./startup/schedulers');

const port = process.env.BORROW_SERVICE_PORT || 5000;
app.listen(port, () => {
    console.log(`Listening on port ${port}...`);
});
