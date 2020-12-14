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
import Home from '@/components/Home'
import UpdateKB from '@/components/UpdateKB'

Vue.use(Router)

export default new Router({
  routes: [   
    {
      path: '/new-dataset',
      name: 'new-dataset',
      component: NewDataset
    },

    {
      path: '/claim',
      name: 'claim',
      component: Claim
    },  
    {
      path: '/home',
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
    }
  ]
})
