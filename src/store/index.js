import Vue from 'vue'
import Vuex from 'vuex'
import messages from './modules/messages'
import ontologies from './modules/ontologies'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    messages, ontologies
  }
})