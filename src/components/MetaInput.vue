<template>
  <div>
    <h4>{{props[0].domainLabel}}</h4>
    <h6>{{props[0].domain}}</h6>

    <b-form-group v-for="metaInput in props" v-bind:key="metaInput"  v-bind:description="metaInput.comment" v-bind:label="metaInput.label" label-cols-sm="2" label-cols-lg="2">
      <b-form-input class="form-control" v-on:change="updateProp" v-bind:placeholder="metaInput.range"></b-form-input>
    </b-form-group>
  </div>
</template>


<script>
  //import Autocomplete from '@trevoreyre/autocomplete-vue'
  export default {
    name: 'MetaInput',
    props: ['props', 'domain'],
    data() {
      return {
        inputValue: '',
        uri:''

      }

    },
    created: function () {
  
      this.uri = "<http://melodi.irit.fr/resource/" + this.props[0].domainLabel.replaceAll(" ","")+"/" + new Date().getTime() + ">";

    },
    methods:
    {
      updateProp()
      {
        alert(1);
      }
    }


  }
</script>