const express = require('express');

const webhooks = require('./webhooks');

const app = express();

const port = process.env.PORT || 3000;
const secret = process.env.HOOK_SECRET;


app.use(express.static('public'));
app.use('/webhooks', webhooks(secret));
app.listen(port, () => console.log(`Listening on port ${port}!`));
