#!/usr/bin/env node

/**
 * Module dependencies.
 */

import app from './express';

/**
 * Normalize a port into a number, string, or false.
 */

function normalizePort(val: string) {
  const portNumber = parseInt(val, 10);

  if (Number.isNaN(portNumber)) {
    // named pipe
    return val;
  }

  if (portNumber >= 0) {
    // portNumber number
    return portNumber;
  }

  return false;
}

/**
 * Get port from environment and store in Express.
 */

const port = normalizePort(process.env.PORT || '3000');
app.set('port', port);

app.listen(port, () => {
  console.log(`server started at http://localhost:${port}`);
});
