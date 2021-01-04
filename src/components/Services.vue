<template>
  <div>
    <h3>Services</h3>
     <b-table striped sortable hover :items="services"></b-table>

    
  </div>
</template>

<script>

const axios = require('axios');

export default {
  name: "Ontologies",
  data() {   
    return {
            services: []
        }
  },

  created() {
    axios({
            method: 'get',
            url: 'http://melodi.irit.fr/api/services',            
          }).then((res) => {
            
            this.services = res.data.rs; 
               
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

