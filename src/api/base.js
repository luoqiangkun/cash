  
import {get,post} from '@/http/http'


/**
 * 获取店铺信息
 */
export const storeInfo = data => get('store/info',data);


/**
 * 获取店铺配置
 */
export const storeConfig = data => get('store/config/info',data);
/**
 * 获取服务员列表
 */
export const waiterLists = data => get('waiter/lists',data);


/**
 * 获取桌台列表
 */
export const tableLists = data => get('table/lists',data);


/**
 * 添加桌台
 */
export const tableAdd = data => post('table/add',data);


/**
 * 编辑桌台
 */
export const tableEdit = data => post('table/edit',data);


/**
 * 删除桌台
 */
export const tableDel = data => post('table/delete',data);



/**
 * 更改桌台状态
 */
export const tableState = data => post('table/state',data);

/**
 * 更改桌台状态
 */
export const tableContent = data => post('table/content',data);

/**
 * 获取桌台类型列表
 */
export const tableTypeLists = data => get('table/type/lists',data);

/**
 * 添加桌台类型
 */
export const tableTypeAdd = data => get('table/type/add',data);


/**
 * 
 */
export const tableActionAdd = data => get('table/action/add',data);


/**
 * 排队列表
 */
export const queueLists = data => get('queue/lists',data);

/**
 * 取号
 */
export const addQueue = data => post('queue/add',data);


/**
 * 取号
 */
export const editQueue = data => post('queue/edit',data);




/**
 * 统计
 */
export const analyticsOrder = data => get('analytics/order',data);

export const analyticsGoods = data => get('analytics/goods',data);

export const analyticsTable = data => get('analytics/table',data);




/**
 * 打印
 */
export const printOrder = data => get('print/order',data);

export const printQueue = data => get('print/queue',data);



/**
 * 通知列表
 */
export const noticeLists = data => get('notice/lists',data);

/**
 * 已读
 */
export const noticeRead = data => get('notice/read',data);

/**
 * 删除
 */
export const noticeDelete = data => get('notice/delete',data);