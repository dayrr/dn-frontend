<template>

  <div>
    <div class="row">
      <div class="col">
        <hr>
      </div>
      <h3> Create a dataset </h3>
      <div class="col">
        <hr>
      </div>
    </div>
    <b-form @submit.prevent="" autocomplete="off">

      <b-card header="Dataset" variant="dark">
        <b-card-text>
          <div>
            <b-form-group id="fieldset-1" description="Generated automatically" label="URI" label-for="input-1"
              label-cols-sm="1" label-cols-lg="1">
              <b-form-input id="input-1" v-model="uri" disabled></b-form-input>
            </b-form-group>

            <b-form-group id="fieldset-2" description="" label="Title*" label-for="input-2" label-cols-sm="1"
              label-cols-lg="1">
              <b-form-input id="input-2" v-model="title" placeholder="Dataset title">
              </b-form-input>
            </b-form-group>

            <b-form-group id="fieldset-3" description="" label="Description*" label-for="input-3" label-cols-sm="1"
              label-cols-lg="1">
              <b-form-input id="input-3" v-model="desc" placeholder="Dataset description">
              </b-form-input>
            </b-form-group>

            <b-form-group id="fieldset-7" description="" label="Subject*" label-for="input-7" label-cols-sm="1"
              label-cols-lg="1">
              <b-form-select v-model="subject" :options="options"></b-form-select>
            </b-form-group>

            <b-form-group id="fieldset-4" description="" label="Keyword" label-for="input-4" label-cols-sm="1"
              label-cols-lg="1">
              <b-form-input id="input-4" v-model="keywords" placeholder="Keyword"></b-form-input>
            </b-form-group>

            <b-form-group id="fieldset-5" description="" label="Issued date" label-for="input-5" label-cols-sm="1"
              label-cols-lg="1">
              <b-form-datepicker id="datepicker-dateformat"
                :date-format-options="{ year: 'numeric', month: 'numeric', day: 'numeric' }" v-model="issuedDate"
                locale="en">
              </b-form-datepicker>
            </b-form-group>

            <b-form-group id="fieldset-6" description="" label="Note" label-for="input-6" label-cols-sm="1"
              label-cols-lg="1">
              <b-form-input id="input-6" v-model="note" placeholder="Note"></b-form-input>
            </b-form-group>

            Localisation <div id="map" class="mapds"></div>

          </div>
        </b-card-text>
      </b-card>

      <b-card header="Creators (Authors)*">
        <button type="button" v-on:click="addAgent('creator')">+</button>
        <b-form @submit.prevent="" autocomplete="off">
          <Agento v-for="agent in creators" :key="agent.id" :agent="agent" :idxLocal="agent.idxLocal"
            :agentType="agent.agentType" :uri="agent.uri" @updated="updateAgent"></Agento>
        </b-form>

      </b-card>

      <b-card header="Publishers (Contacts)*">
        <button type="button" v-on:click="addAgent('publisher')">+</button>
        <b-form @submit.prevent="" autocomplete="off">
          <Agento v-for="agent in publishers" :key="agent.id" :agent="agent" :idxLocal="agent.idxLocal"
            :agentType="agent.agentType" :uri="agent.uri" @updated="updateAgent"></Agento>
        </b-form>
      </b-card>

      <b-card header="Depositors">
        <button type="button" v-on:click="addAgent('depositor')">+</button>
        <b-form @submit.prevent="" autocomplete="off">
          <Agento v-for="agent in depositors" :key="agent.id" :idxLocal="agent.idxLocal" :agent="agent"
            :agentType="agent.agentType" :uri="agent.uri" @updated="updateAgent"></Agento>
        </b-form>
      </b-card>


      <b-card header=" Related publications">
        <button type="button" v-on:click="addPublication()"> + </button>
        <Publicationo v-for="pub in pubs" v-bind:key="pub" :dsID="pub.dsID" @updated="updatePub" :num="pub.num"
          :pub="pub" :authors="pub.authors"></Publicationo>
      </b-card>
      
      <b-button block class="text-center mt-4 mb-4" type="button" size="lg" @click="submitForm" variant="primary">Create
        dataset</b-button>


    </b-form>

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
    Tile as TileLayer,
    Vector as VectorLayer
  } from 'ol/layer';
  import {
    OSM,
    Vector as VectorSource
  } from 'ol/source';

  export default {
    data() {
      return {
        uri: '',
        id: '',
        title: '',
        desc: '',
        keywords: '',
        pubs: [],
        creators: [],
        loc: '',
        authors: [],
        issuedDate: '',
        note: '',
        depositors: [],
        publishers: [],
        count: 0,
        countpb: 0,
        show: true,
        subject: '5',
        //to do: must be sync with django, make a json instead
        options: [{
            value: '1',
            text: 'Arts and Humanities'
          },
          {
            value: '2',
            text: 'Astronomy and Astrophysics'
          },
          {
            value: '3',
            text: 'Business and Management'
          },
          {
            value: '4',
            text: 'Chemistry'
          },
          {
            value: '5',
            text: 'Computer and Information Science'
          },
          {
            value: '6',
            text: 'Earth and Environmental Sciences'
          },
          {
            value: '7',
            text: 'Engineering'
          },
          {
            value: '8',
            text: 'Law'
          },
          {
            value: '9',
            text: 'Mathematical Sciences'
          },
          {
            value: '10',
            text: 'Medicine, Health and Life Sciences'
          },
          {
            value: '11',
            text: 'Physics'
          },
          {
            value: '12',
            text: 'Social Sciences'
          },
          {
            value: '13',
            text: 'Other'
          },
        ]
      }
    },

    async mounted() {
      // show the map, must by sync, if not, the map doesn't show
      await this.initiateMap();
    },

    created: function () {

      this.id = new Date().getTime();
      this.uri = "<http://melodi.irit.fr/resource/Dataset/dn_" + this.id + ">";
      this.creators.push({
        uri: "",
      });

      this.count++;
      this.publishers.push({
        uri: "",
      });
      this.count++;
    },
    methods: {

      
      initiateMap() {

        var source = new VectorSource({
          wrapX: false
        });

        this.vectorLayer = new VectorLayer({
          source: source
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

        var draw; // global so we can remove it later
        let that = this;
        // add interaction show that the user can click on the map to input coordonates
        function addInteraction() {

          draw = new Draw({
            source: source,
            type: "Point",
          });
          that.map.addInteraction(draw);

        }

        addInteraction();

        // if draw end, capture the user input
        draw.on('drawend', function (e) {
          that.loc = e.feature.getGeometry().getCoordinates();
          let format = new WKT();
          that.loc = format.writeGeometry(e.feature.getGeometry());
          that.map.removeInteraction(draw);

        });

      },


      updateAgent: function (uri, name, email, agent) {
        agent.uri = uri;
        agent.name = name;
        agent.email = email;

      },

      updatePub: function (uri, pub) {
        pub.uri = uri;
      },

      addPublication: function () {
        this.pubs.push({
          uri: '',
        });
      },

      addAgent: function (type) {
        if (type === "creator")
          this.creators.push({
            uri: ""
          });
        else if (type === "publisher")
          this.publishers.push({
            uri: ">",

          });
        else
          this.depositors.push({
            uri: "",

          });
        this.count++;
      },
      // send data to django
      submitForm() {
        //evt.preventDefault();
        let url = this.host + 'api/new-dataset';
        axios({
            method: 'post',
            url: url,
            data: {
              uri: this.uri,
              title: this.title,
              description: this.desc,
              keywords: this.keywords,
              note: this.note,
              issuedDate: this.issuedDate,
              creators: this.creators,
              publishers: this.publishers,
              depositors: this.depositors,
              pubs: this.pubs,
              subject: this.subject,
              loc: this.loc
            }
          }).then((res) => {
            // alert(JSON.stringify(res.data));
            window.open(res.data.page, '_blank');
            this.$router.push({
              name: 'upload-files',
              params: {
                doi: res.data.doi,
                uri: this.uri,
                id: this.id
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
      onReset(evt) {
        evt.preventDefault()
        // Reset our form values
        this.form.email = ''
        this.form.name = ''
        this.form.food = null
        this.form.checked = []
        // Trick to reset/clear native browser form validation state
        this.show = false
        this.$nextTick(() => {
          this.show = true
        })
      }
    }
  }
</script>

<style>
  .mapds {
    width: 90% !important;
    height: 300px !important;
    margin-left: 130px;
  }


  .center {
    margin: auto;

  }
</style>