<template>
  <div id="app">
    <vue-confirm-dialog></vue-confirm-dialog>
    <div>
      <b-navbar type="dark" variant="dark">
        <b-navbar-nav>
          <b-nav-item :to="{ name: 'home' }">Home</b-nav-item>
          <b-nav-item :to="{name: 'view', query:{cls:'agents'}}">
            Agent
          </b-nav-item>
          <b-nav-item :to="{name: 'view', query:{cls:'claims'}}">
            Claim
          </b-nav-item>
          <b-nav-item :to="{name: 'view', query:{cls:'datasets'}}">
            Dataset
          </b-nav-item>
          <b-nav-item :to="{name: 'view', query:{cls:'publications'}}">
            Publication
          </b-nav-item>
          <b-nav-item :to="{name: 'view', query:{cls:'services'}}">
            Service
          </b-nav-item>
          <b-nav-item :to="{name: 'work'}">
            Workflow
          </b-nav-item>


      
            <img class="logo"
              src="https://datanoos.univ-toulouse.fr/themes/custom/bootstrap_datanoos/images/logos/logo-dataNooS-couleur.png" />
         

        </b-navbar-nav>
        <b-navbar-nav class="ml-auto">
          <b-nav-item-dropdown text="Administration" right>
            <b-dropdown-item :to="{ name: 'agent' }">
              New Agent
            </b-dropdown-item>
            <b-dropdown-item :to="{ name: 'claim' }">
              New Claim
            </b-dropdown-item>
            <b-dropdown-item :to="{ name: 'new-dataset' }">
              New Dataset
            </b-dropdown-item>
            <b-dropdown-item :to="{ name: 'pub' }">
              New Publication
            </b-dropdown-item>
            <b-dropdown-item :to="{ name: 'service' }">
              New Service
            </b-dropdown-item>
                 <b-dropdown-item :to="{ name: 'import-meta' }">
             Import Datasets
            </b-dropdown-item>
            <b-dropdown-item v-on:click="openExport" href="#">
             Export Datasets
            </b-dropdown-item>

          </b-nav-item-dropdown>
        </b-navbar-nav>

        <b-navbar-nav>
          <b-nav-item-dropdown text="Tools" right>
            <b-dropdown-item :to="{ name: 'kb' }">
              Update KB
            </b-dropdown-item>
            <b-dropdown-item :to="{name: 'query'}">
              Query KB
            </b-dropdown-item>
             <b-dropdown-item :to="{name: 'onto'}">
              Ontologies
            </b-dropdown-item>
            <b-dropdown-item :to="{name: 'harvest-sites'}">
              Harvesting Sites
            </b-dropdown-item>
          </b-nav-item-dropdown>
        </b-navbar-nav>

        <b-navbar-nav class="">
          <b-nav-item-dropdown text="Links" right>
            <b-dropdown-item v-on:click="open" href="#">
              GraphDB
            </b-dropdown-item>
            <b-dropdown-item v-on:click="opendv" href="#">
              Dataverse
            </b-dropdown-item>
            <b-dropdown-item v-on:click="opendv" href="#">
              Calisto
            </b-dropdown-item>
          </b-nav-item-dropdown>
        </b-navbar-nav>

        <b-navbar-nav>
          <b-nav-item :to="{name: 'work', query:{uri:'NA'}}">
            Help
          </b-nav-item>
        </b-navbar-nav>

      </b-navbar>

    </div>
    <div class='rv'>
      <router-view />
    </div>

    <footer class="footer">
      <a href="https://datanoos.univ-toulouse.fr/"> DataNOOS - from DATA to a NOOSphere - 2021 </a>
    </footer>
  </div>
</template>
<script>
  export default {
    methods: {
      created() {
        document.title = "DataNoos";
      },

      open: function () {
        window.open(this.graphdb, '_blank');
      },

      opendv: function () {
        window.open(this.dataverse, '_blank');

      },

       openExport: function () {
        
        window.open(this.host + 'api/datasets', '_blank');

      }

    }

  }
</script>