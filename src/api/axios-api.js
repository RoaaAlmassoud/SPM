import axios from 'axios';
import Helper from '../utils/helper'

export default class AxiosApi {
    
    // static ApiURL = "https://backend-nichijo.s-pm.co.jp/api/";
    static ApiURL = "https://bonzuttner.xsrv.jp/spm-back/api/";

    static call = async (requestBody, path, method, formDataBody = false) => {
        let url = path ? `${this.ApiURL}${path}` : this.ApiURL;
        let accessToken = localStorage.getItem('api_token');
        let headers = {
            "Content-Type": formDataBody ? "multipart/form-data" : "application/json"
        };

        if (accessToken) {
            headers['api-token'] = `${accessToken}`
        }

        try {
            const response = await axios[method](url
                , method === 'get' ? {
                        headers: headers,
                        timeout: 1200000
                    }
                    : method === 'delete' ? {
                            headers: headers,
                            data: requestBody
                        }
                        : requestBody, {
                    headers: headers,
                    timeout: 1200000
                }, {crossDomain: true});

            return Helper.getResponseData(response);
        } catch (e) {
            if (e.response) {
                return  Helper.getResponseData(e.response);
            } else
                return e;
        }
    }
}