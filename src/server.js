const express = require('express');
const routes = require('./routes');

const app = espress();
const PORT = process.env.PORT || 3000;

app.use(express.json)());

// routes mounted at root
app.use('/', routes);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
