<template>
  <div>

    <b-card header="Dataset" variant="dark">
      <b-card-text>
        <p> URI: {{uri}}</p>
        <p> Landding page: <a v-bind:href="'http://localhost:8080/dataset.xhtml?persistentId='+doi"> {{doi}} </a> </p>
        <p> DOI: {{doi}}</p>
      </b-card-text>
    </b-card>


    <b-card header="Distribution" variant="dark">
      <b-card-text>
          <b-form-group autocomplete="off" label="Upload file*" label-cols-sm="1" label-cols-lg="1">
        <b-form-file name="myfile" placeholder="Choose a file or drop it here..." v-model="file"
          drop-placeholder="Drop file here..."></b-form-file>
          </b-form-group>
      </b-card-text> 
        <b-form-group autocomplete="off" label="Format*" label-cols-sm="1" label-cols-lg="1">
        <Dropdown :options="formats" option-value="uri" option-text="label" v-on:selected="selectFormat"
          id="format" :maxItem="10" placeholder="Enter some characters" v-b-tooltip.hover="{ variant: 'info' }">
        </Dropdown>
      </b-form-group>

    </b-card>

   

    <b-button block class="text-center mt-4 mb-4" type="button" v-on:click="submitFile" size="lg" variant="primary">
      Upload files</b-button>

  </div>

</template>

<script>
  const axios = require('axios');
  export default {
    /*
      Defines the data used by the component
    */
    data() {
      return {
        doi: '',
        file: null,
        uri: '',
        id: '',
        format:{},
        formats:[]
      }
    },

    //get all formats for auto complete
    mounted: function () {
      this.doi = this.$route.params.doi;
      this.uri = this.$route.params.uri;
      this.id = this.$route.params.id;
      let url = this.host + 'api/formats';
      axios({
          method: 'get',
          url: url,
        }).then((res) => {
          this.formats = res.data.rs;


        })
        .catch((error) => {
          console.log(error)
          // error.response.status Check status code
        }).finally(() => {
          //Perform action in always
        });

      //custom CSS
      document.getElementsByName("dropdown")[0].className = "form-control";
      document.getElementsByName("dropdown")[0].autocomplete = "off";

    },

    methods: {

        selectFormat(selection) {
        
        this.format = selection;

      },

      // prepare form data and send to django
      submitFile() {
        const formData = new FormData();
        //for (let file of this.files) {
        //   formData.append('myfile', file) // note, no square-brackets
        //}
        formData.append("file_uploaded", this.file);
        formData.append("pid", this.doi);
        formData.append("uri", this.uri);
        formData.append("id", this.id);
        formData.append("format", this.format.id);
        let url = this.host + 'api/new-distribution';
        axios({
            method: 'post',
            url: url,
            headers: {
              'content-Type': 'multipart/form-data'
            },
            data: formData
          }).then(function (rs) {
            if (rs.data === "ok")
              alert("File uploaded");
            else
              alert("Upload failed");
          })
          .catch(function () {
            alert("Upload failed. Check your connection.");
          });
        this.file = null;
      }
    },



  }
</script>