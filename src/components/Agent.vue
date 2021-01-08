<template>
  <b-card-text>
    <div class="row">
      <div class="col">
        <hr>
      </div>
      <h3> Create an agent </h3>
      <div class="col">
        <hr>
      </div>
    </div>
    <div>
      <b-form-group id="fieldset-21" description="Generated automatically" label="URI" label-for="input-21"
        state="state" label-cols-sm="1" label-cols-lg="1">
        <b-form-input id="input-21" v-model="uri" disabled></b-form-input>
      </b-form-group>


      <b-form-group id="fieldset-22" description="" label="Name*" label-for="input-22" state="state" label-cols-sm="1"
        label-cols-lg="1">
        <b-form-input ref="name" id="input-23" v-model="name" placeholder="Name" @keyup="search($event)">
        </b-form-input>
      </b-form-group>


      <b-form-group id="fieldset-23" description="" label="Email" label-for="input-23"  label-cols-sm="1"
        label-cols-lg="1">
        <b-form-input id="input-23" v-model="email" placeholder="Email" type="email">
        </b-form-input>
      </b-form-group>

      <b-button block class="text-center mt-4 mb-4" type="button" v-on:click="create" size="lg" variant="primary">
        Create agent</b-button>
  

      <b-alert variant="success" show>
        Existing Information
        <b-table striped sortable hover :items="tbl" @row-clicked="show" class="pointer"></b-table>
      </b-alert>









    </div>
  </b-card-text>
</template>

<script>
  //import Autocomplete from '@trevoreyre/autocomplete-vue'
  const axios = require('axios');
  export default {
    name: 'Agent',
    data() {
      return {
        email: '',
        name: '',
        uri: '',
        tbl: []

      }

    },
    created: function () {
      let id = new Date().getTime();
      this.uri = "<http://melodi.irit.fr/resource/Agent/dn_" + id + ">";

    },

    methods: {
      create() {
     
        axios({
            method: 'post',
            url: this.host + 'api/new-agent',
            data: {
              uri: this.uri,
              name: this.name,
              email: this.email             
            }
          }).then((res) => {
           if(res.data.result==="ok")
              alert("Agent created")
              this.name="";
              this.email=""; 
              let id = new Date().getTime();
      this.uri = "<http://melodi.irit.fr/resource/Agent/dn_" + id + ">";     
         })
          .catch((error) => {
             alert("Agent creation failed. Error: "+ error);
          }).finally(() => {
            //Perform action in always
          });
      },

      show(record, index) {
        console.log(index);
        let routeData = this.$router.resolve({
          name: 'instance',
          params: {
            uri: record.uri
          },
          query: {
            uri: record.uri
          }
        });
        window.open(routeData.href, '_blank');
      },




      search(e) {
        if (this.name.length < 4)
        {
          
          this.tbl = [];
          return;
        }
         let url = this.host + 'api/agent?name=' + this.name
        axios({
            method: 'get',
            url: url
          }).then((res) => {

            this.tbl = res.data.rs;
  

          })
          .catch((error) => {
            console.log(error)
            // error.response.status Check status code
          }).finally(() => {
            //Perform action in always
          });

        
      },


    }

  }
</script>