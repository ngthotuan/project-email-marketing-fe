import request from '@/utils/request'

export function count() {
  return request({
    url: '/statistics',
    method: 'get'
  })
}
