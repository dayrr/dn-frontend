<template>
  <div>

    <div class="row">

      <h3> New Claims </h3>

    </div>

    <b-card header="Reference">
      <b-form-group description="Generated automatically" label="URI" label-cols-sm="1" label-cols-lg="1">
        <input type="text" class="form-control" v-model="uri" name="publication" disabled>
      </b-form-group>


      <b-form-group id="fieldset-22" label="Title*" description="Autocompleted, enter to search" label-for="input-22"
        state="state" label-cols-sm="1" label-cols-lg="1">
        <autocomplete ref="ac" aria-label="Title" placeholder="Article title" :search="search"
          :get-result-value="getResultValue" @submit="handleSubmit">
          <template #result="{ result, props }">
            <li v-bind="props" class="autocomplete-result">
              <div>
                {{ result.title }}
              </div>
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
    <b-button block class="text-center mt-4 mb-4" type="button" v-on:click="submitPub" size="lg" variant="primary">
      Create claims</b-button>
  </div>
</template>

<script>
  export default {
    name: 'Reference',
    props: [],
    data() {
      return {
        uri: '',
        title:'',
        statements: [],
        qualifiers: []


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
        const url = `http://localhost:8000/api/pub?title=${encodeURI(input)}`

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
       
        }
        this.$emit('updated', this.name, this.email, this.changedUri, this.agent)
      
    },


    submitClaims: function () {


    },


  }
  }
</script>