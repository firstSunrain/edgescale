import Vue from 'vue'
import Router from 'vue-router'
Vue.use(Router)

const userRouter = {
  path: 'user_profile',
  component: resolve => require(['@/components/user/user'], resolve),
  children: [
    {
      path: '',
      name: 'user_profile_overview',
      component: resolve => require(['@/components/user/profile'], resolve)
    }
  ]
}

const modelRouter = {
  path: 'model',
  component: resolve => require(['@/components/model/model'], resolve),
  children: [
    {
      path: '',
      name: 'model_list',
      component: resolve => require(['@/components/model/list'], resolve)
    },
    {
      path: 'edit/:modelId',
      name: 'model_edit',
      component: resolve => require(['@/components/model/edit'], resolve)
    },
    {
      path: 'detail',
      name: 'model_detail',
      component: resolve => require(['@/components/model/detail'], resolve)
    }
  ]
}

const deviceRouter = {
  path: 'device',
  component: resolve => require(['@/components/device/device'], resolve),
  children: [
    {
      path: '',
      name: 'device_list',
      component: resolve => require(['@/components/device/deviceList'], resolve)
    },
    {
      path: 'sub_list/:id',
      name: 'device_sub_list',
      component: resolve => require(['@/components/device/sub'], resolve)
    },
    {
      path: 'detail/:deviceId',
      name: 'device_detail',
      component: resolve => require(['@/components/device/detail'], resolve)
    }
  ]
}

const devgroupRouter = {
  path: 'devgroup',
  component: resolve => require(['@/components/devgroup/group'], resolve),
  children: [
    {
      path: '',
      name: 'device_group_list',
      component: resolve => require(['@/components/devgroup/list'], resolve)
    },
    {
      path: 'detail/:id',
      name: 'device_group_detail',
      component: resolve => require(['@/components/devgroup/detail'], resolve)
    }
  ]
}

