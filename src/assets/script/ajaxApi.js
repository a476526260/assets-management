import axios from 'axios';


export function fetch_post(url,data) {
  return new Promise(function (resolve,reject) {
    axios.post(url,data).then(result=>{
      resolve(result)
    }).catch(error=>{
      reject(error)
    })
  })
}

export function fetch_put(url,data) {
  return new Promise(function (resolve,reject) {
    axios.put(url,data).then(result=>{
      resolve(result)
    }).catch(error=>{
      reject(error)
    })
  })
}

export function fetch_get(url,data) {
  return new Promise(function (resolve,reject) {
    axios.get(url,{
      params:data
    }).then(result=>{
      resolve(result)
    }).catch(error=>{
      reject(error)
    })
  })
}

export function fetch_del(url,data) {
  return new Promise(function (resolve,reject) {
    axios.delete(url,{
      params:data
    }).then(result=>{
      resolve(result)
    }).catch(error=>{
      reject(error)
    })
  })
}

