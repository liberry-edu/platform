exports.register = function (server, options, next) {
    const Mac = require('getmac');
    Mac.getMac(function(err, macAddress) {
	   if (err) {
           throw err;
       }
        server.decorate('server', 'mac', macAddress);
        next();
    })
};

exports.register.attributes = {
    name : 'mac'
};
