<template>
  <div>
    <h3>Claims</h3>
     <b-table striped sortable hover :items="claims"></b-table>

    
  </div>
</template>

<script>

const axios = require('axios');

export default {
  name: "Ontologies",
  data() {   
    return {
            claims: []
        }
  },

  created() {
    axios({
            method: 'get',
            url: 'http://melodi.irit.fr/api/claims',            
          }).then((res) => {
            
            this.claims = res.data.rs; 
               
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

