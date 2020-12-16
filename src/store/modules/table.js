const state = {
  //菜单
  tableMenu:{
    table_id:0,//桌台id
    table_name:'',//桌台名称
    action_id:0,//桌台活动ID
    diners_number:0,//就餐人数
    order_id : '',//订单号
    order_amount : '0.00',//订单应付金额
    order_payment_amount : '',//订单支付金额
    order_discount_amount : '',//订单折扣金额
    items : []//订单商品
  }
}

const mutations = {
  SET_ORDER_DATA: (state, order) => {
    state.orderData = order
  },
  CLEAR_ORDER_DATA: (state) => {
    state.orderData = {
      order_id : '',
      order_amount : '0.00',
      order_payment_amount : '',
      order_discount_amount : '',
      items : []
    }
  }
}

const actions = {
  setOrderData({ commit }, order) {
    commit('SET_ORDER_DATA', order)
  },
  clearOrderData({ commit }) {
    commit('CLEAR_ORDER_DATA')
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
