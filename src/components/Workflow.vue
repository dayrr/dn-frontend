<template>
  <div>
    <div class="row">
      <h3> New Workflow </h3>
      Distribution {{this.uri}}
    </div>

    <b-alert variant="success" :show="desc">{{this.selectedOp.desc}}</b-alert>
    <b-form inline>

      Function
      <b-form-select v-model="selectedOp" class="ml-2 mb-2 mr-sm-2 mb-sm-0" @change="setDesc">
        <option v-for="(op, idx) in services" :key="idx"
          :value="{index:idx, uri: op.uri, name:op.name, desc:op.desc, input:op.input, operation:op.operation, output:op.output}"
          :title="op.desc" v-b-tooltip.hover="{ variant: 'info' }">
          {{ op.name }}
        </option>
      </b-form-select> Parameters:
      <input type="text" class="form-control" v-model="params" name="parameters">
      <b-button :disabled="Object.keys(selectedOp).length == 0" class="text-center mt-4 mb-4 ml-2 mr-sm-2" type="button"
        v-on:click="addNode" size="lg" variant="primary">
        Add to workflow</b-button>
      <b-button class="text-center mt-4 mb-4" type="button" v-on:click="run" size="lg" variant="danger">
        Run</b-button>
    </b-form>
    <div ref="network" class="wrapper"> </div>
    <b-alert variant="success" show>
      <ul>
        <li>Service: {{this.selectedNode.title}} </li>
        <li>Description: {{this.selectedNode.desc}} </li>
        <li>Input format: {{this.selectedNode.input}} </li>
        <li>Output format: {{this.selectedNode.output}} </li>
        <li>Operation: {{this.selectedNode.operation}} </li>
        <li>Parameters: {{this.selectedNode.params}} </li>
        <li>Status: {{this.selectedNode.status}}</li>
        <li>Output data: <a v-bind:href="'http://localhost:8000http://melodi.irit.fr/api/download?fn='+ this.selectedNode.outputdata">
            {{this.selectedNode.outputdata}} </a> </li>
      </ul>
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
        services: [],
        services_origin: [],
        dist_format: "",
        dist_url: "",
        params: "",
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
              levelSeparation: 400
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

      if(this.uri ==undefined)
        {
          alert("Please search and select a distribution first!");
          this.$router.push({ name: 'home' });
        }  

      axios({
          method: 'get',
          url: 'http://melodi.irit.fr/api/distribution?uri=' + this.uri
        }).then((res) => {
          this.dist_format = res.data.rs[0].format;
          this.dist_url = res.data.rs[0].download;

          this.nodes = [{
            id: this.nodes.length,
            label: 'Retrieve data' + "\n",
            title: 'Retrieve data' + "\n",
            shape: 'box',

            uri: 'http://melodi.irit.fr/resource/Service/dn_1',
            color: {
              background: "#007bff"
            },

            desc: "Retrieve the file (distribution) from Dataverse: ",
            params: this.dist_url,
            output: this.dist_format,
            input: "None",
            operation: "Parsing",
            status: "Not executed yet"
          }];
          this.data = {
            nodes: this.nodes,
            edges: this.edges,
          };
          this.container = this.$refs.network;
          this.updateGraph();


          axios({
              method: 'get',
              url: 'http://melodi.irit.fr/api/service'
            }).then((res) => {
              this.services = res.data.rs;
              this.services_origin = this.services;
         


            })
            .catch((error) => {
              console.log(error)
              // error.response.status Check status code
            }).finally(() => {
              //Perform action in always
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

      setDesc: function () {
        // this.desc = this.selectedOp.desc;
        this.desc = true;
      },


      addNode: function () {
        //let sh = this.Operations.find(op => op.uri === this.selectedOp);
        this.desc = false;
        this.edges.push({
          from: this.nodes.length - 1,
          to: this.nodes.length,
          label: this.nodes[this.nodes.length - 1].output
        });

        if(this.params=="")
          this.params="None";

        this.nodes.push({
          id: this.nodes.length,
          label: this.selectedOp.name + "\n",
          shape: 'box',
          uri: this.selectedOp.uri,
          color: {
            background: "#007bff"
          },
          title: this.selectedOp.name,
          desc: this.selectedOp.desc,
          input: this.selectedOp.input,
          output: this.selectedOp.output,
          operation: this.selectedOp.operation,
          status: "Not executed yet",
          params: this.params
        });
        this.params = "";
        this.updateGraph();
        let that = this;
       
        this.services = this.services_origin.filter(function (sv) {
          return sv.input == that.selectedOp.output;
        });
      },

      updateGraph() {
        this.network = new Network(this.$refs.network, this.data, this.options);
        let that = this;
        this.network.on("selectNode", function (params) {
          that.selectedNode = that.nodes.find(node => node.id === params.nodes[0]);
        });
      },
      async run() {
        this.desc = false;
        //http://localhost:8000http://melodi.irit.fr/api/work?uri=http://melodi.irit.fr/resource/Service/0&in=
        let inputFile = "";
        for (let i = 0; i < this.nodes.length + 1; i++) {
          this.nodes[i].color.background = "#28a745";
          this.updateGraph();
          //alert(inputFile);
          await axios.get('http://melodi.irit.fr/api/work?uri=' + this.nodes[i].uri + "&in=" + inputFile +
            "&params=" + this.nodes[i].params).then((
            res) => {
            console.log(res);
            this.nodes[i].color.background = "#007bff";
            this.nodes[i].outputdata = res.data.rs.file;
            inputFile = res.data.rs.file;
            this.nodes[i].status = res.data.rs.rs;
            this.updateGraph();

          });
        }
      }
    }
  }
</script>