<template>

      <b-form-group id="fieldset-22" description="Search by name, enter at least four letters" label="Name*" label-for="input-22" state="state" label-cols-sm="1"
        label-cols-lg="1">
        <autocomplete  ref="ac" aria-label="Name" placeholder="Name" :search="search" :get-result-value="getResultValue"
          @submit="handleSubmit">
          <template #result="{ result, props }">
            <li v-bind="props" class="autocomplete-result">
              <div>
                {{ result.name }}
              </div>
              <div>{{result.email}} </div>
            </li>
          </template>
        </autocomplete>
      </b-form-group>
</template>

<script>
  //import Autocomplete from '@trevoreyre/autocomplete-vue'
  export default {
    name: 'Agento',
    props: ['agent'],
    data() {
      return {
        email: '',
        name: '',
        uri:''

      }

    },

  

    methods: {    

      search(input) {
        let url = this.host + 'api/agent?name=' + encodeURI(input);

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
        return result.name
      },

      handleSubmit(result) {
        if (result !== undefined) {         
          
            this.uri = "<"+result.uri+">";
            this.name = result.name;
            this.email = result.email;

          this.$emit('updated', this.uri, this.name,  this.email, this.agent);
          }
      }
    }

  }
</script>