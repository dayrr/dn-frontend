<template>
  <div>
    <div>
      <h3> New Workflow </h3>

      <div v-show="dist_size==0">

        <b-form-group id="fieldset-22" description="" label="Search a dataset by its title" label-for="input-22"
          state="state" label-cols-sm="1" label-cols-lg="1">
          <autocomplete ref="ac" aria-label="Title" placeholder="Title" :search="search"
            :get-result-value="getResultValue" @submit="handleSubmit">
            <template #result="{ result, props }">
              <li v-bind="props" class="autocomplete-result">
                <div>
                  {{ result.title }}
                </div>
                <div>{{result.description}} </div>
              </li>
            </template>
          </autocomplete>




        </b-form-group>


        <b-form-group id="fieldset-7" description="" label="Select a distribution" label-for="input-7" label-cols-sm="1"
          label-cols-lg="1">
          <b-form-select v-model="distribution" v-on:change="selectDis">
            <option v-for="(cls, idx) in distributions" :key="idx" :value="cls.uri" :title="cls.download"
              v-b-tooltip.hover="{ variant: 'info' }">
              {{ cls.label}}
            </option>
          </b-form-select>
        </b-form-group>

      </div>
      <div v-show="dist_size>0">

        For the distribution <b>{{this.uri.substring(this.uri.lastIndexOf("/")+1)}} </b> of the dataset
        <b>"{{this.title}}"</b>, format: <b>{{this.dist_format}}</b>, size: <b>{{this.dist_size}} bytes</b>
      </div>
    </div>

    <div v-show="dist_size>0">

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
        <b-button :disabled="Object.keys(selectedOp).length == 0" class="text-center mt-4 mb-4 ml-2 mr-sm-2"
          type="button" v-on:click="addNode" size="lg" variant="primary">
          Add to workflow</b-button>
        <b-button class="text-center mt-4 mb-4" type="button" v-on:click="run" size="lg" variant="danger">
          Run</b-button>
      </b-form>
      <div ref="network" class="wrapper"> </div>
      <b-alert variant="success" :show="bottomDesc">

        <ul>
          <li>Service: {{this.selectedNode.title}} </li>
          <li>Description: {{this.selectedNode.desc}} </li>
          <li>Input format: {{this.selectedNode.input}} </li>
          <li>Output format: {{this.selectedNode.output}} </li>
          <li>Operation: {{this.selectedNode.operation}} </li>
          <li>Parameters: {{this.selectedNode.params}} </li>
          <li>Status: {{this.selectedNode.status}}</li>
          <li>Output data: <a v-bind:href="this.host + 'api/download?fn='+ this.selectedNode.outputdata">
              <b> {{this.selectedNode.outputdata}} </b> </a> </li>
          <img v-if="image" v-bind:src="this.host + 'api/download?fn='+ this.selectedNode.outputdata" />
        </ul>
      </b-alert>
    </div>
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
        title: '',
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
        bottomDesc: false,
        distributions: [],
        distribution: {},
        dist_size: 0,
        image: false,
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
      else {
        this.uri = '';
        return;
      }
      this.loadServices();


    },

    methods: {

      loadServices() {
        axios({
            method: 'get',
            url: this.host + 'api/distribution?uri=' + this.uri
          }).then((res) => {
            this.dist_format = res.data.rs[0].format;
            this.dist_url = res.data.rs[0].download;
            this.title = res.data.rs[0].title;
            this.dist_size = res.data.rs[0].size;

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
                url: this.host + 'api/service'
              }).then((res) => {
                this.services_origin = res.data.rs;
                let that = this;
                this.services = this.services_origin.filter(function (sv) {
                  return sv.input == that.dist_format;
                });



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

      selectDis: function () {
        let dis = this.distributions.filter(cls => cls.uri === this.distribution)[0];
        this.dist_format = dis.format;
        this.dist_url = dis.download;
        this.dist_size = dis.size;
        this.uri = dis.uri;
        this.loadServices();

      },






      search(input) {
        //this.host + 'api/datasets?value=' + this.searchValue + "&search=" + this.search,
        let url = this.host + 'api/datasets?search=title&value='+ encodeURI(input)

        return new Promise(resolve => {
          if (input.length < 4) {
            return resolve([])
          }

          fetch(url)
            .then(response => response.json())
            .then(data => {
              console.log(data);
              resolve(data.rs)
            })
        })
      },

      getResultValue(result) {

        return result.title;
      },

      handleSubmit(result) {
        if (result !== undefined) {
          this.title = result.title;
          this.uri = result.uri;
          axios({
              method: 'get',
              url: this.host + 'api/distributions?uri=' + this.uri,
            }).then((res) => {
              this.distributions = res.data.rs;


            })
            .catch((error) => {
              console.log(error)
              // error.response.status Check status code
            }).finally(() => {
              //Perform action in always
            });


        }


      },



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

        if (this.params == "")
          this.params = "None";

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
          if (that.selectedNode.outputdata.includes(".PNG"))
            that.image = true;
          else
            that.image = false;
          that.bottomDesc = true;
        });





      },
      async run() {
        this.desc = false;
        //http://localhost:8000/this.host + 'api/work?uri=http://melodi.irit.fr/resource/Service/0&in=
        let inputFile = "";
        for (let i = 0; i < this.nodes.length + 1; i++) {
          this.nodes[i].color.background = "#28a745";
          this.updateGraph();
          //alert(inputFile);
          await axios.get(this.host + 'api/work?uri=' + this.nodes[i].uri + "&in=" + inputFile +
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