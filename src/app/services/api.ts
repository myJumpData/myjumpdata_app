import axios, {AxiosError, AxiosResponse} from 'axios';
import responseHandler from '../helper/responseHandler';
import {getUser} from '../redux/user.action';
import getApi from '../utils/getApi';

const instance = axios.create({
  baseURL: getApi(),
  headers: {
    'Content-Type': 'application/json',
  },
});

instance.interceptors.request.use(
  config => {
    //console.log(config.method.toUpperCase() + ": " + config.baseURL + config.url + " | " + JSON.stringify(config.data))
    const user = getUser();
    if (user && user.token && config.headers) {
      config.headers['x-access-token'] = user.token;
    }
    return config;
  },
  error => {
    if (process.env['NODE_ENV'] === 'development') {
      console.log(error);
    }
    return Promise.reject(error);
  },
);

instance.interceptors.response.use(
  (res: AxiosResponse) => {
    //console.log(">" + res.config.method.toUpperCase() + ": " + res.config.baseURL + res.config.url + " | " + JSON.stringify(res.config.data))
    return responseHandler(res);
  },
  (err: AxiosError) => {
    if (process.env['NODE_ENV'] === 'development') {
      console.log(err);
    }
    return responseHandler(err.response as AxiosResponse);
  },
);

export default instance;
