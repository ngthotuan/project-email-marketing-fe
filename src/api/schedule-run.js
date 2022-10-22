import request from '@/utils/request'

export function getAllScheduleRun(query) {
  return request({
    url: '/schedules-cronjobs',
    method: 'get',
    params: query
  })
}

export function getScheduleRun(id) {
  return request({
    url: '/schedules-cronjobs/detail',
    method: 'get',
    params: { id }
  })
}

export function createScheduleRun(data) {
  return request({
    url: '/schedules-cronjobs/schedules-cronjob',
    method: 'post',
    data
  })
}

export function updateScheduleRun(data) {
  return request({
    url: '/schedules-cronjobs/schedules-cronjob',
    method: 'put',
    data
  })
}

export function deleteScheduleRun(id) {
  return request({
    url: `/schedules-cronjobs/${id}`,
    method: 'delete'
  })
}

export function disableScheduleRun(id) {
  return request({
    url: `/schedules-cronjobs/schedules-cronjob/${id}/disable`,
    method: 'put'
  })
}

export function enableScheduleRun(id) {
  return request({
    url: `/schedules-cronjobs/schedules-cronjob/${id}/enable`,
    method: 'put'
  })
}
