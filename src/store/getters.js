const getters = {
  shop:state => state.shop.store,
  user:state => state.user.user,
  orderData: state => state.order.orderData,
  errorLogs: state => state.errorLog.logs,
  msg:state => state.msg,
}
export default getters
