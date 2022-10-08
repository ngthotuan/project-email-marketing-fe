import request from '@/utils/request'

export function getEmails(query) {
  return request({
    url: '/vue-element-admin/email/list',
    method: 'get',
    params: query
  })
}

export function getEmail(id) {
  return request({
    url: '/vue-element-admin/email/detail',
    method: 'get',
    params: { id }
  })
}

export function createEmail(data) {
  return request({
    url: '/vue-element-admin/email/create',
    method: 'post',
    data
  })
}

export function updateEmail(data) {
  return request({
    url: '/vue-element-admin/email/update',
    method: 'post',
    data
  })
}
