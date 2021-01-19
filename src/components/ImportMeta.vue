<template>
  <div>
    <h3> Import metadata from data.gouv.fr</h3>
    <div style="width:600px; margin:auto;">
      <b-input-group>
        <b-form-input size="sm" class="mr-sm-2" v-model="searchText" placeholder="Search"></b-form-input>
        <b-button size="sm" class="my-2 my-sm-0" v-on:click="searchTitle" type="button">Search</b-button>
      </b-input-group>
    </div> <br />
    <b-table id="harvest" striped sticky-header sortable hover :items="tbl" @row-clicked="importMeta" class="pointer">
    </b-table>


    <b-alert variant="success" :show="triples.length>0">
      Existing Information
      <b-table striped sticky-header sortable hover :items="triples"></b-table>
    </b-alert>


  </div>
</template>

<script>
  const axios = require('axios');

  export default {
    name: "ImportMeta",
    data() {
      return {
        tbl: [],
        cls: '',
        searchText: '',
        triples: []
      }
    },


    methods: {
      searchTitle() {
        let url = this.host + 'api/dataset?value=' + this.searchText + "&search=title";
        this.tbl = [];

        axios({
            method: 'get',
            url: 'https://www.data.gouv.fr/api/1/datasets/?page=0&page_size=20&q=' + this.searchText
          }).then((res) => {
            let that = this;
            if (res.data.data.length === 0) {
              this.tbl = [{
                title: "No data"
              }];
              return;
            }
            res.data.data.forEach(function (ds) {
              let d = {};
              d.id = ds.id;
              d.title = ds.title;
              d.description = ds.description;
              d.issued = ds.last_modified;
              that.tbl.push(d);

            });

            console.log(res.data.data);

          })
          .catch((error) => {
            console.log(error)
            // error.response.status Check status code
          }).finally(() => {
            //Perform action in always
          });



        axios({
            method: 'get',
            url: url
          }).then((res) => {
            this.triples = [];
            let that = this;

            res.data.rs.forEach(function (ds) {
              let d = {};
              //d.uri = ds.uri;
              d.title = ds.title;
              d.description = ds.description;
              d.issued = ds.issued;
              that.triples.push(d);

            });


          })
          .catch((error) => {
            console.log(error)
            // error.response.status Check status code
          }).finally(() => {
            //Perform action in always
          });
      },

      importMeta(record, index) {
        this.$confirm({
          message: 'Would you like to import metadata for the dataset: \n' + record.title + '</b>?',
          button: {
            no: 'No',
            yes: 'Yes'
          },
          /**
           * Callback Function
           * @param {Boolean} confirm 
           */
          callback: confirm => {
            if (confirm) {
              axios({
                  method: 'get',
                  url: this.host + 'api/import-meta?id=' + record.id,
                }).then((res) => {

                  alert(res.data.rs);

                })
                .catch((error) => {
                  console.log(error)
                  // error.response.status Check status code
                }).finally(() => {
                  //Perform action in always
                });
            }
          }
        });

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

    },
  };
</script>