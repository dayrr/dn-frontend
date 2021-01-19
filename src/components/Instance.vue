<template>
  <div>



    <b-row>
      <b-col cols="9">
        <h4><a target="_blank" v-bind:href="graphdb+'resource?uri='+uri"> {{uri}} </a> <div v-show="distribution">
            <b-button class="text-center mt-4 mb-4" type="button" size="lg" v-on:click="downloadDis" variant="primary">
              Download distribution</b-button>
            <b-button class="text-center mt-4 mb-4" type="button" size="lg" v-on:click="addWorkflow" variant="primary">
              Create a workflow</b-button>
          </div>
        </h4>
        <div class="accordion" role="tablist">

          <b-collapse id="accordion-1" visible accordion="my-accordion" role="tabpanel">

            <b-table striped sortable hover :items="triples" @row-clicked="show" class="pointer"></b-table>
          </b-collapse>
          <b-button block v-b-toggle.accordion-1 variant="info">Show/Hide triples</b-button>
        </div>




        <div v-show="metaInputs.length != 0">
          <h4> New metadata </h4>
          <MetaInput @updated="updateMeta" v-for="metaInput in metaInputs" v-bind:key="metaInput.idx"
            :metaInput="metaInput">
          </MetaInput>

          <b-button block class="text-center mt-4 mb-4" v-on:click="submit" type="button" size="lg" variant="primary">
            Submit</b-button>
        </div>

      </b-col>
      <b-col>
        <h4> Add metadata </h4>

        Select a class:
        <b-form-select v-model="selectedClass" v-on:change="selectClass">
          <option v-for="(cls, idx) in classes" :key="idx" :value="cls.uri" :title="cls.comment"
            v-b-tooltip.hover="{ variant: 'info' }">
            {{ cls.label}} ({{cls.onto}})
          </option>
        </b-form-select>

        <div v-show="selectedClass !== null">
          Select a property
          <b-list-group>
            <b-list-group-item v-bind:disabled="prop.disabled" href="#" @click="selectProp(prop, $event)"
              class="flex-column align-items-start" v-for="prop in props" v-bind:key="prop.uri">
              <div class="d-flex w-100 justify-content-between">
                <h6 class="mb-1" v-b-tooltip.hover="{ variant: 'info' }" v-bind:title="prop.comment + ' '+ prop.uri">
                  {{ prop.label }}
                </h6>

              </div>

            </b-list-group-item>
          </b-list-group>
        </div>

      </b-col>

    </b-row>
  </div>

</template>

<script>
  const axios = require('axios');
  export default {
    name: 'Instance',
    data() {
      return {
        uri: '',
        triples: [],
        classes: [],
        props: [],
        selectedOnto: null,
        selectedClass: null,
        metaInputs: [],
        count: 0,
        groups: null,
        distribution: false,
        download: '',
        format: ''

      }

    },
    mounted: function () {
      if (this.$route.params.uri !== undefined)
        this.uri = this.$route.params.uri;
      else
        this.uri = this.$route.query.uri;


      this.loadTriples();

      let url = this.host + 'api/props?uri=' + this.uri;
      axios({
          method: 'get',
          url: this.host + 'api/props?uri=' + this.uri,
        }).then((res) => {

          this.props = res.data.rs;
          this.classes = res.data.rs;
          this.props.forEach(function (prop) {
            prop.disabled = false;
          });

        })
        .catch((error) => {
          console.log(error)
          // error.response.status Check status code
        }).finally(() => {
          //Perform action in always
        });





    },

    methods: {

      loadTriples: function () {  
        let url = this.host + 'api/instance?uri=' + this.uri;
        axios({
            method: 'get',
            url: url,
          }).then((res) => {
            this.triples = res.data.rs;
            if (this.uri.includes("Distribution"))
              for (let i = 0; i < this.triples.length; i++) {
                //console.log(this.triples[i]);
                if (this.triples[i].property.includes("download")) {
                  this.download = this.triples[i].value;
                  this.format =
                    this.distribution = true;
                }
                //console.log(this.triples[i]);
                if (this.triples[i].property.includes("hasFormat")) {
                  this.format = this.triples[i].value;
                }

              }


          })
          .catch((error) => {
            console.log(error)
            // error.response.status Check status code
          }).finally(() => {
            //Perform action in always
          });

      },

      submit: function () {

        axios({
            method: 'post',
            url: this.host + 'api/new-meta',
            data: {
              uri: this.uri,
              meta: this.metaInputs
            }
          }).then((res) => {
            if (res.data.result === "ok")
              alert("Metadata added");
              this.metaInputs = [];
              this.loadTriples();

          })
          .catch((error) => {
            alert("Metadata addition failed! Error: " + error);
          }).finally(() => {
            //Perform action in always
          });

      },

      updateMeta: function (value, metaInput) {
        metaInput.value = value;
      },

      addWorkflow: function () {
        this.$router.push({
          name: 'work',
          params: {
            uri: this.uri,
            format: this.format,
            url: this.download
          }
        });
      },

      downloadDis: function () {
        this.$router.push({
          name: 'work',
          params: {
            uri: this.uri,
            format: this.format,
            url: this.download
          }
        });
      },


      groupBy: function (array, key) {
        const result = {}
        array.forEach(item => {
          if (!result[item[key]]) {
            result[item[key]] = []
          }
          result[item[key]].push(item)
        })
        return result
      },



      selectClass: function () {

        this.props = this.classes.filter(cls => cls.uri === this.selectedClass)[0].props;

        this.props.sort(function (a, b) {
          return a.label > b.label;
        });
      },

      selectProp: function (prop, event) {

        this.metaInputs.push({
          'idx': this.count,
          'label': prop.label,
          'uri': prop.uri,
          'range': prop.range,
          'comment': prop.comment,
          'value': ''
        });
        this.count++;

        //this.groups = this.groupBy(this.metaInputs, 'domain');

        //event.target.disabled = true;
        // prop.disabled = true;

      },

      show(record, index) {
        console.log(index);
        //console.log(record.value);

        if (record.value.includes("http")) {
          let routeData = this.$router.resolve({
            name: 'instance',
            params: {
              uri: record.value
            },
            query: {
              uri: record.value
            }
          });
          window.open(routeData.href, '_blank');
        }

      },


    }

  }
</script>