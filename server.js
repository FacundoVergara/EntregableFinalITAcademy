var fs = require('fs');

// file is included here:
eval(fs.readFileSync('api.js')+'');
eval(fs.readFileSync('front.js')+'');