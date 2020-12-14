import ontologieservice from '../../services/ontologyService'

const state = {
  ontologies: []
}

const getters = {
  ontologies: state => {
    return state.ontologies
  }
}

const actions = {
  getontologies ({ commit }) {
    ontologieservice.fetchOntologies()
    .then(ontologies => {
      commit('setontologies', ontologies)
    })
  },
  addontology({ commit }, ontology) {
    ontologieservice.postOntologies(ontology)
    .then(() => {
      commit('addontology', ontology)
    })
  },
  deleteontology( { commit }, msgId) {
    ontologieservice.deleteOntologies(msgId)
    commit('deleteontology', msgId)
  }
}




const mutations = {
  setontologies (state, ontologies) {
    state.ontologies = ontologies
  },
  addontology(state, ontology) {
    state.ontologies.push(ontology)
  },
  deleteontology(state, msgId) {
    state.ontologies = state.ontologies.filter(obj => obj.pk !== msgId)
  }
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}