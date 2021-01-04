import Vue from 'vue'
import Router from 'vue-router'
import NewDataset from '@/components/NewDataset'
import Ontologies from '@/components/Ontologies'
import Reference from '@/components/Reference'
import Claim from '@/components/Claim'
import UploadFiles from '@/components/UploadFiles'
import Meta from '@/components/Meta'
import Workflow from '@/components/Workflow'
import Service from '@/components/Service'
import Services from '@/components/Services'
import Home from '@/components/Home'
import Pubs from '@/components/Publications'
import UpdateKB from '@/components/UpdateKB'
import Instance from '@/components/Instance'
import Datasets from '@/components/Datasets'
import Claims from '@/components/Claims'
import All_Datasets from '@/components/All_Datasets'
import Query from '@/components/Query'

Vue.use(Router)

export default new Router({
  routes: [   
    {
      path: '/new-dataset',
      name: 'new-dataset',
      component: NewDataset
    },
    {
      path: '/claims',
      name: 'claims',
      component: Claims
    },

    {
      path: '/all-datasets',
      name: 'all-datasets',
      component: All_Datasets
    },


    {
      path: '/pubs',
      name: 'pubs',
      component: Pubs
    },

    {
      path: '/services',
      name: 'services',
      component: Services
    },



    {
      path: '/instance',
      name: 'instance',
      component: Instance
    },

    {
      path: '/datasets',
      name: 'datasets',
      component: Datasets
    },



    {
      path: '/claim',
      name: 'claim',
      component: Claim
    },  
    {
      path: '/',
      name: 'home',
      component: Home
    }, 
    {
      path: '/kb',
      name: 'kb',
      component: UpdateKB
    },   

    {
      path: '/work',
      name: 'work',
      component: Workflow
    }, 

    {
      path: '/meta',
      name: 'meta',
      component: Meta
    },
    {
      path: '/ref',
      name: 'ref',
      component: Reference
    },
    {
      path: '/ontologies',
      name: 'ontologies',
      component: Ontologies
    },
    {
      path: '/upload-files',
      name: 'upload-files',
      component: UploadFiles
    },
    {
      path: '/service',
      name: 'service',
      component: Service
    },
    {
      path: '/query',
      name: 'query',
      component: Query
    }
  ]
})
