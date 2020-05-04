const httpProxy = require('express-http-proxy');
const config = require('../config/config');
var microserviceConfig = config.microservice.config;
var model = require('../models/gatewayModel');
const HttpStatus = require('http-status-codes');

const userServiceProxy = httpProxy(microserviceConfig.myservices['user'].url+":"+microserviceConfig.myservices['user'].port );
const userServiceUrl = microserviceConfig.myservices['user'].url+":"+microserviceConfig.myservices['user'].port;

/************* Starting of the class ************/
class Routes {
  constructor(app) {
    this.app = app;
  }

  /* creating app Routes starts */
  appRoutes() {

    this.app.get('/v1.0/users/testapi', async(req, res) => {
      let userServiceCheck  = await model.GetServiceStatus(userServiceUrl).then(result => result);
      if(userServiceCheck.success){  //check whether the user service is running or not
      userServiceProxy(req, res);
      }else{
        res.status(HttpStatus.METHOD_NOT_ALLOWED).json({status:false,message:"user service error"});
      }
    });

    this.app.post('/v1.0/users/register', async(req, res) => {
      let userServiceCheck  = await model.GetServiceStatus(userServiceUrl).then(result => result);
      if(userServiceCheck.success){  //check whether the user service is running or not
      userServiceProxy(req, res);
      }else{
        res.status(HttpStatus.METHOD_NOT_ALLOWED).json({status:false,message:"user service error"});
      }
    });

    this.app.post('/v1.0/users/login', async(req, res) => {
      let userServiceCheck  = await model.GetServiceStatus(userServiceUrl).then(result => result);
      if(userServiceCheck.success){  //check whether the user service is running or not
      userServiceProxy(req, res);
      }else{
        res.status(HttpStatus.METHOD_NOT_ALLOWED).json({status:false,message:"user service error"});
      }
    });

  }/************** end of the class ***********/

  
  routesConfig() {
    this.appRoutes();
  }
}

module.exports = Routes;