const zoomodelRouter = {
  path: 'zoo_model',
  component: resolve => require(['@/components/zoofunction/modelzoo/zoo'], resolve),
  children: [
    {
      path: '',
      name: 'zoo_model_list',
      component: resolve => require(['@/components/zoofunction/modelzoo/list'], resolve)
    },
    {
      path: 'create',
      name: 'zoo_model_create',
      component: resolve => require(['@/components/zoofunction/modelzoo/create'], resolve)
    },
    {
      path: 'detail/:id',
      name: 'zoo_model_detail',
      component: resolve => require(['@/components/zoofunction/modelzoo/detail'], resolve)
    },
    {
      path: 'detail/:id',
      name: 'zoo_dataset_detail',
      component: resolve => require(['@/components/zoofunction/modelzoo/detail_dataset'], resolve)
    },
    {
      path: 'uploadModel',
      name: 'zoo_model_uploadModel',
      component: resolve => require(['@/components/zoofunction/modelzoo/uploadModel'], resolve)
    }
  ]
}
const zooRouter = {
  path: 'zoo',
  component: resolve => require(['@/components/zoofunction/model/zoo'], resolve),
  children: [
    {
      path: '',
      name: 'zoo_list',
      component: resolve => require(['@/components/zoofunction/model/list'], resolve)
    },
    {
      path: 'create',
      name: 'zoo_create',
      component: resolve => require(['@/components/zoofunction/model/create'], resolve)
    },
    {
      path: 'detail/:id',
      name: 'zoo_detail',
      component: resolve => require(['@/components/zoofunction/model/detail'], resolve)
    },
    {
      path: 'uploadModel',
      name: 'zoo_uploadModel',
      component: resolve => require(['@/components/zoofunction/model/uploadModel'], resolve)
    }
  ]
}
const zooAppRouter = {
  path: 'zooApp',
  component: resolve => require(['@/components/zoofunction/app/zoo'], resolve),
  children: [
    {
      path: '',
      name: 'zoo_app_list',
      component: resolve => require(['@/components/zoofunction/app/list'], resolve)
    },
    {
      path: 'create',
      name: 'zoo_app_create',
      component: resolve => require(['@/components/zoofunction/app/create'], resolve)
    },
    {
      path: 'detail/:id',
      name: 'zoo_app_detail',
      component: resolve => require(['@/components/zoofunction/app/detail'], resolve)
    },
    {
      path: 'uploadModel',
      name: 'zoo_app_uploadModel',
      component: resolve => require(['@/components/zoofunction/app/uploadModel'], resolve)
    }
  ]
}
const zooSolutionRouter = {
  path: 'zoo_solution',
  component: resolve => require(['@/components/zoofunction/solution/solution'], resolve),
  children: [
    {
      path: '',
      name: 'zoo_solution_list',
      component: resolve => require(['@/components/zoofunction/solution/list'], resolve)
    },
    {
      path: 'detail/:id',
      name: 'zoo_solution_detail',
      component: resolve => require(['@/components/zoofunction/solution/detail'], resolve)
    }
  ]
}
const zooDeviceRouter = {
  path: 'zoo_device',
  component: resolve => require(['@/components/zoofunction/device/device'], resolve),
  children: [
    {
      path: '',
      name: 'zoo_device_list',
      component: resolve => require(['@/components/zoofunction/device/list'], resolve)
    },
    {
      path: 'detail/:id',
      name: 'zoo_device_detail',
      component: resolve => require(['@/components/zoofunction/device/detail'], resolve)
    }
  ]
}
const zooDistroRouter = {
  path: 'zoo_distro',
  component: resolve => require(['@/components/zoofunction/distro/distro'], resolve),
  children: [
    {
      path: '',
      name: 'zoo_distro_list',
      component: resolve => require(['@/components/zoofunction/distro/list'], resolve)
    },
    {
      path: 'detail/:id',
      name: 'zoo_distro_detail',
      component: resolve => require(['@/components/zoofunction/distro/detail'], resolve)
    }
  ]
}
const dataSetRouter = {
  path: 'zoo_data',
  component: resolve => require(['@/components/zoofunction/dataset/dataset'], resolve),
  children: [
    {
      path: '',
      name: 'zoo_data_list',
      component: resolve => require(['@/components/zoofunction/dataset/list'], resolve)
    },
    {
      path: 'create',
      name: 'zoo_data_create',
      component: resolve => require(['@/components/zoofunction/dataset/create'], resolve)
    },
    {
      path: 'detail/:id',
      name: 'zoo_data_detail',
      component: resolve => require(['@/components/zoofunction/dataset/detail'], resolve)
    }
  ]
}
const engineRouter = {
  path: 'zoo_engine',
  component: resolve => require(['@/components/zoofunction/engine/engine'], resolve),
  children: [
    {
      path: '',
      name: 'zoo_engine_list',
      component: resolve => require(['@/components/zoofunction/engine/list'], resolve)
    },
    {
      path: 'detail/:id',
      name: 'zoo_engine_detail',
      component: resolve => require(['@/components/zoofunction/engine/detail'], resolve)
    }
  ]
}

const customerRouter = {
  path: 'customer',
  component: resolve => require(['@/components/customer/customer'], resolve),
  children: [
    {
      path: '',
      name: 'customer_list',
      component: resolve => require(['@/components/customer/list'], resolve)
    },
    {
      path: 'detail/:id',
      name: 'customer_detail',
      component: resolve => require(['@/components/customer/detail'], resolve)
    }
  ]
}

const mftRouter = {
  path: 'mft',
  component: resolve => require(['@/components/mft/mft'], resolve),
  children: [
    {
      path: '',
      name: 'mft_list',
      component: resolve => require(['@/components/mft/list'], resolve)
    },
    {
      path: 'detail/:id',
      name: 'mft_detail',
      component: resolve => require(['@/components/mft/detail'], resolve)
    }
  ]
}

const keymanRouter = {
  path: 'keyman',
  component: resolve => require(['@/components/keyman/key'], resolve),
  children: [
    {
      path: '',
      name: 'keyman_list',
      component: resolve => require(['@/components/keyman/list'], resolve)
    },
    {
      path: 'detail/:id',
      name: 'keyman_detail',
      component: resolve => require(['@/components/keyman/detail'], resolve)
    }
  ]
}

const fuseRouter = {
  path: 'fuse',
  component: resolve => require(['@/components/fuse/fuse'], resolve),
  children: [
    {
      path: '',
      name: 'fuse_list',
      component: resolve => require(['@/components/fuse/list'], resolve)
    },
    {
      path: 'create',
      name: 'fuse_create',
      component: resolve => require(['@/components/fuse/create'], resolve)
    },
    {
      path: 'detail/:id',
      name: 'fuse_detail',
      component: resolve => require(['@/components/fuse/detail'], resolve)
    }
  ]
}

