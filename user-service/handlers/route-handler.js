const serviceHandler = require('./service-handler');
const HttpStatus = require('http-status-codes');
const utils = require('../common/utils');
const mails = require('../common/mails');
const bcrypt = require('bcryptjs');
var salt = bcrypt.genSaltSync(10);
const mongoose = require('mongoose');
const objectId = mongoose.Types.ObjectId;
const moment = require("moment");
const config = require('../config/config');


/*
 Version : 1.0 
 author : Sasi rekha
*/


class RouteHandler {

// Register - Start
registerUser(req, res) {

    req.assert('email', 'Email is required').notEmpty();
    req.assert('email', 'Incorrect email format').isEmail();
  
    req.assert('phone', 'Phone number is required').notEmpty();
    req.assert('phone', 'Invalid Phone number').isNumeric();
    req.assert('phone', 'Invalid Phone number').isLength({ min: 10, max: 12});
  
    req.assert('username', 'Username is required').notEmpty();
    req.assert('username', 'Invalid Username').isLength({ min: 6, max: 30});
  
  
    var errors = req.validationErrors();
    if(!errors){
    let data = req.body;
    serviceHandler.findUserEmail(data.email)
    .then((response)=>{
      if(!response) {
        
        let request_payload = {
          email : data.email,
          phone : data.phone,
          username : data.username,
          password : "gmadmin"
        }
        return serviceHandler.createUser(request_payload);
      } else {
        throw{
          reason:"exists"
        }
      }
    })
    .then((response)=>{
      if(!response) {
        throw{
          reason:"failed"
        }
        
      } else {
        res.status(HttpStatus.CREATED).json({success: true, msg: 'User registered'});
      }
    })
    .catch((err)=>{
      if(err.reason == "exists"){
        return res.status(HttpStatus.UNAUTHORIZED).json({success: false, msg: 'Emailid already exists!'});
      }else if(err.reason == "failed"){
        res.status(HttpStatus.BAD_REQUEST).json({success: false, msg: 'Failed to register user',error:err});
      }else if (err.name === 'MongoError' && err.code === 11000){
        return res.status(HttpStatus.METHOD_NOT_ALLOWED).json({success: false, msg: 'duplicate error',error:err});
      }else{
        return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({success: false, msg: 'Internal server error',error:err});
      }
    })
  }else{
  return res.status(HttpStatus.UNAUTHORIZED).json({success: false, msg: 'Required params missing',errors:errors});
  }
  };// Register - End
  
  // Authenticate/Login - Start
  //https://flaviocopes.com/express-validate-input/
  
  authenticateUser(req, res) {
  
    req.assert('email', 'Email should not be empty').notEmpty();
    req.assert('email', 'Incorrect email format').isEmail();
    req.assert('password', 'Password should not be empty').notEmpty();
  
    var errors = req.validationErrors();
    if(!errors){
    let data = req.body;
    let user_details;
    serviceHandler.findUserEmail(data.email)
    .then((response)=>{
      if(!response) {
        throw{
          reason:"notExists"
        }
        
      } else {
        user_details = response;
        response.last_logged_in = new Date();
        response.save();
        console.log(response)
        return serviceHandler.comparePassword(data.password, response.password)
      }
    })
    .then((response)=>{
      if(!response) {
        throw{
          reason:"passMmatch"
        }
        
      } else {
        return serviceHandler.findUserWithRole({_id : objectId(user_details._id)})
      }
    })
    .then((response)=>{
      if(!response) {
        let udata = {
          id: user_details._id,
          username: user_details.username,
          email: user_details.email,
          role : user_details.role
        }
        const token = utils.generateJwtToken(udata);
        udata.prof_pic_url = utils.getPreSignedURL(user_details.prof_pic_url);
        udata.user_group_id = user_details.user_group_id;
        return res.status(HttpStatus.OK).json({
          success: true,
          token: 'JWT '+token,
          user: udata
        })
        
      } else {
        
        let udata = {
          id: user_details._id,
          username: user_details.username,
          email: user_details.email,
          role : user_details.role
        }
        const token = utils.generateJwtToken(udata);
        udata.prof_pic_url = utils.getPreSignedURL(user_details.prof_pic_url);
        udata.user_group_id = user_details.user_group_id;
        if(user_details.role != "admin"){
        if(response.length != 0){
          if(response[0].UserRoleObjects.length != 0){
            udata.role = response[0].UserRoleObjects[0].name;
          }else{
            udata.role = "role removed";
          }
        }
      }
        return res.status(HttpStatus.OK).json({
          success: true,
          token: 'JWT '+token,
          user: udata
        })
      }
    })
    .catch((err)=>{
      if(err.reason == "notExists"){
        return res.status(HttpStatus.UNAUTHORIZED).json({success: false, msg: 'User not found. Sign up'});
      }else if(err.reason == "passMmatch"){
        return res.status(HttpStatus.UNAUTHORIZED).json({success: false, msg: 'Wrong Password'});
      }else if (err.name === 'MongoError' && err.code === 11000){
        return res.status(HttpStatus.METHOD_NOT_ALLOWED).json({success: false, msg: 'duplicate error',error:err});
      }else{
        return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({success: false, msg: 'Internal server error',error:err});
      }
    })
      
    }else{
        return res.status(HttpStatus.OK).json({success: false, msg: 'Required params missing',errors:errors});
    }
  
  }// Authenticate/Login - End


// Test API - Start
async testApi(req, res) {

  let response = [
      {
          name : "Manish"
      }
  ]

  res.status(HttpStatus.OK).json({success: true, msg: 'Ok',data:response});
  
};
// Test API - End
}


module.exports = new RouteHandler();
