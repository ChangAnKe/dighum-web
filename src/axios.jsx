import axios from 'axios';
import { onBeforeMount, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router'

const dighumUrl = process.env.DIGHUM_URL;
const router = useRouter();

// 创建一个新的 Axios 实例
const instance = axios.create({
    baseURL: dighumUrl,
    timeout: 10000,
});

// 请求拦截器
instance.interceptors.request.use(
    (config) => {
        // 从本地存储中获取 Token
        const token = localStorage.getItem('token');
        if (token) {
            // 将 Token 添加到请求头中
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// 响应拦截器
instance.interceptors.response.use(
    (response) => response,
    (error) => {
        // 处理特定的错误状态码，例如 401 表示未授权
        if (error.response.status === 401 ) {
            // 清除 Token 并重定向到登录页面
            localStorage.removeItem('token');
            // 这里可以使用 router.push('/login') 来重定向
            router.push('/login');
        }
        return Promise.reject(error);
    }
);

export default instance;