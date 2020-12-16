
import { storeInfo } from '@/api/base'

const state = {
  store: {
    store_id:'',
    store_name: '',
    store_logo: ''
  }
}
const mutations = {
  SET_STORE_ID: (state, store_id) => {
    state.store.store_id = store_id
  },
  SET_STORE_NAME: (state, store_name) => {
    state.store.store_name = store_name
  },
  SET_STORE_LOGO: (state, store_logo) => {
    state.store.store_logo = store_logo
  },
  CLEAR_STORE_ID: (state) => {
    state.store.store_id = 0
  },
  CLEAR_STORE_NAME: (state) => {
    state.store.store_name = ''
  },
  CLEAR_STORE_LOGO: (state) => {
    state.store.store_logo = ''
  }
}

const actions = {
  // get store info
  storeInfo({ commit, state }) {
    return new Promise((resolve, reject) => {

      storeInfo().then(response => {
        const data = response.data
        if( response.status === 200 ){
         
      
          const { store_id, store_name, store_logo } = data
   
          commit('SET_STORE_ID', store_id)
          commit('SET_STORE_NAME', store_name)
          commit('SET_STORE_LOGO', store_logo)
        } else {
          reject('店铺信息有误')
        }

        resolve(data);
      }).catch(error => {
        reject(error)
      })
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
