import qs from "querystring";
import fetch from "node-fetch";
import url from "url";
import { SocksProxyAgent } from "socks-proxy-agent";

export type IGetPriceRequest = {
  count: number;
  period: number;
  version?: number
}
export type IGetPriceResponse = {
  status: "yes";
  user_id: string;
  balance: string;
  currency: string;
  price: number;
  price_single: number;
  period: number;
  count: number;
}

export type ErrorResponse = {
  status: "no";
  error_id: number;
  error: string
}

export type IGetCountryRequest = {
  version?: number;
  country: string;
}

export type IGetCountRequest = {
  country: string;
  version?: string;
};

export type IGetCountResponse = {
  status: "yes";
  user_id: string;
  balance: string;
  currency: string;
  count: number
}

export type IGetCountryResponse = {
  status: "yes";
  user_id: string;
  balance: string;
  currency: string;
  list: string[];
}

export type IGetProxyRequest = {
  state: "active" | "expired" | "expiring" | "all";
  descr: string;
  no_key: any;
  page: number;
  limit: number
}

export type IProxy = {
  id: string;
  ip: string;
  host: string;
  port: string;
  user: string;
  pass: string;
  type: string;
  country: string;
  date: string;
  date_end: string;
  unixtime: number;
  unixtime_end: number;
  descr: string;
  active: string
}

export type IGetProxyResponse = {
  status: "yes";
  user_id: string;
  balance: string;
  currency: string;
  list_count: number;
  list: {
    [item: string]: IProxy
  }
}

export type ISetTypeRequest = {
  ids: string;
  type: string
}

export type ISetTypeResponse = {
  status: "yes"
}

export type ISetDescrRequest = {
  new: string;
  old: string;
  ids: string
}

export type ISetDescrResponse = {
  status: "yes";
  user_id: string;
  balance: string;
  currency: string;
  count: number;
}

export type IBuyRequest = {
  count: number;
  period: number;
  country: string;
  version?: string;
  type?: string;
  auto_prolong?: string;
  nokey?: string;
  descr?: string;
}

export type IBuyResponse = {
  status: "yes";
  user_id: string;
  balance: number;
  currency: string;
  count: number;
  price: number;
  period: number;
  country: string;
  list: {
    [key: string]: IProxy
  }
}

export type IProlongRequest = {
  ids: string;
  period: number;
  nokey: any;
}

export type IProlongResponseListItem = {
  id: number;
  date_end: string;
  unixtime_end: number;
}

export type IProlongResponse = {
  status: "yes";
  user_id: string;
  balance: number;
  currency: string;
  price: number;
  period: number;
  count: number;
  list: {
    [key: string]: IProlongResponseListItem
  }
}

export type IDeleteRequest = {
  ids: string;
  descr: string
}

export type IDeleteResponse = {
  status: "yes";
  user_id: string;
  balance: string;
  currency: string;
  count: number
}

export type ICheckRequest = {
  ids: string;
}

export type ICheckResponse = {
  status: "yes";
  user_id: string;
  balance: string;
  currency: string;
  proxy_id: number;
  proxy_status: boolean;
}

function proxyStringToObject(proxyUri: string) {
  const parsed = url.parse(proxyUri);
  const [username, ...passwordParts] = (parsed.auth || "").split(":");
  return {
    protocol: parsed.protocol,
    hostname: parsed.hostname,
    port: parsed.port,
    userId: username || null,
    password: passwordParts.join(":") || null,
  };
}

export class Proxy6Client {
  static BASE_URL = "https://proxy6.net/api";
  public apiKey: string;
  public proxyOptions: any;
  constructor({
    apiKey,
    proxyOptions
  }) {
    this.apiKey = apiKey;
    this.proxyOptions = proxyOptions;
  }
  async _call(method, data) {
    delete data[0];
    delete data[''];
    const response = (await fetch((this.constructor as any).BASE_URL + '/' + this.apiKey + '/' + method + '/' + (Object.keys(data).length ? '?' + qs.stringify(data) : ''), {
      method:'GET',
      agent: this.proxyOptions && new SocksProxyAgent(this.proxyOptions)
    }));
    const result = await response.json();
    if (result.error) {
      throw Object.assign(new Error(result.error), { code: result.error_id });
    }
    return result;
  }
  async ipinfo() {
    const response = (await fetch('https://ipinfo.io/json', {
      method:'GET',
      agent: this.proxyOptions && new SocksProxyAgent(this.proxyOptions)
    }));
    return response.json();
  }
  static fromEnv() {
    return new this({
      apiKey: process.env.PROXY6_API_KEY,
      proxyOptions: process.env.PROXY6_PROXY && proxyStringToObject(process.env.PROXY6_PROXY)
    } as any);
  }
  static getVersion(s) {
    return {
      'ipv4 shared': 4,
      ipv4: 3,
      ipv6: 6
    }[s.toLowerCase()] || s && Number(s)
  }
  async getprice(o: IGetPriceRequest): Promise<IGetPriceResponse | ErrorResponse> {
    return await this._call('getprice', o);
  }
  async getcount(o: IGetCountRequest): Promise<IGetCountResponse | ErrorResponse> {
    return await this._call('getcount', o);
  }
  async getcountry(o: IGetCountryRequest): Promise<IGetCountryResponse | ErrorResponse> {
    return await this._call('getcountry', o);
  }
  async getproxy(o: IGetProxyRequest): Promise<IGetProxyResponse | ErrorResponse> {
    return await this._call('getproxy', o);
  }
  async settype(o: ISetTypeRequest): Promise<ISetTypeResponse | ErrorResponse> {
    return await this._call('settype', o);
  }
  async setdescr(o: ISetDescrRequest): Promise<ISetDescrResponse | ErrorResponse> {
    return await this._call('setdescr', o);
  }
  async buy(o: IBuyRequest): Promise<IBuyRequest | ErrorResponse> {
    return await this._call('buy', o);
  }
  async prolong(o: IProlongRequest): Promise<IProlongRequest | ErrorResponse> {
    return await this._call('prolong', o);
  }
  async delete(o: IDeleteRequest): Promise<IDeleteResponse | ErrorResponse> {
    return await this._call("delete", o);
  }
  async check(o: ICheckRequest): Promise<ICheckResponse | ErrorResponse> {
    return await this._call("check", o);
  }
}
