const menus = [
  {id: 'index', label: '控制面板', path: '/', icon: 'fa fa-home'},
  {
    id: 'task', icon: 'fa fa-archive', label: '任务管理',
      submenu: [
        {id: 'task-info', name: 'task-info', label: '我的任务', icon: 'fa fa-bookmark'},
        {id: 'all-Task', name: 'all-task', label: '全部任务', icon: 'fa fa-book'},
        {id: 'add-ask', name: 'add-task', label: '添加任务', icon: '	fa fa-bookmark-o'}
      ]
  },
  {
    id: 'host', icon: 'fa fa-database', label: '资产管理',
      submenu: [
        {id: 'host-info', name: 'host-info', label: '服务器管理', icon: 'fa fa-desktop'},
        {id: 'project-info', name: 'project-info', label: '项目管理', icon: 'fa fa-folder'},
        {id: 'project-setting', name: 'project-setting', label: '配置管理', icon: 'fa fa-cog'},
        {id: 'ambient-info', name: 'ambient-info', label: '环境管理', icon: 'fa fa-cubes'},
        {id: 'vlan-info', name: 'vlan-info', label: 'vlan管理', icon: 'fa fa-cube'}
        
        
      ]
  },
  {
    id: 'release', icon: '	fa fa-institution', label: '发布管理',
      submenu: [
        {id: 'release-order', name: 'release-order', label: '工单管理', icon: 'fa fa-archive'},
        {id: 'release-step', name: 'release-step', label: '步骤管理', icon: 'fa fa-dot-circle-o'},
        {id: 'git-info', name: 'git-info', label: 'GIT管理', icon: 'fa fa-language'},
      ]
  },
  {
    id: 'user', icon: 'fa fa-address-book', label: '用户管理', 
      submenu: [
        {id: 'user-info', path: 'user-info', label: '个人信息', icon: 'fa fa-drivers-license'},
        {id: 'user-admin', path: 'user-admin', label: '用户管理', icon: 'fa fa-group'},
        {id: 'user-group', path: 'user-group', label: '部门管理', icon: 'fa fa-handshake-o'}
      ]
  },
  {
    id: 'role', icon: 'fa fa-gears', label: '权限管理', 
      submenu: [
        {id: 'role-info', path: 'role-info', label: '角色管理', icon: 'fa fa-street-view'},
        {id: 'API-info', path: 'API-info', label: 'API管理', icon: 'fa fa-info-circle'}
      ]
  },
  {
    id: 'monitor', icon: 'fa fa-bar-chart', label: '资源监控',
      submenu: [
        {id: 'dashboard-monitor', path: 'dashboard-monitor', label: '资源大盘', icon: 'fa fa-dashboard'},
        {id: 'host-monitor', path: 'host-monitor', label: '主机资源', icon: 'fa fa-map-signs'}
      ]
  }
]
export default menus
