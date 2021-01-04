<template>
  <div>
    <h3>Datasets</h3>
     <b-table striped sortable hover :items="ds"></b-table>

    
  </div>
</template>

<script>

const axios = require('axios');

export default {
  name: "Ontologies",
  data() {   
    return {
            ds: []
        }
  },

  created() {
    axios({
            method: 'get',
            url: 'http://melodi.irit.fr/api/all_datasets',            
          }).then((res) => {
            
            this.ds = res.data.rs; 
               
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

