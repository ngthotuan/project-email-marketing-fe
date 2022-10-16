import request from '@/utils/request'

export function getAllScheduleRun() {
  return request({
    url: '/schedules-cronjobs',
    method: 'get'
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
