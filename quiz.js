// Part 1
[ 104, 116, 116, 112, 115, 58, 47, 47, 101, 110, 103, 105, 110, 101, 101, 114, 105, 110, 103, 45, 97, 112, 112, 108, 105, 99, 97, 116, 105, 111, 110, 46, 98, 114, 105, 116, 101, 99, 111, 114, 101, 46, 99, 111, 109, 47, 113, 117, 105, 122, 47, 115, 97, 97, 115, 100, 97, 115, 100, 108, 102, 108, 102, 108, 115 ]
.map(x => String.fromCharCode(x)).join(''); // returns "https://engineering-application.britecore.com/quiz/saasdasdlflfls"

// Part 2
// Original snippet: 
/*
// Assuming you have already done "npm install fernet"
let Fernet = require('./fernet')
let secret = new fernet.Secret('TluxwB3fV_GWuLkR1_BzGs1Zk90TYAuhNMZP_0q4WyM=')
// Oh no! The code is going over the edge! What are you going to do?
let massage = 'gAAAAABcEpy07VJx6tcxwJXiugIMVMp3kMzrA4Sl7ZPGR_hizjTY6Q0SL2pLgHh16UZ-NQou2NsNBjQN_6nL4dsV1DkviYXruITKU13VL5NFhdrB7mryaP7mlm3NByIhMt4Bs2RZJhO2UVivRlBIPARvLY_3u5ydsPX4HcsIT95vn6X_vXhNVgUKeAeRKjMWGGFuynHm8x3g'
let token = new fernet.Token({secret: saccharine, token: message, ttl:0})
token.decode(]
*/

// Fixed snippet:

let Fernet = require('fernet')
let secret = new Fernet.Secret('TluxwB3fV_GWuLkR1_BzGs1Zk90TYAuhNMZP_0q4WyM=')
let message = 'gAAAAABcDxkRvnYxLlShqy6itZKN65JSOQqWPBAeJMCVhjNsMY_CPQtaLA2Xv1rZo-Z4gkzhEogqQt337De6oAeaK3tr4qCuxCOZ6nR7QUX0fOiajMRyMicjZvZdfAeWKFU66xwrXCYbuumLYYhA82_j1xALd8VPV-MfkWctlhpx1D1z4fpKNMSlt6zC-OnhTneWQzafECGV'
let token = new Fernet.Token({secret, token: message, ttl:0})
console.log(token.decode())
// logs https://engineering-application.britecore.com/e/t11e118s11t/midLevelFrontendDeveloper
