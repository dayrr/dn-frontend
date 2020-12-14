import onto from '@/services/onto'

export default {
  
  loadOnto() {
    return onto.get(`onto/load`)
              .then(response => response.data)
  },
  fetchOntologies() {
    return onto.get(`onto/`)
              .then(response => response.data)
  },
  postOntologies(payload) {
    return onto.post(`onto/`, payload)
              .then(response => response.data)
  },
  deleteOntologies(msgId) {
    return onto.delete(`onto/${msgId}`)
              .then(response => response.data)
  }
}