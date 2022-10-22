import request from '@/utils/request'

export function getAllTemplates() {
  return request({
    url: '/templates/',
    method: 'get'
  })
}

export function getTemplates(query) {
  return request({
    url: '/templates',
    method: 'get',
    params: query
  })
}

export function getTemplate(id) {
  return request({
    url: `/templates/${id}`,
    method: 'get'
  })
}

export function createTemplate(data) {
  return request({
    url: '/templates/template',
    method: 'post',
    data
  })
}

export function updateTemplate(data) {
  return request({
    url: '/templates/template',
    method: 'put',
    data
  })
}

export function deleteTemplate(template) {
  return request({
    url: `/templates/${template}`,
    method: 'delete'
  })
}
