<template>
  <div>
    <h3>Imported ontologies</h3>
     <b-table striped sortable hover :items="ontologies"></b-table>
    <p v-if="ontologies.length === 0">No Ontologies</p>
    
  </div>
</template>

<script>

const axios = require('axios');

export default {
  name: "Ontologies",
  data() {   
    return {
            ontologies: []
        }
  },

  created() {
    axios({
            method: 'get',
            url: 'http://localhost:8000/api/onto',            
          }).then((res) => {
            
            this.ontologies = res.data.rs; 
               
          })
          .catch((error) => {
            console.log(error)
            // error.response.status Check status code
          }).finally(() => {
            //Perform action in always
          });
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
hr {
  max-width: 100%;
}

.msg {
  margin: 0 auto;
  max-width: 30%;
  text-align: left;
  border-bottom: 1px solid #ccc;
  padding: 1rem;
}

.msg-index {
  color: #ccc;
  font-size: 0.8rem;
  /* margin-bottom: 0; */
}

img {
  width: 250px;
  padding-top: 50px;
  padding-bottom: 50px;
}

</style>
