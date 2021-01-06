<template>
  <div>
    <h4>Datasets </h4>

    <b-table striped sortable hover :items="triples" @row-clicked="show" class="pointer"></b-table>

  </div>

</template>

<script>
  const axios = require('axios');
  export default {
    name: 'Instance',
    props: ['agent'],
    data() {
      return {
        search: '',
        triples: [],
        searchValue: '',

      }

    },
    created: function () {
      if (this.$route.params.search !== undefined)
        this.search = this.$route.params.search;
      else
        this.search = this.$route.query.search;
      if (this.$route.params.searchValue !== undefined)
        this.searchValue = this.$route.params.searchValue;
      else
        this.searchValue = this.$route.query.searchValue;


      axios({
          method: 'get',
          url: 'http://localhost:8000/api/datasets?value=' + this.searchValue + "&search=" + this.search,
        }).then((res) => {
          this.triples = res.data.rs;
        })
        .catch((error) => {
          console.log(error)
          // error.response.status Check status code
        }).finally(() => {
          //Perform action in always
        });




    },
    methods: {

      show(record, index) {
        console.log(index);
        let routeData = this.$router.resolve({
          name: 'instance',
          params: {
            uri: record.uri
          },
          query: {
            uri: record.uri
          }
        });
        window.open(routeData.href, '_blank');
      }

   
  }



  }
</script>