const solutionRouter = {
  path: 'solution',
  component: resolve => require(['@/components/solution/solution'], resolve),
  children: [
    {
      path: '',
      name: 'solution_list',
      component: resolve => require(['@/components/solution/list'], resolve)
    },
    {
      path: 'detail/:id',
      name: 'solution_detail',
      component: resolve => require(['@/components/solution/detail'], resolve)
    }
  ]
}

const appRouter = {
  path: 'app',
  component: resolve => require(['@/components/app/app'], resolve),
  children: [
    {
      path: '',
      name: 'app_list',
      component: resolve => require(['@/components/app/list'], resolve)
    },
    {
      path: 'detail/:id',
      name: 'app_detail',
      component: resolve => require(['@/components/app/detail'], resolve)
    }
  ]
}

const appDeploymentRouter = {
  path: 'app_deploy',
  component: resolve => require(['@/components/dplapp/dplapp'], resolve),
  children: [
    {
      path: '',
      name: 'app_deploy_list',
      component: resolve => require(['@/components/dplapp/list'], resolve)
    },
    {
      path: 'detail/:id',
      name: 'app_deploy_detail',
      component: resolve => require(['@/components/dplapp/detail'], resolve)
    }
  ]
}

const taskTemplateRouter = {
  path: 'task_template',
  component: resolve => require(['@/components/tasktemplate/template'], resolve),
  children: [
    {
      path: '',
      name: 'template_list',
      component: resolve => require(['@/components/tasktemplate/list'], resolve)
    },
    {
      path: 'detail/:id',
      name: 'template_detail',
      component: resolve => require(['@/components/tasktemplate/detail'], resolve)
    },
    {
      path: 'edit/:id',
      name: 'template_edit',
      component: resolve => require(['@/components/tasktemplate/edit'], resolve)
    }
  ]
}

const softwareSolutionRouter = {
  path: 'software_solution',
  component: resolve => require(['@/components/software/software'], resolve),
  children: [
    {
      path: '',
      name: 'software_solution',
      component: resolve => require(['@/components/software/solution/solution'], resolve)
    },
    {
      path: 'create',
      name: 'software_solution_create',
      component: resolve => require(['@/components/software/solution/create'], resolve)
    },
    {
      path: 'detail/:solutionId',
      name: 'software_solution_detail',
      component: resolve => require(['@/components/software/solution/detail'], resolve)
    },
    {
      path: 'deploy/:id',
      name: 'software_solution_deploy_select_devices',
      component: resolve => require(['@/components/software/solution/selectDevices'], resolve)
    }
  ]
}

const softwareAppRouter = {
  path: 'software_app',
  component: resolve => require(['@/components/software/software'], resolve),
  children: [
    {
      path: '',
      name: 'software_app',
      component: resolve => require(['@/components/software/app/app'], resolve)
    },
    {
      path: 'create',
      name: 'software_app_create',
      component: resolve => require(['@/components/software/app/create'], resolve)
    },
    {
      path: 'detail/:appId',
      name: 'software_app_detail',
      component: resolve => require(['@/components/software/app/detail'], resolve)
    },
    {
      path: 'edit/:appId',
      name: 'software_app_edit',
      component: resolve => require(['@/components/software/app/edit'], resolve)
    },
    {
      path: 'add/:appId',
      name: 'software_app_add',
      component: resolve => require(['@/components/software/app/add'], resolve)
    },
    {
      path: 'document/:appId',
      name: 'software_app_document',
      component: resolve => require(['@/components/software/app/editor'], resolve)
    },
    {
      path: 'deployDeviceList',
      name: 'software_app_deploy_device_list',
      component: resolve => require(['@/components/software/app/deployDeviceList'], resolve)
    },
    {
      path: 'deployStatusList',
      name: 'software_app_deploy_status_list',
      component: resolve => require(['@/components/software/app/deployStatusList'], resolve)
    }
  ]
}

