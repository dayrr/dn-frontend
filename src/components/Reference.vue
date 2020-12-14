<template>
  <div>
    <b-card-text>
        <div class="row">
   
      <h3> New Publication </h3>
    
    </div>
      <b-form-group description="Generated automatically" label="URI" label-cols-sm="1" label-cols-lg="1">
        <input type="text" class="form-control"  v-model="uri" name="publication" disabled>
      </b-form-group>


      <b-form-group label="Identifier (DOI)" label-cols-sm="1" label-cols-lg="1">
        <input type="text" class="form-control"  v-model="identifier"
          placeholder="Document identifier" name="identifier">
      </b-form-group>

      <b-form-group label="Title*" label-cols-sm="1" label-cols-lg="1">
        <input type="text" class="form-control" v-model="title" placeholder="Document title"
          name="publication-title">
      </b-form-group>


      <b-form-group label="Issued date*" label-cols-sm="1" label-cols-lg="1">
        <input type="date" id="datepicker-dateformat-pub"
          :date-format-options="{ year: 'numeric', month: 'numeric', day: 'numeric' }" locale="en"
          v-model="issuedDate" class="form-control">

      </b-form-group>

    </b-card-text>


    <b-card-text>
      Authors
      <button type="button" v-on:click="addAuthor()">+</button>

      <Agent v-for="agent in authors" :key="agent.id" @updated="updateAuthor" :agent="agent" :idxLocal="agent.idxLocal"
        :agentType="agent.agentType" :uri="agent.uri"></Agent>

    </b-card-text>

        <b-card-text>
      Publisher
  
      <Agent  @updated="updatePublisher" :agent="publisher"></Agent>



    </b-card-text>
        <b-button block class="text-center mt-4 mb-4" type="button" v-on:click="submitPub" size="lg" variant="primary">
     Create publication</b-button>
  </div>
</template>

<script>
  export default {
    name: 'Reference',
    props: [],
    data() {
      return {
        title: '',
        issuedDate: '',
        authors: [],
        identifier: '',       
        uri: '',
        pubID:'',
        publisher: null
      

      }
    },


    created: function () {
      this.pubID = new Date().getTime();
      this.uri = "<http://melodi.irit.fr/resource/Reference/dn_" + this.pubID + ">"; 
      this.authors.push({
        uri: "<http://melodi.irit.fr/resource/Agent/dnp_" + this.pubID + ">",
        agentType: "Author",
        idxLocal: this.authors.length + 1
      });
      this.count++;
      this.publisher = {uri: "<http://melodi.irit.fr/resource/Agent/dno_" + this.pubID + ">", agentType:"Publisher", idxLocal:1};
    },
    methods: {
      addAuthor: function () {
        this.authors.push({
          uri: "<http://melodi.irit.fr/resource/Agent/dnp_" + this.pubID +  this.authors.length + ">",
          agentType: "Author",
          idxLocal: this.authors.length + 1

        });
        this.count++;
      },
      submitPub: function()
      {


      },

      updateAuthor: function (name, email, uri, author) {


        author.name = name;
        author.email = email;
        author.uri = uri;

        this.update();

      },
      
    }
  }
</script>