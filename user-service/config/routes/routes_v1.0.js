'use strict';

const express = require( 'express');

const users = require( '../../handlers/routes');


let app = express();

new users(app).routesConfig();

module.exports = app;