const taskRouter = {
  path: 'task',
  component: resolve => require(['@/components/task/task'], resolve),
  children: [
    {
      path: '',
      name: 'task_list',
      component: resolve => require(['@/components/task/list'], resolve)
    },
    {
      path: 'detail/:taskId',
      name: 'task_detail',
      component: resolve => require(['@/components/task/detail'], resolve)
    }
  ]
}
const manageMirrorRouter = {
  path: 'manage_mirror',
  component: resolve => require(['@/components/management/mirror/mirror'], resolve),
  children: [
    {
      path: '',
      name: 'manage_mirror_list',
      component: resolve => require(['@/components/management/mirror/list'], resolve)
    }
  ]
}
const manageApiUsageRouter = {
  path: 'api_usage',
  component: resolve => require(['@/components/management/api_usage/api_usage'], resolve),
  children: [
    {
      path: '',
      name: 'all_api_usage',
      component: resolve => require(['@/components/management/api_usage/all_api_usage'], resolve)
    }
  ]
}
const manageVendorRouter = {
  path: 'manage_vendor',
  component: resolve => require(['@/components/management/vendor/vendor'], resolve),
  children: [
    {
      path: '',
      name: 'manage_vendor_list',
      component: resolve => require(['@/components/management/vendor/list'], resolve)
    }
  ]
}

const manageUserRouter = {
  path: 'manage_user',
  component: resolve => require(['@/components/management/user/user'], resolve),
  children: [
    {
      path: '',
      name: 'manage_user_list',
      component: resolve => require(['@/components/management/user/list'], resolve)
    },
    {
      path: 'detail/:id',
      name: 'manage_user_detail',
      component: resolve => require(['@/components/management/user/detail'], resolve)
    },
    {
      path: 'config',
      name: 'manage_user_config',
      component: resolve => require(['@/components/management/user/config'], resolve)
    }
  ]
}

const commonAuditRouter = {
  path: 'common_audit',
  component: resolve => require(['@/components/management/audition/audit'], resolve),
  children: [
    {
      path: '',
      name: 'common_audit_list',
      component: resolve => require(['@/components/management/audition/list'], resolve)
    }
  ]
}

const buildRouter = {
  path: 'builder',
  component: resolve => require(['@/components/appbuild/build'], resolve),
  children: [
    {
      path: '',
      name: 'build_list',
      component: resolve => require(['@/components/appbuild/list'], resolve)
    },
    {
      path: 'item',
      name: 'build_item',
      component: resolve => require(['@/components/appbuild/list1'], resolve)
    },
    {
      path: 'create',
      name: 'build_create',
      component: resolve => require(['@/components/appbuild/create'], resolve)
    },
    {
      path: 'edit/:buildName',
      name: 'build_edit',
      component: resolve => require(['@/components/appbuild/edit'], resolve)
    },
    {
      path: 'detail/:buildName',
      name: 'build_detail',
      component: resolve => require(['@/components/appbuild/detail'], resolve)
    },
    {
      path: 'log',
      name: 'build_log',
      component: resolve => require(['@/components/appbuild/log'], resolve)
    }
  ]
}

const authRouter = {
  path: 'auth',
  component: resolve => require(['@/components/auth/list'], resolve),
  children: [
    {
      path: '',
      name: 'auth_list',
      component: resolve => require(['@/components/auth/list'], resolve)
    }
  ]
}

const routes = [
  {
    path: '/',
    component: resolve => require(['@/components/home'], resolve),
    children: [
      {
        path: '',
        name: 'dashboard',
        component: resolve => require(['@/components/dashboard/frame'], resolve)
      },
      userRouter,
      modelRouter,
      deviceRouter,
      devgroupRouter,
      softwareSolutionRouter,
      softwareAppRouter,
      taskRouter,
      buildRouter,
      zoomodelRouter,
      zooRouter,
      zooAppRouter,
      zooSolutionRouter,
      zooDeviceRouter,
      zooDistroRouter,
      dataSetRouter,
      engineRouter,
      solutionRouter,
      mftRouter,
      keymanRouter,
      fuseRouter,
      customerRouter,
      appRouter,
      appDeploymentRouter,
      taskTemplateRouter,
      manageMirrorRouter,
      manageUserRouter,
      commonAuditRouter,
      manageApiUsageRouter,
      manageVendorRouter,
      authRouter
    ]
  },
  {
    path: '/start',
    name: 'start_page',
    component: resolve => require(['@/components/startPage'], resolve)
  },
  {
    path: '/login',
    name: 'login',
    component: resolve => require(['@/components/login'], resolve)
  },
  {
    path: '/password',
    name: 'password',
    component: resolve => require(['@/components/forgetPwd'], resolve)
  },
  {
    path: '/apply',
    name: 'apply',
    component: resolve => require(['@/components/apply'], resolve)
  },
  {
    path: '*',
    redrect: '/'
  }
]
const router = new Router({
  mode: 'history',
  routes
})
export default router
