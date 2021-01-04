<template>
  <div>
    <h3>Publications</h3>
     <b-table striped sortable hover :items="pubs"></b-table>

    
  </div>
</template>

<script>

const axios = require('axios');

export default {
  name: "Ontologies",
  data() {   
    return {
            pubs: []
        }
  },

  created() {
    axios({
            method: 'get',
            url: 'http://melodi.irit.fr/api/pubs',            
          }).then((res) => {
            
            this.pubs = res.data.rs; 
               
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

