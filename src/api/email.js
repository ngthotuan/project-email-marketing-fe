import request from '@/utils/request'

export function getEmails(query) {
  return request({
    url: '/emails',
    method: 'get',
    params: query
  })
}

export function getEmail(id) {
  return request({
    url: '/emails/email/detail',
    method: 'get',
    params: { id }
  })
}

export function createEmail(data) {
  return request({
    url: '/emails/email',
    method: 'post',
    data
  })
}

export function updateEmail(data) {
  return request({
    url: '/emails/email',
    method: 'put',
    data
  })
}

export function deleteEmail(email) {
  return request({
    url: `/emails/${email}`,
    method: 'delete'
  })
}
