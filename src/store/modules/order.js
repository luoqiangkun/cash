import { tableContent } from '@/api/base'
const state = {
  orderData:{
    table_id:0,//桌台id
    table_name:'',//桌台名称
    table_state:0,
    action_id:0,//桌台活动ID
    diners_number:0,//就餐人数
    order_id : '',//订单号
    order_amount : '0.00',//订单应付金额
    order_payment_amount : '',//订单支付金额
    order_discount_amount : '',//订单折扣金额
    order_remark : '',//订单备注
    items : []//订单商品
  }
}

const mutations = {
  GET_ORDER_DATA: (state, table_id) => {
    tableContent({table_id:table_id}).then(res => {
      const { table,action,order } = res.data;

      let orderData = {};
      
      if( table ){
        orderData.table_id = table.table_id;
        orderData.table_state = table.table_state;
        orderData.table_name = table.table_name;
      }

      if( action ){
        orderData.action_id = action.action_id;
        orderData.diners_number = action.diners_number;
      }

      if( order ){
        Object.assign(orderData, order);
      }
     
      state.orderData = orderData
    });
  },
  SET_ORDER_DATA: (state, order) => {
    state.orderData = order
  },
  CLEAR_ORDER_DATA: (state) => {
    state.orderData = {
      table_id:0,
      table_name:'',
      table_state:0,
      action_id:0,
      diners_number:0,
      order_id : '',
      order_amount : '0.00',
      order_payment_amount : '',
      order_discount_amount : '',
      order_remark : '',//订单备注
      items : []
    }
  },
  SET_ORDER_TABLE_STATE: (state, table_state) => {
    state.orderData.table_state = table_state
  },
  SET_ORDER_REMARK: (state, order_remark) => {
    state.orderData.order_remark = order_remark
  },
  SET_ORDER_AMOUNT: (state, order_payment_amount) => {
    state.orderData.order_payment_amount = order_payment_amount
  },
}

const actions = {
  getOrderData({ commit }, table_id) {
    commit('GET_ORDER_DATA', table_id)
  },
  setOrderData({ commit }, order) {
    commit('SET_ORDER_DATA', order)
  },
  clearOrderData({ commit }) {
    commit('CLEAR_ORDER_DATA')
  },
  setOrderTableState({ commit },table_state ){
    commit('SET_ORDER_TABLE_STATE', table_state)
  },
  setOrderRemark({ commit },order_remark ){
    commit('SET_ORDER_REMARK', order_remark)
  },
  setOrderAmount({ commit },order_payment_amount ){
    commit('SET_ORDER_AMOUNT', order_payment_amount)
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
