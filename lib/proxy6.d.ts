export declare type IGetPriceRequest = {
    count: number;
    period: number;
    version?: number;
};
export declare type IGetPriceResponse = {
    status: "yes";
    user_id: string;
    balance: string;
    currency: string;
    price: number;
    price_single: number;
    period: number;
    count: number;
};
export declare type ErrorResponse = {
    status: "no";
    error_id: number;
    error: string;
};
export declare type IGetCountryRequest = {
    version?: number;
    country: string;
};
export declare type IGetCountRequest = {
    country: string;
    version?: string;
};
export declare type IGetCountResponse = {
    status: "yes";
    user_id: string;
    balance: string;
    currency: string;
    count: number;
};
export declare type IGetCountryResponse = {
    status: "yes";
    user_id: string;
    balance: string;
    currency: string;
    list: string[];
};
export declare type IGetProxyRequest = {
    state: "active" | "expired" | "expiring" | "all";
    descr: string;
    no_key: any;
    page: number;
    limit: number;
};
export declare type IProxy = {
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
    active: string;
};
export declare type IGetProxyResponse = {
    status: "yes";
    user_id: string;
    balance: string;
    currency: string;
    list_count: number;
    list: {
        [item: string]: IProxy;
    };
};
export declare type ISetTypeRequest = {
    ids: string;
    type: string;
};
export declare type ISetTypeResponse = {
    status: "yes";
};
export declare type ISetDescrRequest = {
    new: string;
    old: string;
    ids: string;
};
export declare type ISetDescrResponse = {
    status: "yes";
    user_id: string;
    balance: string;
    currency: string;
    count: number;
};
export declare type IBuyRequest = {
    count: number;
    period: number;
    country: string;
    version?: string;
    type?: string;
    auto_prolong?: string;
    nokey?: string;
    descr?: string;
};
export declare type IBuyResponse = {
    status: "yes";
    user_id: string;
    balance: number;
    currency: string;
    count: number;
    price: number;
    period: number;
    country: string;
    list: {
        [key: string]: IProxy;
    };
};
export declare type IProlongRequest = {
    ids: string;
    period: number;
    nokey: any;
};
export declare type IProlongResponseListItem = {
    id: number;
    date_end: string;
    unixtime_end: number;
};
export declare type IProlongResponse = {
    status: "yes";
    user_id: string;
    balance: number;
    currency: string;
    price: number;
    period: number;
    count: number;
    list: {
        [key: string]: IProlongResponseListItem;
    };
};
export declare type IDeleteRequest = {
    ids: string;
    descr: string;
};
export declare type IDeleteResponse = {
    status: "yes";
    user_id: string;
    balance: string;
    currency: string;
    count: number;
};
export declare type ICheckRequest = {
    ids: string;
};
export declare type ICheckResponse = {
    status: "yes";
    user_id: string;
    balance: string;
    currency: string;
    proxy_id: number;
    proxy_status: boolean;
};
export declare class Proxy6Client {
    static BASE_URL: string;
    apiKey: string;
    proxyOptions: any;
    constructor({ apiKey, proxyOptions }: {
        apiKey: any;
        proxyOptions: any;
    });
    _call(method: any, data: any): Promise<any>;
    ipinfo(): Promise<any>;
    static fromEnv(): Proxy6Client;
    static getVersion(s: any): any;
    getprice(o: IGetPriceRequest): Promise<IGetPriceResponse | ErrorResponse>;
    getcount(o: IGetCountRequest): Promise<IGetCountResponse | ErrorResponse>;
    getcountry(o: IGetCountryRequest): Promise<IGetCountryResponse | ErrorResponse>;
    getproxy(o: IGetProxyRequest): Promise<IGetProxyResponse | ErrorResponse>;
    settype(o: ISetTypeRequest): Promise<ISetTypeResponse | ErrorResponse>;
    setdescr(o: ISetDescrRequest): Promise<ISetDescrResponse | ErrorResponse>;
    buy(o: IBuyRequest): Promise<IBuyRequest | ErrorResponse>;
    prolong(o: IProlongRequest): Promise<IProlongRequest | ErrorResponse>;
    delete(o: IDeleteRequest): Promise<IDeleteResponse | ErrorResponse>;
    check(o: ICheckRequest): Promise<ICheckResponse | ErrorResponse>;
}
