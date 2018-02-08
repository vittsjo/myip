#!/usr/bin/env node

const http = require('http');
const URL = require('url').URL;

function stringBetween(str, marker1, marker2) {
    const start = str.indexOf(marker1);
    const end = str.indexOf(marker2);
    if (start < 0 || end < 0) {
        return ""
    }
    return str.substring(start + marker1.length, end);
}

function fetchExternalIPAddress(pattern, callback) {
    const url = new URL(pattern.url);
    const options = {
        host: url.hostname,
        port: url.port || 80,
        path: url.path || '/'
    };

    let content = '';
    http.get(options, (res) => {
        res.setEncoding('utf-8');
        res.on('data', (chunk) => {
            content += chunk;
        });
        res.on('end', () => {
            const ipString = stringBetween(content, pattern.startMarker, pattern.endMarker);
            if (callback !== undefined) {
                callback(ipString);
            }
        });
        res.on('error', (err) => {
            console.error(err);
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
