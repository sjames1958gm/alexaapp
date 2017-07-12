var net = require('net');
var nzappapi =  require('./nzappapi.js');

var initialized = false;
var transactions = [];
module.exports.startClient = function(addr, port, cb) {

  if (!initialized) {
    nzappapi.Initialize(
      "./nzappapi.proto", 
      {
        AppCommandResp: AppCommandResp
      });
      
    initialized = true;  
  }
  
  nzappapi.connect({type: "tcp", constructor: net.Socket, host: addr, port: port},
    {
      onOpen: (handle) => { if (cb) cb(null, handle);},
      onClose: () => { if (cb) cb("Manager is unavailable"); },
      onError: () => { if (cb) cb("Manager is unavailable"); }
    }
  );
  
};

module.exports.command = function(handle, user, device, app, sessionId, intent, ...rest) {
  let cb;
  if (rest.length > 0 && typeof rest[rest.length - 1] === "function") {
    cb = rest.pop();
  }

  nzappapi.AppCommandReq(handle, user, device, app, sessionId, intent, 
    rest[0] || "", rest[1] || "", rest[2] || "", rest[3] || "");
    
  if (cb) {
    let t = {
      sessionId,
      timer: setInterval(() => AppCommandResp(2, sessionId, "", ""), 2000),
      f: cb
    };
    transactions.push(t);
  }
};

var AppCommandResp = function(status, sessionId, response, parm) {
  console.log(`AppCommandResp: (${status}, ${sessionId}, ${response}, ${parm})`);
  for (var i = 0; i < transactions.length; i++) {
    let t = transactions[i];
    if (t.sessionId === sessionId) {
       clearInterval(t.timer);
       transactions.splice(i, 1);
       t.f(status, sessionId, response, parm);
       break;
    }
  }
};

