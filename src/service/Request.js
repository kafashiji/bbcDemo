import axios from "axios";

class HYRequest{
  constructor(baseURL,timeout=50000000) {
    this.instance =axios.create(
      {
        baseURL,
        timeout,
        headers: {
          'Content-Type': 'application/json', // 默认请求头
          // 'Authorization': 'Bearer YOUR_TOKEN' // 认证头（可选）
        }
      }
    )
  }

  request(config){
    return new Promise((resolve, reject) =>{
      this.instance.request(config).then(res => {
        resolve(res.data)
      }).catch(err => {
        reject(err)
      })
    })
  }

  get(config){
    return this.request({ ...config, method: "get"})
  }

  post(config){
    return this.request({ ...config, method: "post"})
  }

  put(config) {
    return this.request({ ...config, method: "put" });
  }

  delete(config) {
    return this.request({ ...config, method: "delete" });
  }
}

export default new HYRequest("/api")