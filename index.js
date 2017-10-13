#!/usr/bin/env node

const http = require('http');
const URL = require('url').URL;

function stringBetween(str, marker1, marker2) {
    var start = str.indexOf(marker1);
    var end = str.indexOf(marker2);
    if (start < 0 || end < 0) {
        return ""
    }
    start += marker1.length;
    return str.substring(start, end);
}

function fetchExternalIPAddress(pattern, callback) {
    var url = new URL(pattern.url);
    var options = {
        host: url.hostname,
        port: url.port || 80,
        path: url.path || '/'
    };

    var content = '';
    http.get(options, (res) => {
        res.setEncoding('utf-8');
        res.on('data', (chunk) => {
            content += chunk;
        });
        res.on('end', () => {
            var ipString = stringBetween(content, pattern.startMarker, pattern.endMarker);
            if (callback !== undefined) {
                callback(ipString);
            }
        });
    });
}

fetchExternalIPAddress({
    url: 'http://myip.com.tw',
    startMarker: 'color=green>',
    endMarker: '</font></h1>'
}, (ipString) => {
    console.log(ipString);
});
