import com from './comZh'
import tip from './tipZh'
import eiq from './eiqZh'
import err from './errZh'
const mainZh = {
  input_check_msg: '项目名必须是 2 到 255 字符. 可以包含字母 A-Z 或者 a-z, 数字, 特殊字符 - 和_',
  signIn: "登陆",
  signUp: "注册",
  login: "登陆",
  first_name: '名字',
  last_name: '姓氏',
  user_profile: '用户配置',
  email: '邮箱',
  account_type: '账户类型',
  company: '公司名称',
  telephone: '手机号码',
  all_view: '总览',
  job: '工作',
  identify:'用户识别',
  helpDocument: '帮助文档',
  apply_account: '申请账户',
  not_audit: '未审核',
  sub_list: '外联设备',
  install: '安装',
  uninstall: '卸载',
  stop: '关闭',
  apply_now: '注册',
  send_email_msg: '您的请求已经发送给管理员， 结果会以邮件的方式发送到您的邮箱， 请查收！',
  input_email: '请输入您的用户名或邮箱',
  email_send: '更改链接已经发送到您的邮箱',
  deployStatusList: '部署状态',
  username_email: '用户名 / 邮箱',
  key_add_msg: '添加密钥',
  send_email: '发送邮件',
  confirm_pwd: '确认密码',
  forgot: "忘记密码 ?",
  reset_success: '重置成功',
  system_login_in: '系统将跳转到登陆页面',
  noAccount: "没有账号 ?",
  basic_info: '基本信息',
  limit_info: '限制信息',
  max_limit: '最大限制',
  home_device_model: '设备型号',
  change_user_status: '改变用户状态',
  deviceModel: "设备型号",
  deviceList: "我的设备",
  deviceGroup: "设备分组",
  software: "软件管理",
  messageCenter: "消息中心",
  my_solution: "系统镜像",
  my_app: "我的应用",
  signIn: '登录',
  signUp: '注册',
  login: '登录',
  head_pic: '头像',
  forgot: '忘记密码？',
  noAccount: '没有帐户？',
  semiconductors: 'NXP',
  rights: '版权所有',
  customer: '客户管理',
  device: '设备管理',
  solution: '系统镜像',
  software_solution: '系统镜像',
  software_app: '应用',
  task: '任务管理',
  taskList: '任务列表',
  taskTemplate: '任务模板',
  manufacture: '批量注册设备',
  appStore: '应用商店',
  solutionStore: '系统镜像',
  manage_mirror: '镜像管理',
  deploy_software: '软件部署',
  my_deploy: '我的部署',
  latest_deploy: '最新部署',
  history_deploy: '历史部署',
  manage_user: '用户管理',
  manage_vendor: '供应商管理',
  modelZoo: '模型中心',
  dataset: '数据集',
  trainingEngine: '训练引擎',
  inferenceEngine: '推理机',
  account: '用户管理',
  account_list: '用户列表',
  accountAudit: '用户审核',
  dockerRegistry: 'Docker仓库',
  vendor: '供应商',
  appAudit: '应用审核',
  endpointConfig: '端点配置',
  apiStatistics: 'API统计',
  smartConnect: '智能连接',
  edgeSoftwareStore: 'Edge软件中心',
  eIqCloud: 'eIQ云',
  admin: '管理',
  changePassword: '更改密码',
  headPortrait: '更换头像',
  logout: "退出登录",
  help: '帮助',
  noImage: "没有图片？下载试试",
  message: "消息",
  search: '搜索',
  noData: "暂无数据",
  nav_home: '主页',
  nav_manage: '管理',
  nav_apiUsage: 'Api使用',
  allApiStatistice: '所有API统计',
  createDeviceStatistice: '创建设备统计',
  deployAppStatistice: '部署应用统计',
  OTAStatistice: 'OTA统计',
  dash_solution_chart_tit: '系统镜像在设备上的分布',
  dash_app_chart_tit: '应用在设备上的分布',
  dash_dev_area_statistics: '设备分布报表',
  dash_dev_status_statistics: '设备生命周期统计',
  dash_theme: '主题',
  device_name: '设备名称',
  public_model: '共享型号',
  private_model: '我的型号',
  dash_dev_distribute: '设备分布',
  dash_dev_statistics: '设备报表',
  dash_app_statistics: '应用报表',
  dash_solution_statistics: '系统镜像报表',
  customer_list: '客户列表',
  customer_del_msg: '确定要删除当前客户吗?',
  model_list: '型号列表',
  model_del_msg: '删除该型号后，与之相关的所有设备和软件都会移除，确定要继续吗？',
  device_list: '设备列表',
  device_create: '创建设备',
  save_as_group: '保存成组',
  save_as_template: '保存成模板',
  bind_tags: '绑定标签',
  last_report: '最近一次上报',
  local_ip: '本地IP',
  certname: '证书名称',
  edgescale_version: 'Edgescale 版本',
  app_number: '应用数量',
  display_name: '表现名称',
  solution_name: '系统镜像',
  project_name: '项目名称',
  model_name: '型号',
  customer_name: '客户',
  artifacts: 'Artifacts',
  commands: '命令',
  app_name: '应用名称',
  destroy: '销毁',
  source_code: '源代码',
  destroy_msg: '执行该操作后，设备上所有的数据将会被擦除，您确定要继续吗？',
  active_dev_msg: '设备激活成功，过程要持续几分钟，请耐心等待',
  inactive_dev_msg: '免激活设备成功',
  del_device_msg: '确定要删除所选中的设备吗?',
  Active_enroll_msg: '请下载并运行bootstrap脚本',
  Inactive_enroll_msg: '该操作会使设备在云端所有的操作失效，若要重新连入，需要重新注册新纪录来登记连入，您确定要继续吗？',
  download_dev_cert: '下载设备证书',
  download_dev_cert_msg: '请下载该设备的证书.',
  create_dev_no: '创建设备序号',
  generate_dev_no: '生成设备 ID 序号',
  dev_no: '设备序号',
  register_dev: '登记设备',
  device_group: '设备分组',
  devgroup: '设备分组',
  all_my_group: '所有创建组',
  dev_loc_chart: '设备位置报表',
  dev_status_chart: '设备状态报表',
  arguments: '参数',
  more_arguments: '更多参数',
  del_group_msg: '确定要删除所选中的设备组吗?',
  host_arguments: '主机参数',
  volume_arguments: '挂载参数',
  env_arguments: '环境变量参数',
  read_only: '只读',
  permission_arguments: '权限参数',
  network_arguments: '网络参数',
  host_network: '主机网络',
  host_port: '主机端口',
  container_port: '容器端口',
  host_path: '主机路径',
  mount_path: '挂载路径',
  cap_add: '添加Cap',
  solution_list: '系统镜像列表',
  app_list: '应用列表',
  add_docker_arguments: '添加 Docker 参数',
  del_task_msg: '确定要删除当前的任务吗?',
  if_continue: '确定要继续吗?',
  task_tem_list: '任务模板列表',
  task_tem: '任务模板',
  task_template: '任务模板',
  del_tem_msg: '确定要删除所选中的任务模板吗 ?',
  add_app: '添加应用',
  mft_list: '批量注册列表',
  offline_number: '离线数量',
  active_number: '激活数量',
  online_number: '在线数量',
  app_market: '应用市场',
  add_to_my_app: '添加到我的应用',
  del_app_msg: '确定要删除当前应用吗?',
  new_tag: '添加标签',
  app_doc: '应用文档',
  app_image_name: '应用镜像名',
  upload_app_icon: '上传应用图标',
  solution_link: '系统镜像链接',
  del_solution_msg: '请确保该系统镜像不是默认镜像',
  edit_solution_tip: '确定要放弃当前操作吗?',
  edit_solution_msg: '设置为默认系统镜像',
  public_key: '公钥',
  loc_firmware: '固件地址',
  upload_firmware: '上传固件镜像',
  image_url: '镜像地址',
  is_default: '默认系统镜像',
  install_solution_msg: '系统镜像中是否存在安装程序',
  builder_pended: '等待中...',
  builder_failed: '失败',
  builder_fault: '错误',
  builder_stop: '停止',
  builder_time_out: '超时',
  builder_succeeded: '成功',
  builder_inprogress: '进行中...',
  last_build: '最新一次启动',
  build_history: '编译历史',
  builder_start_msg: '确定要启动当前项目吗?',
  source_code: '代码源',
  source_provider: '代码提供方',
  pollForSourceChanges: '定期检查更新',
  sourceProvider: '代码提供方',
  check_change: '定期检查更新',
  build_env: '构建环境',
  repository: '代码仓库',
  branch: '分支',
  computer_type: '计算机类型',
  computeType: '计算机类型',
  env: '环境',
  aws_image: 'AWS 镜像',
  docker_image: 'DockerHub 镜像',
  filter_condition: '过滤条件',
  object_key: 'S3上传',
  cpu_usage: 'CPU 使用率',
  mem_usage: 'Memory 使用率',
  disk_usage: 'Disk 使用率',
  setting_limit: '设置限制',
  user_id: '用户ID',
  limit_type: '限制类型',
  max_limit: '最大限制',
  max_seconds: '最长时间',
  key_strength: '密钥强度',
  key_algorithm: '密钥算法',
  key_auto: '自动生成密钥',
  sign_solution: '系统镜像签名',
  key_upload: '上传已有密钥',
  app_log: '应用日志',
  reason: '状态',
  selected_devices: '已选择的设备',
  all_filter_devices: '所有过滤设备',
  add_device_to_group: '添加设备到分组',
  group_name: '组名称',
  bind_to_group: '绑定到设备组',
  start_p1: 'Edgescale-使边缘计算安全且可管理',
  start_p2: 'Edgescale是一个可扩展且功能强大的平台，可帮助您轻松连接物联网、管理设备和部署应用程序。此页面提供了如何注册设备和部署应用程序的典型工作流。',
  get_start: '开始',
  start_model: '创建并注册设备型号, 型号是设备的一个重要属性，它会限制设备部署对应的镜像',
  start_dev: '创建并注册设备, 并且将云端数据和实际设备绑定',
  start_app: '注册和上传基于容器的应用程序, 部署应用到指定设备',
  start_solution: '注册并上传 固件/系统 镜像, 部署镜像到指定设备',
  app_deploy: '部署应用',
  solution_deploy: '部署系统镜像',
  start_app_deploy: '在设备上部署应用并创建任务',
  start_solution_deploy: '部署 固件/系统 镜像到设备并创建任务',
  start_task: '部署完成，生成对应任务，查看任务状态',
  see_more: '使用文档',
  create_mft_config: '创建设备预置',
  root_key_hash: '根哈希密钥',
  download_template: '下载模板',
  confile_type: '配置类型',
  setting_generate: '手动设置生成',
  upload_config: '上传配置文件',
  create_app: '创建应用',
  config_app: '配置应用',
  audit: '审核',
  solutionAudit: '系统镜像审核',
  modelAudit: '型号审核',
  appAudit: '应用审核',
  add_image: '添加Docker镜像',
  docker_config: 'Docker 配置',
  port: '端口',
  ca_config: 'CA 配置',
  service_config: '服务配置',
  update: '更新',
  attribute: '属性',
  Approved: '通过',
  Rejected: '拒绝',
  Pending: '待审核',
  check_code: '校验代码',
  check_type: '校验类型',
  ota_create: '创建固件',
  ota_edit: '编辑固件',
  sub_edit: '编辑设置'
}
let message = {}
Object.assign(message, com, tip, eiq, err, mainZh)
export default message