<template>
  <div>
    <h4>{{uri}}</h4>
    <b-row>
      <b-col cols="9">
        <b-table striped sortable hover :items="triples" @row-clicked="show" class="pointer"></b-table>





        <div v-for="(props, domain) in groups" v-bind:key="props">
          <MetaInput :props="props" :domain="domain">
          </MetaInput>
          <hr>
        </div>



        <div v-show="metaInputs.length != 0">
          <b-button block class="text-center mt-4 mb-4" type="button" size="lg" variant="primary">
            Submit</b-button>
        </div>

      </b-col>
      <b-col>
        Select an ontology:

        <b-form-select v-model="selectedOnto" v-on:change="selectOnto">
          <option v-for="(onto, idx) in ontologies" :key="idx" :value="onto.uri" :title="onto.description"
            v-b-tooltip.hover="{ variant: 'info' }">
            {{ onto.title }}
          </option>
        </b-form-select>


        <div v-show="selectedOnto !== null">
          Select a class:

          <b-form-select v-model="selectedClass" v-on:change="selectClass">
            <option v-for="(cls, idx) in ontoClasses" :key="idx" :value="cls.uri" :title="cls.comment"
              v-b-tooltip.hover="{ variant: 'info' }">
              {{ cls.label }}
            </option>
          </b-form-select>


          <!--
          <b-list-group class="cls-list-group">
            <b-list-group-item href="#" @click="selectClass(cls)" class="flex-column align-items-start"
              v-for="cls in ontoClasses" v-bind:key="cls.uri">
              <div class="d-flex w-100 justify-content-between">
                <h6 class="mb-1" v-b-tooltip.hover="{ variant: 'info' }" v-bind:title="cls.comment">{{ cls.label }}</h6>

              </div>

            </b-list-group-item>
          </b-list-group>
          -->
        </div>

        <div v-show="selectedClass !== null">
          Select a property
          <b-list-group>
            <b-list-group-item v-bind:disabled="prop.disabled" href="#" @click="selectProp(prop, $event)"
              class="flex-column align-items-start" v-for="prop in classProps" v-bind:key="prop.uri">
              <div class="d-flex w-100 justify-content-between">
                <h6 class="mb-1" v-b-tooltip.hover="{ variant: 'info' }" v-bind:title="prop.comment">{{ prop.label }}
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
    props: ['agent'],
    data() {
      return {
        uri: '',
        triples: [],
        ontologies: [],
        classes: [],
        props: [],
        selectedOnto: null,
        selectedClass: null,
        ontoClasses: [],
        classProps: [],
        metaInputs: [],
        count: 0,
        groups: null

      }

    },
    created: function () {
      if (this.$route.params.uri !== undefined)
        this.uri = this.$route.params.uri;
      else
        this.uri = this.$route.query.uri;

      axios({
          method: 'get',
          url: 'http://localhost:8000/api/instance?uri=' + this.uri,
        }).then((res) => {
          this.triples = res.data.rs;


        })
        .catch((error) => {
          console.log(error)
          // error.response.status Check status code
        }).finally(() => {
          //Perform action in always
        });

      axios({
          method: 'get',
          url: '/api/onto',
        }).then((res) => {

          this.ontologies = res.data.rs;
          console.log(res.data.rs);
          this.ontologies.sort(function (a, b) {
            return a.title > b.title;
          });
          //this.selectedOnto = this.ontologies[0].uri;
        })
        .catch((error) => {
          console.log(error)
          // error.response.status Check status code
        }).finally(() => {
          //Perform action in always
        });
      axios({
          method: 'get',
          url: '/api/classes',
        }).then((res) => {

          this.classes = res.data.rs;
          console.log(res.data.rs);

        })
        .catch((error) => {
          console.log(error)
          // error.response.status Check status code
        }).finally(() => {
          //Perform action in always
        });

      axios({
          method: 'get',
          url: '/api/props',
        }).then((res) => {

          this.props = res.data.rs;
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


      selectOnto: function () {
        console.log(this.selectedOnto.uri);
        this.ontoClasses = this.classes.filter(cls => cls.onto === this.selectedOnto);
        this.ontoClasses.sort(function (a, b) {
          return a.title > b.title;
        });
        console.log(this.ontoClasses);
        this.classProps = [];
        this.selectedClass = null;
      },

      selectClass: function () {

        this.classProps = this.props.filter(prop => prop.domain === this.selectedClass);

        this.classProps.sort(function (a, b) {
          return a.label > b.label;
        });
      },

      selectProp: function (prop, event) {

        this.metaInputs.push({
          'idx': this.count,
          'label': prop.label,
          'range': prop.range,
          'comment': prop.comment,
          'domain': prop.domain,
          'domainLabel': prop.domainLabel
        });
        this.count++;

        this.groups = this.groupBy(this.metaInputs, 'domain');
        console.log(this.groups);
        console.log(event.target);
        //event.target.disabled = true;
        prop.disabled = true;

      },

      show(record, index) {
        console.log(index);
        console.log(record.value);
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


      update() {
        this.$emit('updated', this.name, this.email, this.changedUri, this.agent)

      },

      search(input) {
        const url = `/api/agent?name=${encodeURI(input)}`

        return new Promise(resolve => {
          if (input.length < 4) {
            return resolve([])
          }

          fetch(url)
            .then(response => response.json())
            .then(data => {
              // console.log(data);
              resolve(data.rs)
            })
        })
      },

      getResultValue(result) {
        return result.name
      },

      handleSubmit(result) {
        if (result === undefined) {
          this.changedUri = this.tempUri;
          this.email == "";
          this.name = this.$refs.ac.$refs.input.value;

        } else {
          this.changedUri = "<" + result.uri + ">";
          this.email = result.email;
          this.name = result.name;
        }
        this.$emit('updated', this.name, this.email, this.changedUri, this.agent)
      }
    }

  }
</script>