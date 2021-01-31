<template>
  <div>
    <h3> Import metadata</h3>
    <b-form-group label="From">
      <b-form-select v-model="site">
            <option v-for="(cls, idx) in sites" :key="idx" :value="cls.name" :title="cls.type"
              v-b-tooltip.hover="{ variant: 'info' }">
              {{ cls.name}}
            </option>
          </b-form-select>
        </b-form-group>

    



    <div style="width:600px; margin:auto;">
      <b-form-group id="fieldset-1"
        description="Search for datasets and then select the dataset metadata to be imported" label-for="input-1"
        label-cols-sm="1" label-cols-lg="1">
        <b-input-group>
          <b-form-input size="sm" class="mr-sm-2" v-model="searchText" placeholder="Search"></b-form-input>
          <b-button size="sm" class="my-2 my-sm-0" v-on:click="searchTitle" type="button">Search</b-button>
        </b-input-group>
      </b-form-group>
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
        tbl: [{
          title: "No data"
        }],
        cls: '',
        site: 'dataverse.ird.fr',
        searchText: '',
        triples: [],
        sites: []        
      }
    },


    methods: {
      searchTitle() {
        let site = this.sites.find(record => record.name === this.site);
        console.log(site);
        let url = this.host + 'api/dataset?value=' + this.searchText + "&search=title";
        this.tbl = [];
        console.log(site);

        axios({
            method: 'get',
            url: site.url + this.searchText
          }).then((res) => {
            let that = this;
            if (res.data.data.length === 0) {
              this.tbl = [{
                title: "No data"
              }];
              return;
            }
            if (site.type!="dataverse")
              res.data.data.forEach(function (ds) {
                let d = {};
                d.id = ds.id;
                d.title = ds.title;
                d.description = ds.description;
                d.issued = ds.last_modified;
                that.tbl.push(d);

              });
            else
              res.data.data.items.forEach(function (ds) {
                let d = {};
                d.id = ds.global_id;
                d.title = ds.name;
                d.description = ds.description;
                d.issued = ds.published_at;
                that.tbl.push(d);

              });




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
          message: 'Would you like to import metadata for the dataset: \n' + record.title + '\n from ' + this.site +
            '?',
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
                  url: this.host + 'api/import-meta?id=' + record.id + '&site=' + this.site,
                }).then((res) => {

                  if (res.data === "ok") {
                    alert("Metadata imported!");
                    let url = this.host + 'api/dataset?value=' + this.searchText + "&search=title";
                    this.tbl = [];
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
                  } else
                    alert("Metadata importation failed!");

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

      let url = this.host + 'api/sites';
      axios({
          method: 'get',
          url: url,
        }).then((res) => {

          this.sites = res.data;
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