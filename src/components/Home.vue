<template>
  <div>
    <div class="center" @click="search($event)">
      <vue-word-cloud style="
    height: 280px;
    width: 840px;
    cursor:pointer;
    margin:auto;
  " :words="words" :color="([, weight]) => weight > 4 ? 'DeepPink' : weight > 2 ? 'RoyalBlue' : 'Indigo'"
        font-family="Roboto" />
    </div>
    <div style="width:600px; margin:auto;">
      <b-input-group>
        <b-form-input size="sm" class="mr-sm-2" v-model="searchText" placeholder="Search"></b-form-input>
        <b-button size="sm" class="my-2 my-sm-0"  v-on:click="searchTitle" type="button">Search</b-button>
      </b-input-group>
    </div>

    <br />
    <h4> Recent deposits </h4>
    <b-table striped sortable hover :fields="['title', 'description', 'issued', 'subject']" :items="ds" @row-clicked="showDataset"></b-table>



    <br />
    <b-row>
      <b-col cols="3">
        <h4> Subjects repartition </h4>
        <graph-pie :width="500" :height="500" :padding-top="75" :padding-right="75" :padding-bottom="75"
          :padding-left="75" :values="values" :names="names" :active-index="[ 0, 2 ]" :active-event="'click'"
          :show-text-type="'outside'" :data-format="dataFormat" :shape="'donut'" :show-total-value="false">
          <!-- <note :text="'Subjects repartition'"></note> -->
          <legends :names="names"></legends>
          <tooltip :names="names"></tooltip>
        </graph-pie>
      </b-col>
      <b-col cols="9">
        <h4> Localisation </h4>
        <div id="map" class="map"></div>
        <div id="popup" class="ol-popup">
          <a href="#" id="popup-closer" class="ol-popup-closer"></a>
          <div id="popup-content"></div>
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
  import WKT from 'ol/format/WKT';
  import Overlay from 'ol/Overlay';
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
    Cluster,
    Vector as VectorSource
  } from 'ol/source';



  export default {
    name: 'Home',
    props: [],
    /*
      Defines the data used by the component
    */

    data() {
      return {
        values: [],
        names: [],
        ds: [],
        loc: [],
        searchText:'',
        map: null,
        vectorLayer: null,
        clusterLayer: null,
        words: [

        ]

      }
    },
    async mounted() {
        await this.initiateMap();
        axios({
            method: 'get',
            url: 'http://localhost:8000/api/stat_subj',
          }).then((res) => {

            let that = this;
            let total = 0;
            res.data.rs.forEach(function (subj) {
              that.names.push(subj.name);
              that.values.push(subj.total);
              total += parseInt(subj.total);
            });

            for (let i = 0; i < this.values.length; i++)
              this.values[i] = this.values[i] * 100 / total;



          })
          .catch((error) => {
            console.log(error)
            // error.response.status Check status code
          }).finally(() => {
            //Perform action in always
          });


        axios({
            method: 'get',
            url: 'http://localhost:8000/api/list_recents',
          }).then((res) => {
            this.ds = res.data.rs;




          })
          .catch((error) => {
            console.log(error)
            // error.response.status Check status code
          }).finally(() => {
            //Perform action in always
          });



        axios({
            method: 'get',
            url: 'http://localhost:8000/api/stat_key',
          }).then((res) => {


            for (let i = 0; i < res.data.rs.length; i++)
              this.words.push([res.data.rs[i].keyword, parseInt(res.data.rs[i].total)]);



          })
          .catch((error) => {
            console.log(error)
            // error.response.status Check status code
          }).finally(() => {
            //Perform action in always
          });







      }

      ,
    methods: {
      searchTitle(){
         this.$router.push({ name: 'datasets' , params: {search:'title', searchValue:this.searchText}});
      }
      ,

      search(event) {
        console.log(event.target.outerText);
        this.$router.push({ name: 'datasets' , params: {search:'keyword', searchValue:event.target.outerText}});

      },
      showDataset(record, index) {
        console.log(index);
        this.$router.push({ name: 'instance' , params: {uri:record.uri}});
      
      },

      initiateMap() {
        axios({
            method: 'get',
            url: 'http://localhost:8000/api/loc',
          }).then((res) => {
            this.loc = res.data.rs;
            // create vector layer
            let format = new WKT();
            let features = [];

            // eslint-disable-next-line no-unused-vars
            let square = new Style({

              image: new RegularShape({
                fill: new Fill({
                  color: 'rgba(255,255,255,0.7)'
                }),
                stroke: new Stroke({
                  color: '#3399CC',
                  width: 3
                }),
                points: 4,
                radius: 10
              }),
            });


            let iconStyle = new Style({
              image: new Icon({
                anchor: [0.5, 46],
                anchorXUnits: 'fraction',
                anchorYUnits: 'pixels',
                src: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
              }),
            });


            for (let i = 0; i < this.loc.length; i++)

            {
              let feature = format.readFeature(this.loc[i].geom, {
                dataProjection: 'EPSG:4326',
                featureProjection: 'EPSG:31982',
              });
              feature.setStyle(iconStyle);
              features.push(feature);
              feature.set("title", this.loc[i].title);

            }







            var source = new VectorSource({
              features: features
            });
            console.log(source.getFeatures().length);

            this.vectorLayer = new VectorLayer({
              source: source
            });

            this.clusterLayer = new VectorLayer({
              source: new Cluster({
                source: source,
                distance: 100
              }),
              style: function (feature) {
                console.log(feature);
                // feature.setStyle(square);
              }
            });
            // create title layer
            var raster = new TileLayer({
              source: new OSM(),
            });
            // create map with 2 layer
            // eslint-disable-next-line no-unused-vars
            this.map = new Map({

              target: "map",
              layers: [raster, this.vectorLayer],
              view: new View({
                projection: "EPSG:4326",
                center: [3, 45],
                zoom: 6,
              }),
            });

            var container = document.getElementById('popup');
            var content = document.getElementById('popup-content');
            var closer = document.getElementById('popup-closer');

            /**
             * Create an overlay to anchor the popup to the map.
             */
            var overlay = new Overlay({
              element: container,
              autoPan: true,
              autoPanAnimation: {
                duration: 250,
              },
            });

            /**
             * Add a click handler to hide the popup.
             * @return {boolean} Don't follow the href.
             */
            closer.onclick = function () {
              overlay.setPosition(undefined);
              closer.blur();
              return false;
            };


            var that = this;

            this.map.addOverlay(overlay);

            this.map.on('pointermove', function (e) {

              var pixel = that.map.getEventPixel(e.originalEvent);
              var hit = that.map.hasFeatureAtPixel(pixel);
              that.map.getTargetElement().style.cursor = hit ? 'pointer' : '';
            });

            this.map.on('click', function (evt) {
              let feat = that.map.forEachFeatureAtPixel(evt.pixel, function (feature) {
                return feature;
              });
              if (feat) {
                var coordinates = feat.getGeometry().getCoordinates();
                content.innerHTML = feat.get("title");
                overlay.setPosition(coordinates);
              }
            });




          })
          .catch((error) => {
            console.log(error)
            // error.response.status Check status code
          }).finally(() => {
            //Perform action in always
          });




      },
      dataFormat: function (a, b) {
        if (b) return b + "%";
        return a;
      },




    }
  }
</script>

<style>
  .map {
    width: 100%;
    height: 500px;
  }

  .ol-popup {
    position: absolute;
    background-color: white;
    box-shadow: 0 1px 4px rgba(0, 0, 0, 0.2);
    padding: 15px;
    border-radius: 10px;
    border: 1px solid #cccccc;
    bottom: 12px;
    left: -50px;
    min-width: 280px;
  }

  .ol-popup:after,
  .ol-popup:before {
    top: 100%;
    border: solid transparent;
    content: " ";
    height: 0;
    width: 0;
    position: absolute;
    pointer-events: none;
  }

  .ol-popup:after {
    border-top-color: white;
    border-width: 10px;
    left: 48px;
    margin-left: -10px;
  }

  .ol-popup:before {
    border-top-color: #cccccc;
    border-width: 11px;
    left: 48px;
    margin-left: -11px;
  }

  .ol-popup-closer {
    text-decoration: none;
    position: absolute;
    top: 2px;
    right: 8px;
  }

  .ol-popup-closer:after {
    content: "✖";
  }


  .center {
    margin: auto;

  }
</style>