<template>
  <div>


    <b-row v-if="!view" v-show="!view">
      <h3>{{dataset.title}}
        <b-button class="text-center mt-4 mb-4" type="button" size="sm" v-on:click="showTriples" variant="primary">
          Triples mode</b-button>
      </h3>
    </b-row>
    <b-row v-if="!view" v-show="!view">

      <b-list-group>
        <b-list-group-item v-show="(dataset.description!='') && dataset.description!=null">Description:
          {{dataset.description}}</b-list-group-item>
        <b-list-group-item>Identifier: {{dataset.identifier}}</b-list-group-item>
        <b-list-group-item target="_blank" v-bind:href="dataset.page">Landing page: {{dataset.page}}</b-list-group-item>
        <b-list-group-item>Subject: {{dataset.subject}}</b-list-group-item>
        <b-list-group-item>Publication Date: {{dataset.issued}}</b-list-group-item>

        <b-list-group-item v-show="(dataset.creators!== undefined) && (dataset.creators.length!=0)">Authors:
          <b-list-group v-for="(author, index) in dataset.creators" :key="index">
            <b-list-group-item target="_blank" v-bind:href="author.uri">{{author.name}}</b-list-group-item>
          </b-list-group>
        </b-list-group-item>

        <b-list-group-item v-show="(dataset.depositors!== undefined) && (dataset.depositors.length!=0)">Depositors:
          <b-list-group v-for="(depositor, index) in dataset.depositors" :key="index">
            <b-list-group-item target="_blank" v-bind:href="depositor.uri">{{depositor.name}}</b-list-group-item>
          </b-list-group>
        </b-list-group-item>

        <b-list-group-item v-show="(dataset.publishers!== undefined) && (dataset.publishers.length!=0)">Publisers:
          <b-list-group v-for="(publisher, index) in dataset.publishers" :key="index">
            <b-list-group-item target="_blank" v-bind:href="publisher.uri">{{publisher.name}}</b-list-group-item>
          </b-list-group>
        </b-list-group-item>


        <b-list-group-item v-show="(dataset.keywords!== undefined) && (dataset.keywords.length!=0)">Keywords:
          <b-list-group v-for="(key, index) in dataset.keywords" :key="index">
            <b-list-group-item target="_blank" v-bind:href="'#/datasets?search=keyword&searchValue='+key.keyword">
              {{key.keyword}}</b-list-group-item>
          </b-list-group>
        </b-list-group-item>

        <b-list-group-item v-show="(dataset.note!='') && dataset.note!=null">Note: {{dataset.note}}</b-list-group-item>
        <b-list-group-item v-show="(dataset.publication!== undefined) && (dataset.publication.length!=0)">Related
          publications:

          <b-list-group v-for="(pub, index) in dataset.publication" :key="index">
            <b-list-group-item target="_blank" v-bind:href="pub.uri">{{pub.DOI}} - {{pub.title}}. {{pub.issued}}
            </b-list-group-item>
          </b-list-group>

        </b-list-group-item>

        <b-list-group-item v-show="(dataset.geom!='') && dataset.geom!=null">
          Localisation <div id="map" class="mapds"></div>
        </b-list-group-item>

        <b-list-group-item v-show="(dataset.dists!== undefined) && (dataset.dists.length!=0)">Distributions:

          <b-list-group v-for="(dist, index) in dataset.dists" :key="index">
            <b-list-group-item target="_blank" v-bind:href="dist.downloadURL"> Distribution {{index+1}}. (format:
              {{dist.format}} size: {{dist.size}}
              bytes, media type:
              {{dist.mediaType}})</b-list-group-item>
          </b-list-group>
        </b-list-group-item>


        <b-list-group-item v-show="(dataset.provo!== undefined) && (Object.keys(dataset.provo).length!=0)">Provenance:
          <b-list-group>
            <b-list-group-item target="_blank" v-bind:href="dataset.provo.source"> Generated from source: {{dataset.provo.source}}
            </b-list-group-item>
            <b-list-group-item target="_blank" v-bind:href="'http://'+dataset.provo.site"> Harvest site:
              {{dataset.provo.site}} </b-list-group-item>
            <b-list-group-item target="_blank" v-bind:href="dataset.provo.agent"> Harvested by: {{dataset.provo.agentName}}
            </b-list-group-item>
              <b-list-group-item> At time: {{dataset.provo.atTime}}
            </b-list-group-item>
          </b-list-group>

        </b-list-group-item>







      </b-list-group>



    </b-row>

    <b-row v-show="view">
      <b-col cols="9">
        <h4><a target="_blank" v-bind:href="graphdb+'resource?uri='+uri"> {{uri}} </a>
          <div v-show="distribution">
            <b-button class="text-center mt-4 mb-4" type="button" size="sm" v-on:click="downloadDis" variant="primary">
              Download distribution</b-button>
            <b-button class="text-center mt-4 mb-4" type="button" size="sm" v-on:click="addWorkflow" variant="primary">
              Create a workflow</b-button>

          </div>
          <div v-show="uri.includes('Dataset')">
            <b-button class="text-center mt-4 mb-4" type="button" size="sm" v-on:click="showTriples" variant="primary">
              Normal mode</b-button>
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
  import "ol/ol.css";

  // This is library of openlayer for handle map
  import Map from "ol/Map";
  import View from "ol/View";
  import Draw from 'ol/interaction/Draw';
  import WKT from 'ol/format/WKT';
  import {
    Fill,
    Stroke,
    Style,
    RegularShape,
    Icon
  } from 'ol/style';


  import {
    Tile as TileLayer,
    Vector as VectorLayer
  } from 'ol/layer';
  import {
    OSM,
    Vector as VectorSource
  } from 'ol/source';

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
        format: '',
        view: true,
        dataset: {},
        map: null

      }

    },
    async mounted() {
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
      search: function (keyword) {
        alert(keyword);
        let routeData = this.$router.resolve({
          name: 'datasets',
          params: {
            search: 'keyword',
            searchValue: keyword
          }
        });
        window.open(routeData.href, '_blank');

      },

      showTriples: function () {
        this.view = !this.view;
        //if the dataset has spatial information, show it on a map.
        if ((this.dataset.geom != '') && this.dataset.geom != null)
          if (this.view)
            this.map.setTarget(null);

          else {
            this.map.setTarget("map");

            let that = this;
            setTimeout(function () {
              that.initiateMap();
            }, 1000);

          }
      },

      // get all triples whose subject is the given instance
      loadTriples: function () {
        let url = this.host + 'api/instance?uri=' + this.uri;
        axios({
            method: 'get',
            url: url,
          }).then((res) => {
            this.triples = res.data.rs;
            // if the instance is a dataset, display the page in a different manner
            if (this.uri.includes("Dataset")) {
              this.view = false;
              axios({
                method: 'get',
                url: this.host + 'api/show-dataset?uri=' + this.uri,
              }).then((res) => {
                this.dataset = res.data.rs;

                if ((this.dataset.geom != '') && this.dataset.geom != null) {
                  let that = this;
                  setTimeout(function () {
                    that.initiateMap();
                  }, 1000);

                }
              });
            }
            // if the instance is a distriution, add Workflow and download button 
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

      // send the triple to django for insertion
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


      // redirect to the workflow page
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

      initiateMap() {


        var format = new WKT();

        let iconStyle = new Style({
          image: new Icon({
            anchor: [0.5, 46],
            anchorXUnits: 'fraction',
            anchorYUnits: 'pixels',
            src: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
          }),
        });

        var feature = format.readFeature(this.dataset.geom, {
          dataProjection: 'EPSG:4326',
          featureProjection: 'EPSG:3857',
        });

        feature.setStyle(iconStyle);


        var vector = new VectorLayer({
          source: new VectorSource({
            features: [feature],
          }),
        });




        // create title layer
        var raster = new TileLayer({
          source: new OSM(),
        });
        // create map with 2 layer
        // eslint-disable-next-line no-unused-vars
        var view = new View({
          center: [2952104.0199, -3277504.823],
          zoom: 15,
        });
        this.map = new Map({
          view: view,
          target: "map",
          layers: [raster, vector],

        });

        view.fit(feature.getGeometry(), {
          padding: [170, 50, 30, 150],
          minResolution: 2000
        });
        //var size = map.getSize();
        // view.centerOn(feature.getGeometry().getCoordinates(), size, [1200, 300]);



      }


    }

  }
</script>

<style>
  .mapds {
    width: 1200px !important;
    height: 300px !important;
    margin-left: 130px;
  }


  .center {
    margin: auto;

  }
</style>