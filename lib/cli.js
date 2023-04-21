"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.runCLI = exports.proxyToExport = exports.responseToListExports = exports.responseToFirstExport = void 0;
const proxy6_1 = require("./proxy6");
const change_case_1 = require("change-case");
const yargs_1 = __importDefault(require("yargs"));
yargs_1.default.version(false);
const util_1 = __importDefault(require("util"));
function responseToFirstExport(response) {
    console.log(response);
    const proxy = response.list[Object.keys(response.list)[0]];
    return proxyToExport(proxy);
}
exports.responseToFirstExport = responseToFirstExport;
function responseToListExports(response) {
    const proxies = Object.values(response.list);
    return proxies.map((v) => proxyToExport(v));
}
exports.responseToListExports = responseToListExports;
function proxyToExport(proxy) {
    const proxyType = {
        socks: 'all',
        http: 'http'
    }[proxy.type];
    const proxyProtocol = {
        socks: 'socks5://',
        http: 'http://'
    }[proxy.type];
    return 'export ' + proxyType + '_proxy=' + proxyProtocol + proxy.user + ':' + proxy.pass + '@' + proxy.host + ':' + proxy.port;
}
exports.proxyToExport = proxyToExport;
async function runCLI() {
    const options = Object.assign({}, yargs_1.default.argv);
    if (options.h | options.help) {
        console.log('usage: proxy6 <command> [options]');
    }
    else {
        const arg = yargs_1.default.argv._[0];
        const client = proxy6_1.Proxy6Client.fromEnv();
        const toExport = options['to-export'] || options.e;
        delete options['to-export'];
        delete options.e;
        const response = arg === 'ipinfo' ? await client.ipinfo() : await client._call(arg, Object.entries(options).reduce((r, [key, value]) => {
            r[(0, change_case_1.snakeCase)(key)] = value;
            return r;
        }, {}));
        if (toExport && response.status === 'yes') {
            if (arg === 'buy') {
                console.log(responseToFirstExport(response));
            }
            else if (arg === 'getproxy') {
                console.log(responseToListExports(response).join('\n'));
            }
        }
        else {
            console.log(util_1.default.inspect(response, {
                colors: true,
                depth: 5
            }));
        }
    }
}
exports.runCLI = runCLI;
//# sourceMappingURL=cli.js.map