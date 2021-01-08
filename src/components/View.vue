<template>
  <div>
    <h3>{{cls.toUpperCase()}}</h3>
    <b-table striped sortable hover :items="tbl" @row-clicked="show" class="pointer"></b-table>


  </div>
</template>

<script>
  const axios = require('axios');

  export default {
    name: "View",
    data() {
      return {
        tbl: [],
        cls: ''
      }
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
    },

    watch: {
      $route(to, from) {

        if (to !== from) {
          this.cls = this.$route.query.cls;
          axios({
              method: 'get',
              url: this.host + 'api/' + this.cls,
            }).then((res) => {

              this.tbl = res.data.rs;

            })
            .catch((error) => {
              console.log(error)
              // error.response.status Check status code
            }).finally(() => {
              //Perform action in always
            });
        }
      }
    },

    mounted() {
      this.cls = this.$route.query.cls;
      axios({
          method: 'get',
          url: this.host + 'api/' + this.cls,
        }).then((res) => {

          this.tbl = res.data.rs;

        })
        .catch((error) => {
          console.log(error)
          // error.response.status Check status code
        }).finally(() => {
          //Perform action in always
        });

    },
  };
</script>