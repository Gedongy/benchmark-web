import axios from 'axios'; // 引入axios
// import { useRouter } from 'vue-router';
import Vrouter from '@/router'
import { getToken } from '@/utils/auth';
import ssoLogin from '@/utils/ssoLogin';
// import { logout } from '@/api/user';

const Router = Vrouter;
console.log('import.meta.env.VITE_BASE_API', import.meta.env.VITE_BASE_API, import.meta.env.VITE_TARGET_HOST)
const service = axios.create({
  baseURL: import.meta.env.VITE_BASE_API as string,
  // baseURL: 'http://192.168.0.64:8080/',
  timeout: 5000,
});

// http request 拦截器
service.interceptors.request.use(
  (config:any) => {
    // 全局添加 token
    if (getToken()) {
      // config.headers['asr-token'] = getToken();
    }
    return config;
  },
  (error) => {
    console.error(error);

    return Promise.reject(error);
  },
);

// http response 拦截器
service.interceptors.response.use(
  // (response) => response.data,
  (response) => {
    // console.log('response.data', response.data)
    if (response.data.code === 9) {
      // Router.replace('/rejectUser');
      return
    }
    return response.data
  },
  (error) => {
    if (error.response && error.response.status && error.response.status === 403) {
    //   logout().then(() => {
    //     // removeToken()
    //     ssoLogin();
    //   });
    }
    // 网络超时
    if (error.message && error.message.includes('timeout')) {
      console.error('请求超时');
      return error.message;
    }
    if (error.response && error.response.status && error.response.status === 500) {
      // 没有权限
      console.error('接口异常');
      return error;
    }
    return error;
  },
);

export default service;
