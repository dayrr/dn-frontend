<template>
  <div>
    <b-card-text>
        <div class="row">
      <div class="col">
        <hr>
      </div>
      <div class="col-auto"><b>Document - {{num + 1}}</b></div>
      <div class="col">
        <hr>
      </div>
    </div>
      <b-form-group description="Generated automatically" label="URI" label-cols-sm="1" label-cols-lg="1">
        <input type="text" class="form-control" v-on:change="update" v-model="uri" name="publication" disabled>
      </b-form-group>


      <b-form-group label="Identifier*" label-cols-sm="1" label-cols-lg="1">
        <input type="text" class="form-control" v-on:change="update" v-model="identifier"
          placeholder="Document identifier" name="identifier">
      </b-form-group>

      <b-form-group label="Title*" label-cols-sm="1" label-cols-lg="1">
        <input type="text" class="form-control" v-on:change="update" v-model="title" placeholder="Document title"
          name="publication-title">
      </b-form-group>


      <b-form-group label="Issued date*" label-cols-sm="1" label-cols-lg="1">
        <input type="date" id="datepicker-dateformat-pub"
          :date-format-options="{ year: 'numeric', month: 'numeric', day: 'numeric' }" locale="en" v-on:change="update"
          v-model="issuedDate" class="form-control">

      </b-form-group>

    </b-card-text>

    Reference
    <hr>
    <b-form-group description="Generated automatically" label="URI" label-cols-sm="1" label-cols-lg="1">
      <input type="text" class="form-control" v-on:change="update" v-model="refuri" name="publication" disabled>
    </b-form-group>


    <b-form-group description="Generated automatically" label="Citation" label-cols-sm="1" label-cols-lg="1">

      <b-form-textarea id="textarea" v-model="citation" placeholder="citation" rows="4" max-rows="6" disabled>
      </b-form-textarea>
    </b-form-group>




    <b-card-text>
      Authors
      <button type="button" v-on:click="addAuthor()">+</button>

      <Agent v-for="agent in authors" :key="agent.id" @updated="updateAuthor" :agent="agent" :idxLocal="agent.idxLocal"
        :agentType="agent.agentType" :uri="agent.uri"></Agent>


    </b-card-text>
  </div>
</template>

<script>
  export default {
    name: 'Publication',
    props: ['dsID', 'num', 'agentType', 'idxLocal', 'pub'],
    data() {
      return {
        title: '',
        issuedDate: '',
        authors: [],
        identifier: '',
        count: 0,
        id: '',
        uri: '',
        refuri: '',
        citation: ''

      }
    },


    created: function () {
      this.uri = "<http://melodi.irit.fr/resource/Document/dn_" + this.dsID + this.num + ">";
      this.refuri = "<http://melodi.irit.fr/resource/Reference/dn_" + this.dsID + this.num + ">";
      this.authors.push({
        uri: "<http://melodi.irit.fr/resource/Agent/dn_a" + this.dsID + this.num + this.count + ">",
        agentType: "Author",
        idxLocal: this.authors.length + 1
      });
      this.count++;
    },
    methods: {
      addAuthor: function () {
        this.authors.push({
          uri: "<http://melodi.irit.fr/resource/Agent/dn_a" + this.dsID + this.num + this.count + ">",
          agentType: "Author",
          idxLocal: this.authors.length + 1

        });
        this.count++;
      },

      updateAuthor: function (name, email, uri, author) {


        author.name = name;
        author.email = email;
        author.uri = uri;

        this.update();

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

      }
    }
  }
</script>