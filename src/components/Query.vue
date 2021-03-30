<template>
  <div>

    <div class="row">

      <h3> Query KB </h3>

    </div>
    SPARQL query:
    <codemirror v-model="sparql" :options="cmOptions"></codemirror>

    <b-button block class="text-center mt-4 mb-4" type="button" v-on:click="query" size="lg" variant="primary">
      Execute</b-button>

    <b-table striped sortable hover :items="triples" @row-clicked="show" class="pointer"></b-table>
  </div>
</template>

<script>
  const axios = require('axios');
  import 'codemirror/mode/turtle/turtle.js'
  export default {
    name: 'UpdateKB',
    props: [],
    data() {
      return {
        sparql: "",
        triples: null,
        cmOptions: {
          lineWrapping: true,
          tabSize: 4,
          mode: 'text/turtle',
          lineNumbers: true,
          line: true,
        }
      }
    },


    created: function () {
      // fill the textarea with a query example 
      this.sparql = `PREFIX dn: <http://melodi.irit.fr/ontologies/dn/>

SELECT ?uri ?name ?desc ?input ?output ?operation 
WHERE
{
?uri a dn:Service.
?uri dn:description ?desc.
?uri dn:name ?name.
?uri dn:hasInputFormat ?if.
?if rdfs:label ?input.
?uri dn:hasOutputFormat ?of.
?of rdfs:label ?output.
?uri dn:performsOperation ?op.
?op rdfs:label ?operation.
}`;
},

    methods: {
      //send the query to django and display the result in a table
      query() {
        let url = this.host + 'api/query?query=' + encodeURIComponent(this.sparql);
       axios({
            method: 'get',
            url: url
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

      // if the cell content is a link (begins http), open a new page when clicked
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