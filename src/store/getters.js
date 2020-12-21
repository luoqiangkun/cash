const getters = {
  shop:state => state.shop.store,
  user:state => state.user.user,
  orderData: state => state.order.orderData,
  errorLogs: state => state.errorLog.logs,
  msg:state => state.msg,
  auth:state => state.auth,
  profile:state => state.profile,
}
export default getters
