<template>
  <div>

    <div class="row">
      <div class="col">
        <hr>
      </div>
      <h3> Create claims </h3>
      <div class="col">
        <hr>
      </div>
    </div>

    <b-card header="Reference">
      <b-form-group id="fieldset-22" description="Search by title, enter at least four letters" label="Title*"
        label-for="input-22" state="state" label-cols-sm="1" label-cols-lg="1">
        <autocomplete ref="ac" aria-label="Title" placeholder="Title" :search="search"
          :get-result-value="getResultValue" @submit="handleSubmit">
          <template #result="{ result, props }">
            <li v-bind="props" class="autocomplete-result">
              <div>
                {{ result.title }}
              </div>
              <div>{{result.doi}} </div>
            </li>
          </template>
        </autocomplete>
      </b-form-group>



    </b-card>

    <b-card header="Claim">
      <button type="button" v-on:click="addStatement">+</button>
      <b-card-text>


        <div v-for="st in statements" v-bind:key="st">
          <b-form-group v-bind:label="'Statement '+ (st.id +1)" label-cols-sm="1" label-cols-lg="1">
            <b-form-textarea v-model="st.value" placeholder="Statement" rows="3" max-rows="6">
            </b-form-textarea>
          </b-form-group>
        </div>

      </b-card-text>

      <!-- <b-card-text>
        <button type="button" v-on:click="addQualifier">+</button>
        <div v-for="st in qualifiers" v-bind:key="st">
          <b-form-group   v-bind:label="'Qualifier '+ (st.id +1)" label-cols-sm="1" label-cols-lg="1">
            <input type="text" class="form-control" v-model="st.qualifier" placeholder="Qualifier">
          </b-form-group>
        </div>

      </b-card-text>
-->
    </b-card>
    <b-button block class="text-center mt-4 mb-4" type="button" v-on:click="create" size="lg" variant="primary">
      Create claims</b-button>

    <b-alert variant="success" show>
      Existing Information
      <b-table striped sortable hover :items="tbl" @row-clicked="show" class="pointer"></b-table>
    </b-alert>


  </div>
</template>

<script>
  const axios = require('axios');
  export default {
    name: 'Reference',
    props: [],
    data() {
      return {
        uri: '',
        pub: '',
        title: '',
        statements: [],
        qualifiers: [],
        tbl:[]


      }
    },


    created: function () {
      this.statements.push({
        id: this.statements.length,
        value: ''
      });

      this.qualifiers.push({
        id: this.qualifiers.length,
        value: ''
      });

    },
    methods: {

      search(input) {
        const url = this.host + 'api/pub-title?title=' + encodeURI(input)

        return new Promise(resolve => {
          if (input.length < 4) {
            return resolve([])
          }

          fetch(url)
            .then(response => response.json())
            .then(data => {
              // console.log(data);
              resolve(data.rs)
            })
        })
      },

      addStatement: function () {
        this.statements.push({
          id: this.statements.length,
          value: ''
        });

      },

      addQualifier: function () {
        this.qualifiers.push({
          id: this.qualifiers.length,
          value: ''
        });

      },


      getResultValue(result) {
        return result.title
      },

      handleSubmit(result) {
        if (result === undefined) {
          console.log(1);

        } else {
          this.uri = "<" + result.uri + ">";
          this.title = result.title;
          let url = this.host + 'api/claim?uri=' + this.uri
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


        }
        this.$emit('updated', this.name, this.email, this.changedUri, this.agent)

      },


      create: function () {
        let url = this.host + 'api/new-claim';
        axios({
            method: 'post',
            url: url,
            data: {
              uri: this.uri,
              statements: this.statements
            }
          }).then((res) => {
            if (res.data.result === "ok") {
              alert("Claim created")
              this.uri = "";
              this.statements = [];
            }
          })
          .catch((error) => {
            alert("Agent creation failed. Error: " + error);
          }).finally(() => {
            //Perform action in always
          });

      },


    }
  }
</script>