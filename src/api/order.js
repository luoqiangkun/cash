  
import {get,post} from '@/http/http'
import {SYSURL} from '@/http/url'
/**
 * 获取订单列表
 */
export const orderLists = data => get('order/lists',data);


/**
 * 获取订单详情
 */
export const orderDetail = data => get('order/detail',data);



/**
 * 添加订单
 */
export const addOrder = data => post('order/add',data);



/**
 * 获取订单详情
 */
export const orderContent = data => get('order/content',data);



/**
 * 更改商品数量
 */
export const changeItemQuantity = data => post('order/change_item',data);


/**
 * 加菜
 */
export const addOrderItem = data => post('order/add_item',data);

/**
 * 减菜
 */
export const deleteOrderItem = data => post('order/delete_item',data);

/**
 * 减菜
 */
export const statusLists = data => post('order/status',data);

/**
 * 修改订单状态
 */
export const modifyOrderStatus = data => post('order/modify_status',data);


/**
 * 修改订单金额
 */
export const modifyOrderAmount = data => post('order/modify_amount',data);

/**
 * 修改订单备注
 */
export const modifyOrderRemark = data => post('order/modify_remark',data);


/**
 * 抹零
 */
export const modifyAdjustFee = data => post('order/modify_adjust',data);

/**
 * 支付
 */
export const pay = data => post('pay/pay',data);



/**
 * 支付
 */
export const micropay = function( order_id,payment_channel_code,auth_code ) {
	window.location.href = SYSURL['micropay'] + '&order_id=' + order_id + '&payment_channel_code=' + payment_channel_code + '&auth_code=' + auth_code + '&micropay=1';
};


/**
 * 配送
 */
export const shippingAdd = data => post('shipping/add',data);


/**
 * 配送
 */
export const shippingEdit = data => post('shipping/edit',data);


/**
 * 获取退单列表
 */
export const returnLists = data => get('return/lists',data);


/**
 * 获取退单详情
 */
export const returnDetail = data => get('return/detail',data);


/**
 * 获取退单详情
 */
export const modifyReturnState = data => get('return/modify_state',data);