<template>
  <div>

    <div class="row">

      <h3> New Service </h3>

    </div>

    <b-card header="Service">
      <b-form-group description="Generated automatically" label="URI" label-cols-sm="1" label-cols-lg="1">
        <input type="text" class="form-control" v-model="uri" name="publication" disabled>
      </b-form-group>

      <b-form-group label="Name*" label-cols-sm="1" label-cols-lg="1">
        <input type="text" class="form-control" v-model="identifier" placeholder="Service name" name="name">
      </b-form-group>


      <b-form-group label="Description*" label-cols-sm="1" label-cols-lg="1">
        <input type="text" class="form-control" v-model="identifier" placeholder="Service description" name="desc">
      </b-form-group>

      <b-form-group id="fieldset-10" description="" label="Upload script*" label-cols-sm="1" label-cols-lg="1">
        <b-form-file name="myfile" placeholder="Choose a file or drop it here..." v-model="file"
          drop-placeholder="Drop file here..."></b-form-file>
      </b-form-group>


      <b-form-group label="Operation*" label-cols-sm="1" label-cols-lg="1">
        <Dropdown :options="operations" option-value="uri" option-text="label" id="operation" :maxItem="10"
          v-model="operation" placeholder="Enter some characters">
        </Dropdown>
      </b-form-group>


      <b-form-group label="Input format*" label-cols-sm="1" label-cols-lg="1">
        <Dropdown :options="formats" option-value="uri" option-text="label" id="inputFormat" :maxItem="10"
          v-model="inputFormat" placeholder="Enter some characters">
        </Dropdown> 
      </b-form-group>


      <b-form-group label="Output format*" label-cols-sm="1" label-cols-lg="1">
        <Dropdown :options="formats" option-value="uri" option-text="label" id="inputFormat" :maxItem="10"
          v-model="outputFormat" placeholder="Enter some characters"  :title="outputFormat" 
          v-b-tooltip.hover="{ variant: 'info' }">
        </Dropdown>
      </b-form-group>

      




      <b-form-group id="fieldset-9" description="" label="Subject*" label-cols-sm="1" label-cols-lg="1">
        <b-form-select v-model="subject" :options="options"></b-form-select>
      </b-form-group>



    </b-card>

    <b-button block class="text-center mt-4 mb-4" type="button" v-on:click="submitService" size="lg" variant="primary">
      Create service</b-button>


  </div>


</template>

<script>
  const axios = require('axios');
   

  export default {
    name: 'Reference',
    props: [],
    data() {
      return {
        uri: "",
        statements: [],
        qualifiers: [],
        operation: "",
        file: [],
        operations: [],
        inputFormat: "",
        outputFormat: "",
        identifier: "",
        subject: "",
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


        ],
        formats: []

      }
    },


    mounted: function () {
      this.id = new Date().getTime();
      this.uri = "<http://melodi.irit.fr/resource/Service/dn_" + this.id + ">";

      axios({
          method: 'get',
          url: 'http://localhost:8000/api/format',
        }).then((res) => {
          this.formats = res.data.rs;


        })
        .catch((error) => {
          console.log(error)
          // error.response.status Check status code
        }).finally(() => {
          //Perform action in always
        });

      axios({
          method: 'get',
          url: 'http://localhost:8000/api/operation',
        }).then((res) => {
          this.operations = res.data.rs;


        })
        .catch((error) => {
          console.log(error)
          // error.response.status Check status code
        }).finally(() => {
          //Perform action in always
        });


      document.getElementsByName("dropdown")[0].className = "form-control";
      document.getElementsByName("dropdown")[1].className = "form-control";
      document.getElementsByName("dropdown")[2].className = "form-control";
      //this.$refs.inputFormat.classList.toggle('form-control');

    },
    methods: {



      submitService: function () {


      },


    }
  }
</script>