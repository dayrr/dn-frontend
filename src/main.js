import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap-vue/dist/bootstrap-vue.css';
import 'vue-search-select/dist/VueSearchSelect.css';
import './custom.css';
import Vue from 'vue';
import App from '@/App.vue';
import axios from 'axios';
import VueAxios from 'vue-axios';
import router from '@/router';
import BootstrapVue from 'bootstrap-vue';
import Agento from './components/Agento.vue';
import Publicationo from './components/Publicationo.vue';
import MetaInput from './components/MetaInput.vue';
import UploadFiles from './components/UploadFiles.vue';
import Autocomplete from '@trevoreyre/autocomplete-vue';
import Dropdown from 'vue-simple-search-dropdown';
import "vue-vis-network/node_modules/vis-network/dist/vis-network.css";
import '@trevoreyre/autocomplete-vue/dist/style.css';
import { Network } from "vue-vis-network";
import { ModelSelect } from 'vue-search-select';
import VueGraph from 'vue-graph';
import VueWordCloud from 'vuewordcloud';
import VueCodemirror from 'vue-codemirror';
import VueConfirmDialog from 'vue-confirm-dialog'

// require styles
import 'codemirror/lib/codemirror.css'
// require more codemirror resource...
 // you can set default global options and events when use
Vue.use(VueCodemirror, /* { 
  options: { theme: 'base16-dark', ... },
  events: ['scroll', ...]
} */)

Vue.component(VueWordCloud.name, VueWordCloud);
Vue.use(VueConfirmDialog)
Vue.component('vue-confirm-dialog', VueConfirmDialog.default)

Vue.use(VueGraph);
Vue.use(Dropdown);
Vue.use(ModelSelect);
Vue.use(BootstrapVue);
Vue.use(VueAxios, axios);
Vue.use(Autocomplete);
Vue.config.productionTip = false;
Vue.config.devtools = false;
Vue.component('network', Network);
Vue.component('Agento', Agento);
Vue.component('Publicationo', Publicationo);
Vue.component('UploadFiles', UploadFiles);
Vue.component('MetaInput', MetaInput);

Vue.prototype.host = 'http://melodi.irit.fr/';
Vue.prototype.graphdb = 'http://melodi.irit.fr/graphdb/';
Vue.prototype.dataverse = 'http://melodi.irit.fr:8080/';

//Vue.prototype.host = 'http://localhost:8000/';
//Vue.prototype.graphdb = 'http://localhost:7200/';
//Vue.prototype.dataverse = 'http://localhost:8085/';
Vue.prototype.calisto = '';

Vue.component('Dropdown', Dropdown);
const vue = new Vue({
  router,
  render: h => h(App)
})
vue.$mount('#app')

