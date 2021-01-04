<template>
  <div id="app">
    <div>
      <b-navbar type="dark" variant="dark">
        <b-navbar-nav>
          <b-nav-item :to="{ name: 'home' }">Home</b-nav-item>
          <b-nav-item-dropdown text="Publication" right>
            <b-dropdown-item :to="{ name: 'ref' }">
              New Publication
            </b-dropdown-item>
            <b-dropdown-item  :to="{ name: 'pubs' }">List</b-dropdown-item>
          </b-nav-item-dropdown>

          <!-- Navbar dropdowns -->
          <b-nav-item-dropdown text="Dataset" right>
            <b-dropdown-item :to="{ name: 'new-dataset' }">
              New dataset
            </b-dropdown-item>
            <b-dropdown-item  :to="{ name: 'all-datasets' }">List</b-dropdown-item>
         
          </b-nav-item-dropdown>

          <b-nav-item-dropdown text="Claim" right>
            <b-dropdown-item :to="{ name: 'claim' }">
              New Claim
            </b-dropdown-item>
            <b-dropdown-item :to="{ name: 'claims' }">List</b-dropdown-item>
          </b-nav-item-dropdown>

          <b-nav-item-dropdown text="Service" right>
            <b-dropdown-item :to="{ name: 'service' }">
              New Service
            </b-dropdown-item>
            <b-dropdown-item :to="{ name: 'services' }">List</b-dropdown-item>
          </b-nav-item-dropdown>



          <b-nav-item-dropdown text="Workflow" right>
            <b-dropdown-item :to="{ name: 'work' }">New Workflow </b-dropdown-item>
            <b-dropdown-item href="#">List</b-dropdown-item>
          </b-nav-item-dropdown>



        </b-navbar-nav>

        <b-navbar-nav class="ml-auto">
          <b-nav-item href="#">
            <router-link :to="{ name: 'kb' }"> Update KB </router-link>
          </b-nav-item>

               <b-nav-item href="#">
            <router-link :to="{ name: 'query' }"> Query KB </router-link>
          </b-nav-item>


        
          <b-nav-item href="#">
            <router-link :to="{ name: 'ontologies' }"> Ontologies </router-link>
          </b-nav-item>
          <b-nav-item v-on:click="open" href="#">
            Triplestore
          </b-nav-item>

          <b-nav-item v-on:click="opendv" href="#">
            Dataverse
          </b-nav-item>


        </b-navbar-nav>

      </b-navbar>
    </div>
    <div class='rv'>
      <router-view />
    </div>
  </div>
</template>

<style>
  .rv {
    margin: 8px;
    padding: 4px;
  }
</style>

<script>
  export default {
    methods: {
      created() {
        document.title = "DataNoos";        
      },

      open: function () {
        window.open("http://melodi.irit.fr/graphdb/", '_blank');
      },

      opendv: function () {
        window.open("http://melodi.irit.fr:8080", '_blank');

      }
    }

  }
</script>