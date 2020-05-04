'use strict';

const config = require('../config/config');
const jwt = require('jsonwebtoken');
const otpGenerator = require("otp-generator");

const Promise = require('bluebird');
const AWS = require("aws-sdk");

AWS.config.loadFromPath('./config/s3_credentials.json');

const BucketName = config.awsS3.bucketName;
const s3Bucket = new AWS.S3({ params: { Bucket: BucketName } });


const uploadToS3 = (fileName, fileExt, fileData, isCampaign, callback) => {
    let data = new Buffer(fileData.replace("data:image\/" + fileExt + ";base64,", ""), "base64")
    var uploadabledata = {
        ACL: 'public-read',
        Key: fileName + '.' + fileExt,
        Body: data,
        ContentType: 'image/' + fileExt
    };
    s3Bucket.putObject(uploadabledata, function(err, response) {
        if (err) {
            console.log('Error in uploading', err);
        } else {
            console.log("uploaded: ", fileName+"."+fileExt);
            if(isCampaign)
                callback(response);

        }
    });
};

const getPreSignedURL = (awsFileKey) => {
  let s3 = new AWS.S3();
  let params = {
      Bucket: config.awsS3.bucketName,
      Key: awsFileKey
  };
  try {
      let url = s3.getSignedUrl('getObject', params);
      return url;
      
  } catch (err) {

      return "";
      
  }
}


const generateJwtToken = (data) => {

  let secretCode = config.jwt.normal.secret;
  let expiresIn = config.jwt.normal.expiresIn;
  return jwt.sign({ data }, secretCode, { expiresIn: expiresIn });

};

const generateChangePassJwtToken = (data) => {

  let secretCode = config.jwt.normal.secret;
  return jwt.sign({ data }, secretCode, { expiresIn: 120 });//2 minutes

};


const decodeChangePassJwtToken = (jwtToken) => {
  let secretCode = config.jwt.normal.secret;
  return new Promise((resolve, reject) => {
      jwt.verify(jwtToken, secretCode, (error, decodedData) => {
          if (!error) resolve(decodedData);
          else reject({ status: 'unauthorised', message: 'jwt expired' });
      });
  });
};

const generateInvitationJwtToken = (data) => {
    let secretCode = config.jwt.normal.secret;
    return jwt.sign({ data }, secretCode, { expiresIn: '1d' });//1 day
  };

  const decodeJwtToken = (jwtToken) => {
    let secretCode = config.jwt.normal.secret;
    return new Promise((resolve, reject) => {
        jwt.verify(jwtToken, secretCode, (error, decodedData) => {
            if (!error) resolve(decodedData);
            else reject({ status: 'unauthorised', message: 'jwt expired' });
        });
    });
  };

const generateOTP = () => {
  return otpGenerator.generate(6, { alphabets: false, upperCase: false, specialChars: false });
}

module.exports = {
    uploadToS3,
    getPreSignedURL,
    generateJwtToken,
    generateChangePassJwtToken,
    decodeChangePassJwtToken,
    generateOTP,
    generateInvitationJwtToken,
    decodeJwtToken
};
