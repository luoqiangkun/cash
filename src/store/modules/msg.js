const state = {
  visible: false
}

const mutations = {
  TOGGLE_VISIBLE: (state) => {
    state.visible = !state.visible
  }
}

const actions = {
  toggleVisible({ commit }) {
    commit('TOGGLE_VISIBLE')
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
