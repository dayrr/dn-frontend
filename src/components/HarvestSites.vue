<template>
  <div>
    <h3>Harvesting sites</h3>
     <b-table striped sortable hover :items="sites"></b-table>
    <p v-if="sites.length === 0">No sites</p>
    
  </div>
</template>

<script>

const axios = require('axios');

export default {
  name: "Sites",
  data() {   
    return {
            sites: []
        }
  },

  created() {
    let url = this.host + 'api/sites';
    axios({
            method: 'get',
            url: url,            
          }).then((res) => {
            
            this.sites = res.data.map(u => ({name: u.name, type: u.type}));
        
               
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
