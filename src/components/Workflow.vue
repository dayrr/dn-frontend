<template>
  <div>

    <div class="row">

      <h3> New Workflow </h3>

    </div>


    <b-alert variant="success" :show="desc">{{this.selectedOp.desc}}</b-alert>
    <b-form inline>

      Select a function
      <b-form-select v-model="selectedOp" class="ml-2 mb-2 mr-sm-2 mb-sm-0" @change="setDesc">
        <option v-for="(op, idx) in Operations" :key="idx" :value="{uri: op.uri, name:op.name, desc:op.desc}"
          :title="op.desc" v-b-tooltip.hover="{ variant: 'info' }">
          {{ op.name }}
        </option>
      </b-form-select>

      <b-button class="text-center mt-4 mb-4 mr-sm-2" type="button" v-on:click="addNode" size="lg" variant="primary">
        Add to workflow</b-button>


      <b-button class="text-center mt-4 mb-4" type="button" v-on:click="run" size="lg" variant="danger">
        Run</b-button>
    </b-form>

    <div ref="network" class="wrapper"> </div>
    <b-alert variant="success" show>{{this.selectedNode.title}}
      <br />Status: {{this.selectedNode.status}}
      <br />Output data: <a v-bind:href="'http://localhost:8000/api/download?fn='+ this.selectedNode.output">
        {{this.selectedNode.output}} </a>
    </b-alert>




  </div>
</template>



<script>
  const axios = require('axios');
  import {
    Network
  } from "vis-network/peer";

  export default {
    name: 'Reference',
    props: [],
    data() {
      return {
        uri: '',
        network: null,
        container: null,
        count: 1,
        data: null,
        selectedOp: {},
        selectedNode: {},
        desc: false,
        Operations: [{
            uri: 'http://melodi.irit.fr/resource/Service/1',
            desc: 'Drop a column of the CSV file based on its index. Input: the CSV file, the column index. Output: CSV file. This function was initially created for MeteoFrance synop data processing but can be used for other scenerios.',
            name: 'CSV Drop column'
          },
          {
            uri: 'http://melodi.irit.fr/resource/Service/2',
            desc: 'Caculate average by grouping the first and second columns. Input: the CSV file. Output: CSV file. This function was initially created for MeteoFrance synop data processing.',
            name: 'CSV Caculate average '
          },
          {
            uri: 'http://melodi.irit.fr/resource/Service/3',
            desc: 'Plot the 2nd (X axis) and 3rd columns (Y axis). Input: the CSV file. Output: CSV file.',
            name: 'CSV Plot'
          },
          {
            uri: 'http://melodi.irit.fr/resource/Service/4',
            desc: 'Filter all rows based on the ID value (First column). Input: the CSV file. Output: CSV file.',
            name: 'CSV Row filter'
          }
        ],
        nodes: [

        ],
        edges: [],
        options: {
          edges: {
            font: {
              align: "middle"
            },
            smooth: {
              //type: "dynamic",
              //forceDirection: "horizontal",
              // roundness: 0.0
            },
            arrows: {
              to: {
                enabled: true,
                scaleFactor: 1,
                type: "arrow"
              }
            }
          },
          nodes: {
            borderWidth: 1,
            font: {
              size: 18,
              color: 'white'

            }
          },
          layout: {
            hierarchical: {
              direction: "LR",
              sortMethod: "directed",
              levelSeparation: 300
            }
          },
          interaction: {
            tooltipDelay: 200,
            hover: true
          },
          physics: {
            // enabled: false
          }
        }


      }




    },


    mounted: function () {

      if (this.$route.params.uri !== undefined)
        this.uri = this.$route.params.uri;
      else
        this.uri = this.$route.query.uri;


      this.nodes = [{
        id: this.nodes.length,
        label: 'Retrieve_data' + "\n",
        shape: 'box',
        uri: 'http://melodi.irit.fr/resource/Service/0',
        color: {
          background: "#007bff"
        },
        title: "Retrieve the file (distribution) from Dataverse: " + this.uri
      }];


      this.data = {
        nodes: this.nodes,
        edges: this.edges,
      };

      this.container = this.$refs.network;

      this.updateGraph();




    },
    methods: {

      setDesc: function () {
        // this.desc = this.selectedOp.desc;
        this.desc = true;
      },

      addNode: function () {

        //let sh = this.Operations.find(op => op.uri === this.selectedOp);



        this.edges.push({
          from: this.nodes.length - 1,
          to: this.nodes.length,
          label: "        CSV"
        });

        this.nodes.push({
          id: this.nodes.length,
          label: this.selectedOp.name + "\n",
          shape: 'box',
          uri: this.selectedOp.uri,
          color: {
            background: "#007bff"
          },
          title: this.selectedOp.desc
        });

        console.log(this.nodes);
        console.log(this.edges);

        this.updateGraph();


      },



      updateGraph() {
        this.network = new Network(this.$refs.network, this.data, this.options);
        let that = this;
        this.network.on("selectNode", function (params) {
          that.selectedNode = that.nodes.find(node => node.id === params.nodes[0]);
        });
      },


      async run() {
        //http://localhost:8000/api/work?uri=http://melodi.irit.fr/resource/Service/0&in=
        let inputFile = "";
        for (let i = 0; i < this.nodes.length + 1; i++) {
          this.nodes[i].color.background = "#28a745";
          this.updateGraph();
          //alert(inputFile);
          await axios.get('http://localhost:8000/api/work?uri=' + this.nodes[i].uri + "&in=" + inputFile).then((
            res) => {
              console.log(res);
              this.nodes[i].color.background = "#007bff";
              this.nodes[i].output = res.data.rs.file;
              inputFile = res.data.rs.file;
              this.nodes[i].status = res.data.rs.rs;
              this.updateGraph();

            });
        }











      }



    }



  }
</script>