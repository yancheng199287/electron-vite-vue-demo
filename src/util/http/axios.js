import axios from 'axios'
import qs from 'qs'
import store from 'store'
import {ElNotification} from 'element-plus'
// 设置默认请求参数
axios.defaults.timeout = 25000
axios.defaults.headers.post['Content-Type'] = 'application/json'

// 根据环境配置自动匹配基路径
if (process.env.NODE_ENV === 'development') {
    axios.defaults.baseURL = 'http://www.520code.net'
} else if (process.env.NODE_ENV === 'production') {
    axios.defaults.baseURL = 'http://www.oneinlet.com'
}

// 添加一个请求拦截器
axios.interceptors.request.use(function (config) {
    const token = store.get('TOKEN')
    config.headers['Authorization'] = token ? token : ""
    return config
}, function (error) {
    return Promise.reject(error)
})

// 异常拦截处理器 处理http非200的状态码，如 404 找不到页面  401未授权重定向到登陆
const errorHandler = (error) => {
    return Promise.reject(error)
}

const errorElNotification = (msg) => {
    ElNotification({
        title: 'Error',
        message: msg,
        type: 'error',
    })
}

axios.interceptors.response.use((response) => {

    if (response.data.code === 402) {
        store.remove('TOKEN')
        window.location.href = '/login'
    }


    if (response.data.code !== 200) {
        errorElNotification(response.data.msg)
        throw new Error('error,code is not 200,msg:' + response.data.msg)
    }
    return response.data
}, errorHandler)

const request = function (url, params, config, method) {
    return new Promise((resolve, reject) => {
        axios[method](url, params, Object.assign({}, config)).then(response => {
            resolve(response.data)
        }, err => {
            if (err.Cancel) {
                console.log(err)
            } else {
                reject(err)
            }
        }).catch(err => {
            reject(err)
        })
    })
}

// Get 请求只能在url上带参数，此处params无效，是为了兼容request
export function get(url, params, config = {}) {
    if (params) {
        url = url + '?' + qs.stringify(params)
    }
    return request(url, null, config, 'get')
}

// 适用于JSON请求，默认是JSON请求
export function postJSON(url, params, config = {}) {
    return request(url, params, config, 'post')
}

// 适用于post表单请求，自动序列化请求参数
export function postFormUrl(url, params, config = {}) {
    config.headers = {
        'Content-Type': 'application/x-www-form-urlencoded'
    }
    return request(url, qs.stringify(params), config, 'post')
}

// 适用于上传文件
export function postFormData(url, formData, config = {}) {
    config.headers = {
        'Content-Type': 'multipart/form-data'
    }
    return request(url, formData, config, 'post')
}

export default axios