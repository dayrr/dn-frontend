<template>
  <b-form-group id="fieldset-22" description="Search by title, enter at least four letters" label="Title*"
    label-for="input-22" state="state" label-cols-sm="1" label-cols-lg="1">
    <autocomplete ref="ac" aria-label="Title" placeholder="Title" :search="search" :get-result-value="getResultValue"
      @submit="handleSubmit">
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
</template>

<script>
  // define a component that can be included by other ones.
  const axios = require('axios');
  export default {
    name: 'Publication',
    props: ['pub'],
    data() {
      return {
        uri: '',
      }
    },


    created: function () {
   
    },
    methods: {
      //send a request to django  to check exist publication to avoid duplication
      search(input) {

        let url = this.host + 'api/pub-title?title=' + encodeURI(input);

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

      getResultValue(result) {
        return result.title
      },

      // when data is filled, emit updated event to parent
      handleSubmit(result) {
        if (result !== undefined) {

          this.uri = "<" + result.uri + ">";

          this.$emit('updated', this.uri, this.pub);
        }


      },


    }
  }
</script>