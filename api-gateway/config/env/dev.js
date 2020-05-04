'use strict';

module.exports = {
  app: {
      title: 'Gearmonkey',
      description: 'Gearmonkey'
  },
  db: {
      mongodb: {
          uri: 'mongodb+srv://gmuser:gmuser5@gm-dev-ccj4h.mongodb.net/dev?retryWrites=true&w=majority',
          options: {
              user: '',
              pass: ''
          },
          debug: process.env.MONGODB_DEBUG || false
      }
  },
  jwt: {
      normal: {
          secret: 'qCZe6np3uSELbnQDP4JBvFkRmbbFw4aA',
          expiresIn: '365d' //365 days
      },
      password: {
        secret: 'gJdFGPq22rVZDJWP9XnhUwRjy3U5whDy',
        expiresIn: '1h'
      }
  },
  cors : {
    list : ['http://ec2-13-232-168-0.ap-south-1.compute.amazonaws.com','http://127.0.0.1:3000','http://localhost:3001']
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
    bucketName: 'images',
},
microservice: {
    "config": {
        "host": "127.0.0.1",
        "port": 8080,
        "myservices":{
            "auth":{ 
                "name": "Auth Microservice",
                "url": "http://gm-auth-service",
                "address": "http://127.0.0.1:8079",
                "port": 8079
            },
            "user":{ 
                "name": "User Microservice",
                "url": "http://gm-user-service",
                "address": "http://127.0.0.1:8081",
                "port": 8081
            },	
        },
        "services": [
            { 
                "name": "Auth Microservice",
                "url": "http://gm-auth-service",
                "address": "http://127.0.0.1:8079",
                "port": 8079
            },	
            { 
                "name": "User Microservice",
                "url": "http://gm-user-service",
                "address": "http://127.0.0.1:8081",
                "port": 8081
            }			
        ]
    }
},
  
  port: process.env.PORT || 8080,
  host : "127.0.0.1"
};

