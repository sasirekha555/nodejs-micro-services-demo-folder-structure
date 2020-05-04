'use strict';

const express = require( 'express');

const routes = require( '../../routes/routes');


let app = express();

new routes(app).routesConfig();


module.exports = app;



