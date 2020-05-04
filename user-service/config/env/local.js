'use strict';

module.exports = {
  app: {
      title: 'Demo project',
      description: 'Demo project'
  },
  db: {
      mongodb: {
          uri: 'DB link',
          options: {
              user: '',
              pass: ''
          },
          debug: process.env.MONGODB_DEBUG || false
      }
  },
  jwt: {
    normal: {
        secret: 'qCZe6np3uSELbnQDP4JBvFkRmbbFw4aAwq',
        expiresIn: '30d' //365 days
    },
    password: {
      secret: 'gJdFGPq22rVZDJWP9XnhUwRjy3U5whDy',
      expiresIn: '1h'
    }
},
  cors : {
    list : ['http://127.0.0.1:8080','http://localhost:8080']
  },
  sendgrid: {
      apiKey: '<key>',
      defaultEmailFromName: 'no reply bot - gm',
      defaultEmailFrom: 'no-reply@gm.com'
  },
  winston: {
      console: {
          colorize: true,
          timestamp: true,
          prettyPrint: true
      },
      file: {
          filename: 'logs/error.log',
          timestamp: true,
          maxsize: 2048,
          json: true,
          colorize: true,
          level: 'error'
      }
  },

  awsS3: {
    bucketName: 'curryful-files-dev',
},
microservice: {
    "config": {
        "host": "127.0.0.1",
        "port": 8080,
        "myservices":{
            "auth":{ 
                "name": "Auth Microservice",
                "url": "http://localhost",
                "address": "http://127.0.0.1:8079",
                "port": 8079
            },	
            "user":{ 
                "name": "User Microservice",
                "url": "http://localhost",
                "address": "http://127.0.0.1:8081",
                "port": 8081
            }			
        },
        "services": [
            { 
                "name": "Auth Microservice",
                "url": "http://localhost",
                "address": "http://127.0.0.1:8079",
                "port": 8079
            },	
            { 
                "name": "User Microservice",
                "url": "http://localhost",
                "address": "http://127.0.0.1:8081",
                "port": 8081
            }						
        ]
    }
},
  version: 'v1.0',
  port: process.env.PORT || 8081,
  host : "127.0.0.1",
  address: "http://127.0.0.1:8081",
};

