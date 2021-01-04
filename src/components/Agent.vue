<template>
  <b-card-text>
    <div class="row">
      <div class="col">
        <hr>
      </div>
      <div class="col-auto">{{agent.agentType}}-{{agent.idxLocal}}</div>
      <div class="col">
        <hr>
      </div>
    </div>
    <div>
      <b-form-group id="fieldset-21" description="Generated automatically" label="URI" label-for="input-21"
        state="state" label-cols-sm="1" label-cols-lg="1">
        <b-form-input id="input-21" v-model="changedUri" disabled></b-form-input>
      </b-form-group>


      <b-form-group id="fieldset-22" description="" label="Name*" label-for="input-22" state="state" label-cols-sm="1"
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



      <b-form-group id="fieldset-23" description="" label="Email" label-for="input-23" state="state" label-cols-sm="1"
        label-cols-lg="1">
        <b-form-input id="input-23" v-model="email" placeholder="Email" type="email" v-on:change="update">
        </b-form-input>
      </b-form-group>


    </div>
  </b-card-text>
</template>

<script>
  //import Autocomplete from '@trevoreyre/autocomplete-vue'
  export default {
    name: 'Agent',
    props: ['agent'],
    data() {
      return {
        email: '',
        name: '',
        tempUri: '',
        changedUri: ''

      }

    },
    created: function () {
      this.tempUri = this.agent.uri;
      this.changedUri = this.agent.uri;

    },

    methods: {


      update() {
          this.$emit('updated', this.name, this.email, this.changedUri, this.agent)
        
      },

      search(input) {
        const url = `http://melodi.irit.fr/api/agent?name=${encodeURI(input)}`

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
        if (result === undefined) {
          this.changedUri = this.tempUri;
          this.email == "";
          this.name = this.$refs.ac.$refs.input.value;
          
        } else {
          this.changedUri = "<"+result.uri+">";
          this.email = result.email;
          this.name = result.name;
        }
        this.$emit('updated', this.name, this.email, this.changedUri, this.agent)
      }
    }

  }
</script>