<template>
  <div>
    <div class="row">
      <div class="col">
        <hr>
      </div>
      <h3> Create a publication </h3>
      <div class="col">
        <hr>
      </div>
    </div>
    <b-form @submit.prevent="" autocomplete="off">

      <b-card header="Dataset" variant="dark">
        <b-form-group description="Generated automatically" label="URI" label-cols-sm="1" label-cols-lg="1">
          <input type="text" class="form-control" v-on:change="update" v-model="uri" name="publication" disabled>
        </b-form-group>


        <b-form-group label="Identifier*" label-cols-sm="1" label-cols-lg="1">
          <input type="text" class="form-control" @keyup="search($event)" v-on:change="update" v-model="identifier"
            placeholder="Document identifier" name="identifier">
        </b-form-group>

        <b-form-group label="Title*" label-cols-sm="1" label-cols-lg="1">
          <input type="text" class="form-control" v-on:change="update" v-model="title" placeholder="Document title"
            name="publication-title">
        </b-form-group>


        <b-form-group label="Issued date*" label-cols-sm="1" label-cols-lg="1">
             <b-form-datepicker id="datepicker-dateformat"
                :date-format-options="{ year: 'numeric', month: 'numeric', day: 'numeric' }" v-model="issuedDate"
                locale="en">
              </b-form-datepicker>

     

        </b-form-group>

      </b-card>

      <b-card header="Authors*">

        <button type="button" v-on:click="addAuthor()">+</button>

        <Agento v-for="agent in authors" :key="agent.id" @updated="updateAuthor" :agent="agent"
          :idxLocal="agent.idxLocal" :agentType="agent.agentType" :uri="agent.uri"></Agento>


      </b-card>
      <b-button block class="text-center mt-4 mb-4" type="button" v-on:click="create" size="lg" variant="primary">
        Create publication</b-button>
    </b-form>

    <b-alert variant="success" show>
      Existing Information
      <b-table striped sortable hover :items="tbl" @row-clicked="show" class="pointer"></b-table>
    </b-alert>

  </div>
</template>

<script>
  const axios = require('axios');
  export default {
    name: 'Publication',
    data() {
      return {
        title: '',
        issuedDate: '',
        authors: [],
        identifier: '',
        id: '',
        uri: '',
        tbl:[]
      }
    },


    created: function () {
      let id = new Date().getTime();
      this.uri = "<http://melodi.irit.fr/resource/Document/dn_" + id + ">";
    },

    methods: {
      // prepare data form and send it to djando 
      create() {
        let url = this.host + "api/new-pub"
        axios({
            method: 'post',
            url: url,
            data: {
              uri: this.uri,
              doi: this.identifier,
              title: this.title,
              issued: this.issuedDate,
              authors: this.authors
            }
          }).then((res) => {
            if (res.data.result === "ok")
              alert("Publication created")
            this.identifier = "";
            this.title = "";
            this.issuedDate = "";
            this.authors = [];
            let id = new Date().getTime();
            this.uri = "<http://melodi.irit.fr/resource/Document/dn_" + id + ">";
          })
          .catch((error) => {
            alert("Agent creation failed. Error: " + error);
          }).finally(() => {
            //Perform action in always
          });
      },

      //search for existing publication 
      search(e) {

        if (this.identifier.length < 4) {

          this.tbl = [];
          return;
        }
        let url = this.host + 'api/pub?doi=' + this.identifier;
        axios({
            method: 'get',
            url: url,
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



      addAuthor: function () {
        this.authors.push({
          uri: "",
          agentType: "Author",
          idxLocal: this.authors.length + 1

        });
        this.count++;
      },
      // handle child event
      updateAuthor: function (uri, name, email, author) {
        author.uri = uri;
        author.name = name;
        author.email = email;
        //this.update();
      },

      update: function () {

        // "Marouf, A., Tekap, Y. B., Simiriotis, N., T\u00F4, J. B., Rouchon, J. F., Hoarau, Y., & Braza, M. (2019). Numerical investigation of frequency-amplitude effects of dynamic morphing for a high-lift configuration at high Reynolds number. International Journal of Numerical Methods for Heat & Fluid Flow." .

        let strauthors = "";
        console.log(this.authors);
        this.authors.forEach(function (author) {
          strauthors += author.name + ", "
        });
        strauthors = strauthors.substring(0, strauthors.length - 2);

        this.citation = strauthors + ". (" + this.issuedDate + "). " + this.title + ".";

        this.$emit('updated', this.uri, this.title, this.issuedDate, this.identifier, this.authors, this.pub)

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
       }

      
    }
  }
</script>