var nodemailer = require("nodemailer");
var smtpTransport = require("nodemailer-smtp-transport");
var fs = require("fs");
const { google } = require("googleapis");
const OAuth2 = google.auth.OAuth2;

var readHTMLFile = function (path, callback) {
  fs.readFile(path, { encoding: "utf-8" }, function (err, html) {
    if (err) {
      callback(err);
    } else {
      callback(null, html);
    }
  });
};
const oauth2Client = new OAuth2(
  "775082489621-ili1rvstqjra71gqg80pgu5qef8o2in7.apps.googleusercontent.com", // ClientID
  "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", // Client Secret
  "https://developers.google.com/oauthplayground" // Redirect URL
);

oauth2Client.setCredentials({
  refresh_token:
    "1//04NaxscZ43c5vCgYIARAAGAQSNwF-L9IriVXD5lrrlnGYnh0YTRJzrlrifcJS5TPiuJID_Lj2N-p8ciyh5NNInd2gzpN3d49Woz4",
});

const accessToken = oauth2Client.getAccessToken();

smtpTransport = nodemailer.createTransport({
  service: "gmail",
  auth: {
    type: "OAuth2",
    user: process.env.EMAIL,
    clientId:
      "775082489621-ili1rvstqjra71gqg80pgu5qef8o2in7.apps.googleusercontent.com",
    clientSecret: "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",
    refreshToken:
      "1//04NaxscZ43c5vCgYIARAAGAQSNwF-L9IriVXD5lrrlnGYnh0YTRJzrlrifcJS5TPiuJID_Lj2N-p8ciyh5NNInd2gzpN3d49Woz4",
    accessToken: accessToken,
    // pass: process.env.PASSWORD,
  },
  tls: {
    rejectUnauthorized: false,
  },
});

module.exports = {
  readHTMLFile,
  smtpTransport,
};
