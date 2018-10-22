import vue from 'vue'
import vuex from 'vuex'

import actions from './actions/index'
import state from './states/index'



vue.use(vuex);

export default new vuex.Store({
  state:state,
  actions:actions,
})



