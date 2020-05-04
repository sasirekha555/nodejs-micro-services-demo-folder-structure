'use strict';

/**
 * Module dependencies.
 */

const express = require('express');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const helmet = require('helmet');
var path = require('path');
const winston = require('winston');
const logger = require('logops');
const expressLogging = require('express-logging');


const config = require('../config');
var microserviceConfig = config.microservice.config;
var model = require('../../models/gatewayModel');
const routesV1_0 = require('../routes/routes_v1.0');
//import utils from '../../common/utils';

/**
 * Initialize application middleware
 */

function initMiddleware(app) {
    // Showing stack errors
    app.set('showStackError', true);

    // Enable jsonp
    app.enable('jsonp callback');

    

    // Request body parsing middleware should be above methodOverride
    /*app.use(bodyParser.urlencoded({
        extended: true
    }));
    app.use(bodyParser.json());*/
    app.engine('pug', require('pug').__express)
    app.set('views', path.join(__dirname, '../../views'));
    app.set('view engine', 'pug');
    app.use(express.static('static'));
    app.use(bodyParser.json({ limit: '100mb' }));
    app.use(bodyParser.urlencoded({
         limit: '100mb',
         parameterLimit: 100000000,
         extended: true //extended: true
     })); 
    app.use(methodOverride());

    // Add the cookie parser and flash middleware
    app.use(cookieParser());
    //app.use('/',)

    app.use(cors());
    app.use(helmet())
    app.use(express.static('public'));
    app.get('/',function(req,res){
        res.render('index', { title: 'API Gateway Example' });
    });
    // Get JSON Reporting data by report name
    app.get('/getStatus', function(req,res){

        var promises = model.GetStatus(microserviceConfig.services);

        Promise.all(promises).then(function(values){
            for(var i = 0; i < values.length; i++){
                var value = values[i];

                if(value.address && value.port){
                    for(var j = 0; j < microserviceConfig.services.length; j++){

                        if(microserviceConfig.services[j].address == value.address )
                            {
                                value.config = microserviceConfig.services[j];
                            }
                    }
                }
            }
            res.send(values);
        }).catch(function(err){
            res.send(err);		
        });		
    });

    app.post('/getStatusAPI', function(req,res){
        let data = req.body;
       
        model.GetServiceStatus(data.GetStatusurl).then(function(response){
            res.send(response);
        }).catch(function(err){
            res.send(err);		
        });		
    });
    
}



/**
 * Configure the modules server routes
 */
function initModulesRoutes(app) {
    // Globbing routing files
    // config.files.routes.forEach(function (routePath) {
    //   require(path.resolve(routePath))(app);
    // });
    app.use(routesV1_0);

}

/**
 * Configure Cors module to allow specific domains
 */

function handleCors(app) {
//     if(process.env.NODE_ENV == 'local' || process.env.NODE_ENV == 'dev'){
//         app.use(cors())
//     }else{
//     var whitelist = config.cors.list;
//     var corsOptions = {
//     origin: function (origin, callback) {
//         if (whitelist.indexOf(origin) !== -1) {
//         callback(null, true)
//         } else {
//         callback(new Error('Not allowed by CORS'))
//         }
//     }
//     }
//     app.use(cors(corsOptions));
//  }
app.use(cors())
}



/**
 * Initialize the Express application
 */
module.exports = function init(db) {
    // Initialize express app
    let app = express();
    app.use(expressLogging(logger));
    app.enable('trust proxy');

    initMiddleware(app);

    handleCors(app);

    initModulesRoutes(app);

    winston.loggers.add('platform-core', {
        console: config.winston.console,
        file: config.winston.file
    });

    winston.loggers.get('platform-core');

    return app;
}
