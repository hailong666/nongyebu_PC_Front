import {request} from "./request";
import {requestorder} from "./request";

// 获取订单列表
export function getOrderListRequest(param) {
  return requestorder({
    url: '/orders',
    param
  })
}

// 获取物流进度
export function getOrderDetailRequest(id) {
  return request({
    url: `/orders/${id}`
  })
}

// 修改订单数据
export function editOrderRequest(id, data) {
  return request({
    url: `/orders/${id}`,
    method: 'put',
    data
  })
}
