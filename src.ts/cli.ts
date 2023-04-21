import { Proxy6Client } from "./proxy6";

import { snakeCase } from "change-case";
import yargs from "yargs";
yargs.version(false);
import util from "util";

export function responseToFirstExport(response) {
	console.log(response);
  const proxy = response.list[Object.keys(response.list)[0]];
  return proxyToExport(proxy);
}

export function responseToListExports(response) {
  const proxies = Object.values(response.list);
  return proxies.map((v) => proxyToExport(v));
}

export function proxyToExport(proxy) {
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

export async function runCLI() {
  const options = Object.assign({}, yargs.argv);
  if (options.h | options.help) {
    console.log('usage: proxy6 <command> [options]');
  } else {
    const arg = yargs.argv._[0];
    const client = Proxy6Client.fromEnv();
    const toExport = options['to-export'] || options.e;
    delete options['to-export'];
    delete options.e;
    const response = arg === 'ipinfo' ? await client.ipinfo() : await client._call(arg, Object.entries(options).reduce((r, [key, value]) => {
      r[snakeCase(key)] = value;
      return r;
    }, {}));
    if (toExport && response.status === 'yes') {
      if (arg === 'buy') {
        console.log(responseToFirstExport(response));
      } else if (arg === 'getproxy') {
        console.log(responseToListExports(response).join('\n'));
      }
    } else {
      console.log(util.inspect(response, {
        colors: true,
        depth: 5
      }));
    }
  }
}
