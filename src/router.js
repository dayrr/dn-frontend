import Vue from 'vue'
import Router from 'vue-router'
import NewDataset from '@/components/NewDataset'
import Ontologies from '@/components/Ontologies'
import Reference from '@/components/Reference'
import Claim from '@/components/Claim'
import UploadFiles from '@/components/UploadFiles'

import Workflow from '@/components/Workflow'
import Service from '@/components/Service'
import Home from '@/components/Home'
import UpdateKB from '@/components/UpdateKB'
import Instance from '@/components/Instance'
import Datasets from '@/components/Datasets'
import Query from '@/components/Query'
import View from '@/components/View'

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [   
    {
      path: '/new-dataset',
      name: 'new-dataset',
      component: NewDataset
    },
    {
      path: '/view',
      name: 'view',
      component: View
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
