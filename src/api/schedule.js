import request from '@/utils/request'

export function getSchedules() {
  return request({
    url: '/schedules',
    method: 'get'
  })
}

export function updateSchedule(data) {
  return request({
    url: '/schedules/schedule',
    method: 'put',
    data
  })
}
