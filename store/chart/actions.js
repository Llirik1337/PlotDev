export default {
  updateTop({ commit }, value) {
    try {
      commit('setTop', value)
    } catch (e) {
      console.log(e)
    }
  },
  updateBottom({ commit }, value) {
    try {
      commit('setTop', value)
    } catch (e) {
      console.log(e)
    }
  },
  updateAverage({ commit }, value) {
    try {
      commit('setTop', value)
    } catch (e) {
      console.log(e)
    }
  },
}
