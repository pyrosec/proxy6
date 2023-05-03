"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Proxy6Client = void 0;
const querystring_1 = __importDefault(require("querystring"));
const node_fetch_1 = __importDefault(require("node-fetch"));
const url_1 = __importDefault(require("url"));
const socks_proxy_agent_1 = require("socks-proxy-agent");
function proxyStringToObject(proxyUri) {
    const parsed = url_1.default.parse(proxyUri);
    const [username, ...passwordParts] = (parsed.auth || "").split(":");
    return {
        protocol: parsed.protocol,
        hostname: parsed.hostname,
        port: parsed.port,
        userId: username || null,
        password: passwordParts.join(":") || null,
    };
}
class Proxy6Client {
    constructor({ apiKey, proxyOptions }) {
        this.apiKey = apiKey;
        this.proxyOptions = proxyOptions;
    }
    async _call(method, data) {
        delete data[0];
        delete data[''];
        const response = (await (0, node_fetch_1.default)(this.constructor.BASE_URL + '/' + this.apiKey + '/' + method + '/' + (Object.keys(data).length ? '?' + querystring_1.default.stringify(data) : ''), {
            method: 'GET',
            agent: this.proxyOptions && new socks_proxy_agent_1.SocksProxyAgent(this.proxyOptions)
        }));
        const result = await response.json();
        if (result.error) {
            throw Object.assign(new Error(result.error), { code: result.error_id });
        }
        return result;
    }
    async ipinfo() {
        const response = (await (0, node_fetch_1.default)('https://ipinfo.io/json', {
            method: 'GET',
            agent: this.proxyOptions && new socks_proxy_agent_1.SocksProxyAgent(this.proxyOptions)
        }));
        return response.json();
    }
    static fromEnv() {
        return new this({
            apiKey: process.env.PROXY6_API_KEY,
            proxyOptions: process.env.PROXY6_PROXY && proxyStringToObject(process.env.PROXY6_PROXY)
        });
    }
    static getVersion(s) {
        return {
            'ipv4 shared': 4,
            ipv4: 3,
            ipv6: 6
        }[s.toLowerCase()] || s && Number(s);
    }
    async getprice(o) {
        return await this._call('getprice', o);
    }
    async getcount(o) {
        return await this._call('getcount', o);
    }
    async getcountry(o) {
        return await this._call('getcountry', o);
    }
    async getproxy(o) {
        return await this._call('getproxy', o);
    }
    async settype(o) {
        return await this._call('settype', o);
    }
    async setdescr(o) {
        return await this._call('setdescr', o);
    }
    async buy(o) {
        return await this._call('buy', o);
    }
    async prolong(o) {
        return await this._call('prolong', o);
    }
    async delete(o) {
        return await this._call("delete", o);
    }
    async check(o) {
        return await this._call("check", o);
    }
}
exports.Proxy6Client = Proxy6Client;
Proxy6Client.BASE_URL = "https://proxy6.net/api";
//# sourceMappingURL=proxy6.js.map