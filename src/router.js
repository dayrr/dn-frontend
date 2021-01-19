import Vue from 'vue'
import Router from 'vue-router'
import NewDataset from '@/components/Dataset'
import Ontologies from '@/components/Ontologies'
import Pub from '@/components/Publication'
import Claim from '@/components/Claim'
import UploadFiles from '@/components/UploadFiles'
import Workflow from '@/components/Workflow'
import Service from '@/components/Service'
import Home from '@/components/Home'
import Agent from '@/components/Agent'
import UpdateKB from '@/components/UpdateKB'
import Instance from '@/components/Instance'
import Datasets from '@/components/Datasets'
import Query from '@/components/Query'
import View from '@/components/View'
import ImportMeta from '@/components/ImportMeta'

Vue.use(Router)

export default new Router({

  routes: [  
    {
      path: '/import-meta',
      name: 'import-meta',
      component: ImportMeta
    },

    {
      path: '/agent',
      name: 'agent',
      component: Agent
    },

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
      path: '/pub',
      name: 'pub',
      component: Pub
    },
    {
      path: '/onto',
      name: 'onto',
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
    },

    {
      path: '/query',
      name: 'agents',
      component: Query
    }
  ]
})
