var express = require('express');
var fs = require('fs');
var app = express();
app.use(express.static('public'));

app.listen(3000);