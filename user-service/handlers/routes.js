const routeHandler = require('./route-handler');
const config = require('../config/config');
var http = require('http');

GetMicroserviceData = function(url,address){
    
	return new Promise(function(fulfill, reject){
        var request = http.get(url, res => {
            if (res.statusCode < 200 || 
                res.statusCode > 299) {
                    reject(new Error('Error status code: ' 
                    + res.statusCode));
            }
            var body = "";
            res.setEncoding("utf8");
            res.on("data", data => {
                body += data;
            });
            res.on("end", () => {
                body = JSON.parse(body);
                try{
                    fulfill(body);
                } catch(exception){
                    
                    reject(exception);
                }
            
                if(body && body.success){ 
                    fulfill(body.result);
                }
            });
        });

        request.on("error", function(err){              
            err.success = false;
            err.address = address;      
            fulfill(err);
        });
    });
};


class Routes {
  constructor(app) {
    this.app = app;
  }
  

  /* creating app Routes starts */
  appRoutes() {
    this.app.get('/v1.0/users/testapi', routeHandler.testApi);
  }

  
  /* creating app Routes ends */
  routesConfig() {
    this.appRoutes();
  }
}
module.exports = Routes;
