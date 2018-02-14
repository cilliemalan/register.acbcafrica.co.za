const express = require('express');

const webhooks = require('./webhooks');

const app = express();

const port = process.env.PORT || 3000;


app.use(express.static('public'));
app.use(/\/webhooks\//, webhooks());
app.listen(port, () => console.log(`Listening on port ${port}!`));
