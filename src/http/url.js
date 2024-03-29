const SITEURL = SiteUrl;
const WAPSITEURL = WapSiteUrl;
const APIURL = ApiUrl + '/catering.php';
const VERSION = 'v1';
const SYSURL = {
		'store/info' :APIURL + '?ctl=Store_Base&met=info&typ=json',
		'store/config/info' : APIURL + '?ctl=Store_Config&met=info&typ=json',
		'goods/lists' :APIURL + '?ctl=Goods_Base&met=lists&typ=json',
		'goods/add'  :APIURL + '?ctl=Goods_Base&met=save&typ=json',
		'goods/edit' :APIURL + '?ctl=Goods_Base&met=save&typ=json',
		'goods/delete' : APIURL + '?ctl=Goods_Base&met=remove&typ=json',
		'category/lists' : APIURL + '?ctl=Goods_Category&met=lists&typ=json',
		'category/add' : APIURL + '?ctl=Goods_Category&met=add&typ=json',
		'category/edit' : APIURL + '?ctl=Goods_Category&met=edit&typ=json',
		'category/delete' : APIURL + '?ctl=Goods_Category&met=remove&typ=json',
		'order/lists' : APIURL + '?ctl=Order_Base&met=lists&typ=json',
		'order/detail' : APIURL + '?ctl=Order_Base&met=detail&typ=json',
		'order/add' : APIURL + '?ctl=Order_Base&met=addOrder&typ=json',
		'order/add_item' : APIURL + '?ctl=Order_Base&met=addItem&typ=json',
		'order/delete_item' : APIURL + '?ctl=Order_Base&met=removeItem&typ=json',
		'order/change_item' : APIURL + '?ctl=Order_Base&met=changeItemQuantity&typ=json',
		'order/status' : APIURL + '?ctl=Order_Base&met=status&typ=json',
		'order/modify_status' : APIURL + '?ctl=Order_Base&met=modifyOrderStatus&typ=json',
		'order/modify_remark' : APIURL + '?ctl=Order_Base&met=modifyOrderRemark&typ=json',
		'order/modify_amount' : APIURL + '?ctl=Order_Base&met=modifyOrderAmount&typ=json',
		'order/modify_adjust' : APIURL + '?ctl=Order_Base&met=modifyAdjustFee&typ=json',
		'return/lists' :APIURL + '?ctl=Order_Return&met=lists&typ=json',
		'return/detail'  :APIURL + '?ctl=Order_Return&met=detail&typ=json',
		'return/modify_state'  :APIURL + '?ctl=Order_Return&met=modifyReturnState&typ=json',
		'shipping/add'  :APIURL + '?ctl=Order_Shipping&met=add&typ=json',
		'shipping/edit' :APIURL + '?ctl=Order_Shipping&met=edit&typ=json',
		'table/lists' : APIURL + '?ctl=Table_Base&met=lists&typ=json',
		'table/add' : APIURL + '?ctl=Table_Base&met=add&typ=json',
		'table/edit' : APIURL + '?ctl=Table_Base&met=edit&typ=json',
		'table/delete' : APIURL + '?ctl=Table_Base&met=remove&typ=json',
		'table/state' : APIURL + '?ctl=Table_Base&met=state&typ=json',
		'table/content' : APIURL + '?ctl=Table_Base&met=content&typ=json',
		'table/type/lists' : APIURL + '?ctl=Table_Type&met=lists&typ=json',
		'table/type/add' : APIURL + '?ctl=Table_Type&met=add&typ=json',
		'table/type/edit' : APIURL + '?ctl=Table_Type&met=edit&typ=json',
		'table/type/delete' : APIURL + '?ctl=Table_Type&met=remove&typ=json',
		'table/action/add' : APIURL + '?ctl=Table_Action&met=add&typ=json',
		'waiter/lists' :APIURL + '?ctl=Store_Waiter&met=lists&typ=json',
		'info':APIURL + '?ctl=Index&met=info&typ=json',
		'login':APIURL +'?ctl=Login&met=login&client=cash&typ=json',
		'logout':APIURL + '?ctl=Login&met=logout&typ=json',
		'register': APIURL + '?ctl=Login&met=register&typ=json',
		'queue/lists' : APIURL + '?ctl=Queue&met=lists&typ=json',
		'queue/add' : APIURL + '?ctl=Queue&met=add&typ=json',
		'queue/edit' : APIURL + '?ctl=Queue&met=edit&typ=json',
		'pay/pay' : APIURL + '?ctl=Pay&met=pay&typ=json',
		'micropay' : APIURL + '?ctl=Pay&met=pay&typ=e',
		'analytics/order' : APIURL + '?ctl=Analytics&met=getAnnualSales&typ=json',
		'analytics/goods' : APIURL + '?ctl=Analytics&met=getGoodsSales&typ=json',
		'analytics/table' : APIURL + '?ctl=Analytics&met=getTableData&typ=json',
		'print/order' : APIURL + '?ctl=Print&met=printOrder&typ=json',
		'print/queue' : APIURL + '?ctl=Print&met=printQueue&typ=json',
		'notice/lists' : APIURL + '?ctl=Notice_Base&met=lists&typ=json',
		'notice/read' : APIURL + '?ctl=Notice_Base&met=read&typ=json',
		'notice/delete' : APIURL + '?ctl=Notice_Base&met=delete&typ=json',
	}

	export {
		SITEURL,
		WAPSITEURL,
		APIURL,
		VERSION,
		SYSURL
	}
