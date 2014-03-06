'use strict';

process.on('message', function(m) {
  if (m.method === 'run') {
    process.send(["HI"]);
  }
});
