import request from '@/utils/request'

export function getAllProxies() {
  return request({
    url: '/proxies/',
    method: 'get'
  })
}

export function getProxies(query) {
  return request({
    url: '/proxies',
    method: 'get',
    params: query
  })
}

export function getProxy(id) {
  return request({
    url: '/proxies/detail',
    method: 'get',
    params: { id }
  })
}

export function createProxy(data) {
  return request({
    url: '/proxies/proxy',
    method: 'post',
    data
  })
}

export function updateProxy(data) {
  return request({
    url: '/proxies/proxy',
    method: 'put',
    data
  })
}

export function deleteProxy(proxy) {
  return request({
    url: `/proxies/${proxy}`,
    method: 'delete'
  })
}
