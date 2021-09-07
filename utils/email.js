var nodemailer = require('nodemailer');
var smtpTransport = require('nodemailer-smtp-transport');
var fs = require('fs');

var readHTMLFile = function (path, callback) {
    fs.readFile(path, { encoding: 'utf-8' }, function (err, html) {
        if (err) {
            callback(err);
        }
        else {
            callback(null, html);
        }
    });
};

smtpTransport = nodemailer.createTransport(smtpTransport({
    service: 'gmail',
    auth: {
        user: 'sistinfor21@gmail.com',
        pass: "Jarak1meter"
    }
}));

module.exports = {
    readHTMLFile,
    smtpTransport
}