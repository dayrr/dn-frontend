<template>
  <div>

    <div class="row">

      <h3> Update KB </h3>

    </div>
    RDF data in N-Triples format:
    <codemirror v-model="rdf" :options="cmOptions"></codemirror>

    <b-button block class="text-center mt-4 mb-4" type="button" v-on:click="submitPub" size="lg" variant="primary">
      Update KB</b-button>
  </div>
</template>

<script>
import 'codemirror/mode/turtle/turtle.js'
  export default {
    name: 'UpdateKB',
    props: [],
    data() {
      return {
        rdf: null,
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
      
    },
    
    methods: {
     
    }
  }
</script>