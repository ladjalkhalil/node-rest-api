const express = require("express");
const app = express ();


app.get('/status', (request, response) => {
  const status = {
     'Status': 'Running'
  };
  
  response.send(status);
});