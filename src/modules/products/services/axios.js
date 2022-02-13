const axios = require('axios');
const axiosObj = axios.create({
    baseURL: 'https://api.example.com'
});

const setBearerToken = (token) => {
    let headers = { Authorization: 'Bearer ' + token };
    axiosObj.defaults.headers = headers
}

const getRequest = (url,params={})=>{
    console.log("params is",params);
    return axiosObj.get(url,params);
}

const setConfig = ()=>{
    axiosObj.defaults.baseURL = 'http://localhost:4343/';
}

module.exports =   {
    setBearerToken,
    getRequest,
    setConfig
}


