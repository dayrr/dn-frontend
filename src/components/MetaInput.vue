<template>
  <div>
    <b-form-group v-bind:description="metaInput.comment" v-bind:label="metaInput.label + ' (' + metaInput.uri + ')'"
      label-cols-sm="5" label-cols-lg="5">
      <b-form-input v-model="inputValue" class="form-control" @keyup="updateProp" v-bind:placeholder="metaInput.range">
      </b-form-input>
      <b-alert variant="success" :show="alert">Please enter an URI</b-alert>
    </b-form-group>
  </div>
</template>


<script>
 // define a component that can be included by other ones.
  //import Autocomplete from '@trevoreyre/autocomplete-vue'
  export default {
    name: 'MetaInput',
    props: ['metaInput'],
    data() {
      return {
        inputValue: '',
        uri: '',
        alert: false

      }

    },
    created: function () {

    },
    methods: {
      //check if the range of the predicate is a literal or a not
      updateProp() {
        if (!this.metaInput.range.toLowerCase().includes("literal"))
          if (!this.inputValue.includes("http"))
            this.alert = true;
          else
            this.alert = false;

        this.$emit('updated', this.inputValue, this.metaInput);

      }
    }


  }
</script>