const express = require('express');
const server = express();

const api = require('./API/usersAPI')

server.use('/', api);

server.get('/', (req, res) => {
  res.send("Quietly waiting for content...!");
});


const port = process.env.PORT || 4000;
server.listen(port, () => console.log(`\n** Running on port ${port} **\n`));
