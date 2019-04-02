import Vue from 'vue'
import Router from 'vue-router'

import AppView from '@/components/app-view'
import Home from '@/pages/home'

Vue.use(Router)

const page = name => () => import('@/pages/' + name)

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '',
      component: AppView,
      children: [
        {path: '/', name: 'home', component: Home},
        {path: '/all-task', name: 'all-task', component: page('all-task')},
        {path: '/task-info', name: 'task-info', component: page('task-info')},
        {path: '/add-task', name: 'add-task', component: page('add-task')},
        {path: '/host-info', name: 'host-info', component: page('host-info')},
        {path: '/vlan-info', name: 'vlan-info', component: page('vlan-info')},
        {path: '/ambient-info', name: 'ambient-info', component: page('ambient-info')},
        {path: '/host-monitor', name: 'host-monitor', component: page('host-monitor')},
        {path: '/dashboard-monitor', name: 'dashboard-monitor', component: page('dashboard-monitor')},
        {path: '/user-admin', name: 'user-admin', component: page('user-admin')},
        {path: '/user-group', name: 'user-group', component: page('user-group')},
        {path: '/role-info', name: 'role-info', component: page('role-info')},
        {path: '/API-info', name: 'API-info', component: page('API-info')},
        {path: '/user-info', name: 'user-info', component: page('user-info')},
        {path: '/project-info', name: 'project-info', component: page('project-info')},
        {path: '/project-setting', name: 'project-setting', component: page('project-setting')},
        {path: '/release-step', name: 'release-step', component: page('release-step')},
        {path: '/git-info', name: 'git-info', component: page('git-info')},
        {path: '/release-order', name: 'release-order', component: page('release-order')},
        {path: '/404', name: '404', component: page('404')},
        {path: '/500', name: '500', component: page('500')},
      ]
    },
    // pages
    {path: '/home-login', name: 'p-login', component: page('home-login')},
    {path: '/register', name: 'p-register', component: page('register')},
    {path: '*', redirect: {name: '404'}}
  ]
})
