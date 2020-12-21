  
import {get,post} from '@/http/http'

/**
 * 获取商品列表
 */
export const goodsLists = data => get('goods/lists',data);

/**
 * 添加商品
 */
export const goodsAdd = data => post('goods/add', data);


/**
 * 编辑商品
 */
export const goodsEdit = data => post('goods/edit', data);

/**
 * 删除商品
 */
export const goodsDel = data => post('goods/delete', data);

/**
 * 获取商品分类
 */
export const cateLists = data => get('category/lists',data);