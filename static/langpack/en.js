import com from './comEn'
import tip from './tipEn'
import eiq from './eiqEn'
import err from './errEn'
const mainEn = {
  input_check_msg: 'Project names must be 2 to 255 characters. They can include the letters A-Z and a-z, the numbers 0-9, and the special characters - and_',
  signIn: "Sign In",
  signUp: "Sign Up",
  login: "LOGIN",
  first_name: 'First Name',
  last_name: 'Last Name',
  email: 'Email',
  user_profile: 'User Setting',
  helpDocument: 'Help Document',
  account_type: 'Account Type',
  company: 'Company Name',
  telephone: 'Telephone',
  job: 'Job',
  sub_list: 'Subordinate',
  identify:'Identify',
  install: 'Install',
  uninstall: 'Uninstall',
  stop: 'Stop',
  not_audit: 'Not Audit',
  all_view: 'Dashboard',
  apply_account: 'Apply Account',
  apply_now: 'Apply Now',
  send_email_msg: 'Your request has been sent, the response will be sent to your email, please check ! ',
  input_email: 'Please input your username or email',
  email_send: 'An email link will be sent',
  username_email: 'Username / Email',
  deployStatusList: 'Deploy Status',
  key_add_msg: 'Add Key',
  send_email: 'Send Email',
  confirm_pwd: 'Confirm Password',
  forgot: "Forgot your password ?",
  reset_success: 'Reset successfully',
  system_login_in: 'The system will reload to login in',
  noAccount: "Don't have an account ?",
  basic_info: 'BASIC INFORMATION',
  limit_info: 'LIMIT INFORMATION',
  max_limit: 'Max Limit',
  semiconductors: "NXP Semiconductors",
  messageCenter: "Message Center",
  rights: "All rights reserved",
  home_device_model: 'Device model',
  change_user_status: 'Change User Status',
  deviceModel: "Device Model",
  deviceList: "My Devices",
  deviceGroup: "Device Group",
  software: "Software",
  my_solution: "My Solution",
  my_app: "My App",
  taskList: "Task List",
  taskTemplate: "Task Template",
  manufacture: "Manufacture",
  appStore: "App Store",
  my_deploy: 'My Deployment',
  latest_deploy: 'Latest Deployment',
  history_deploy: 'History Deployment',
  solutionStore: "Solution Store",
  builder: "Builder",
  modelZoo: "Model Zoo",
  dataset: "Dataset",
  head_pic: 'Head Picture',
  trainingEngine: "AI Engine",
  inferenceEngine: "Inference Engine",
  account: "Account",
  account_list: "Account List",
  accountAudit: "Account Audit",
  dockerRegistry: "Docker Registry",
  appAudit: "App Audit",
  endpointConfig: "Endpoint config",
  apiStatistics: "API Statistics",
  manage_mirror: 'Mirror',
  manage_vendor: 'Vendor Manage',
  manage_user: 'Account Manage',
  smartConnect: "Smart Connect",
  edgeSoftwareStore: "Edge Software Store",
  eIqCloud: "eIQ Cloud",
  admin: "Admin",
  device_name: 'Device Name',
  deploy_software: 'Software Deployment',
  changePassword: "Change Password",
  headPortrait: "Head Portrait",
  logout: "Logout",
  helpDocument: "Go to help page",
  message: "message",
  help: 'Help',
  noData: "There is no data",
  nav_home: 'Home',
  nav_manage: 'manage',
  nav_apiUsage: 'ApiUsage',
  allApiStatistice: 'All Api Statistice',
  createDeviceStatistice: 'Create Device Statistice',
  deployAppStatistice: 'Deploy App Statistice',
  OTAStatistice: 'OTA Statistice',
  dash_solution_chart_tit: 'Top Solution On My Devices',
  dash_app_chart_tit: 'Top Apps On My Devices',
  dash_dev_area_statistics: 'Devices Area Statistics',
  dash_dev_status_statistics: 'Devices Life Cycle Statistics',
  dash_theme: 'Theme',
  dash_dev_distribute: 'Device distribution',
  dash_dev_statistics: 'Device Statistics',
  dash_app_statistics: 'App Statistics',
  dash_solution_statistics: 'Solution Statistics',
  customer_list: 'Customer List',
  customer_del_msg: 'Are you sure to delete this customer?',
  model_list: 'Model List',
  model_del_msg: 'Deleting this model will remove all related devices and software from the model.Do you want to continue?',
  device_list: 'Device List',
  device_create: 'Device Create',
  save_as_group: 'Save As Group',
  public_model: 'Public Model',
  private_model: 'My Model',
  save_as_template: 'Save As Template',
  bind_tags: 'Bind Tags',
  last_report: 'Last Report',
  local_ip: 'Local IP',
  certname: 'Certname',
  edgescale_version: 'Edgescale Version',
  app_number: 'App Number',
  display_name: 'Display Name',
  solution_name: 'Solution Name',
  project_name: 'Project Name',
  model_name: 'Model Name',
  customer_name: 'Customer Name',
  artifacts: 'Artifacts',
  commands: 'Commands',
  app_name: 'App Name',
  destroy: 'Destroy',
  source_code: 'Source Code',
  destroy_msg: 'All the data on the device will be erased, Do you want to continue?',
  active_dev_msg: 'Active the device successfully! The process can last several minutes, please wait patiently.',
  inactive_dev_msg: 'Inactive the device successfully',
  del_device_msg: 'Are you sure to delete selected devices',
  Active_enroll_msg: 'Please download and run the bootstrap shell script.Do you want to continue?',
  Inactive_enroll_msg: 'To unenroll a device means to disable the device functionality from cloud.The device can go through the enroll process as a new device.Do you want to continue?',
  download_dev_cert: 'Download Device Certificate',
  download_dev_cert_msg: 'Please download the device certificate.',
  create_dev_no: 'create Device No.',
  generate_dev_no: 'Generate Device ID NO.',
  dev_no: 'Device No',
  register_dev: 'Register Device',
  device_group: 'Device Group',
  devgroup: 'Device Group',
  all_my_group: 'All My Group',
  dev_loc_chart: 'Devices Location Chart',
  dev_status_chart: 'Devices Status Chart',
  arguments: 'Arguments',
  more_arguments: 'More Arguments',
  del_group_msg: 'Are you sure to delete selected group?',
  host_arguments: 'Host Arguments',
  volume_arguments: 'Volume Arguments',
  env_arguments: 'Environment Arguments',
  network_arguments: 'Network Arguments',
  read_only: 'ReadOnly',
  permission_arguments: 'Permission Arguments',
  host_network: 'Host Network',
  host_port: 'Host Port',
  container_port: 'Container Port',
  host_path: 'Host Path',
  mount_path: 'Mount path',
  cap_add: 'Cap add',
  solution_list: 'Solution List',
  app_list: 'App List',
  add_docker_arguments: 'Add Docker Arguments',
  del_task_msg: 'Do you want to delete this task?',
  if_continue: 'Do you want to continue?',
  task_tem_list: 'Task Template List',
  task_tem: 'Task Template',
  task_template: 'Task Template',
  del_tem_msg: 'You are going to remove selected template, do you want to continue ?',
  add_app: 'Add App',
  mft_list: 'Manufacture List',
  offline_number: 'Offline Number',
  active_number: 'Active Number',
  online_number: 'Online Number',
  app_market: 'App Market',
  add_to_my_app: 'Add To My APP',
  del_app_msg: 'This operation will delete current app, continue?',
  new_tag: 'New Tag',
  app_doc: 'App Documents',
  app_image_name: 'App Image Name',
  upload_app_icon: 'Upload App Icon',
  solution_link: 'Solution link',
  del_solution_msg: 'Please make sure this solution is not the default solution',
  edit_solution_tip: 'are you sure to give up current operation?',
  edit_solution_msg: 'Whether is the default solution selected',
  public_key: 'Public Key',
  loc_firmware: 'Specify Firmware Location',
  upload_firmware: 'Upload Firmware Image',
  image_url: 'Image Url',
  is_default: 'Default Solution',
  install_solution_msg: 'Have the installer in solution',
  builder_pended: 'Pended',
  builder_failed: 'Failed',
  builder_fault: 'Fault',
  builder_stop: 'Stop',
  builder_time_out: 'Time out',
  builder_succeeded: 'Succeeded',
  builder_inprogress: 'InProgress',
  last_build: 'Last Build',
  build_history: 'Build History',
  builder_start_msg: 'Do you want to start this object?',
  source_code: 'Source Code',
  pollForSourceChanges: 'check periodically for changes',
  sourceProvider: 'Source Provider',
  source_provider: 'Source Provider',
  repository: 'Repository',
  branch: 'Branch',
  build_env: 'Build Environment',
  check_change: 'check periodically for changes',
  env: 'Environment',
  computer_type: 'Computer Type',
  computeType: 'Computer Type',
  aws_image: 'Image managed by AWS',
  docker_image: 'Image from DockerHub',
  object_key: 'S3 Upload',
  filter_condition: 'Filter Condition',
  cpu_usage: 'CPU Usage',
  mem_usage: 'Memory Usage',
  disk_usage: 'Disk Usage',
  setting_limit: 'Setting Limit',
  user_id: 'User ID',
  limit_type: 'Limit Type',
  max_limit: 'Max Limit',
  max_seconds: 'Max Seconds',
  key_strength: 'Key Strength',
  key_algorithm: 'Key Algorithm',
  key_auto: 'Auto generate key',
  key_upload: 'Upload key',
  sign_solution: 'Sign Solution',
  app_log: 'App Log',
  reason: 'Reason',
  selected_devices: 'Selected devices',
  all_filter_devices: 'All filtered devices',
  group_name: 'Group Name',
  add_device_to_group: 'Add Device To Group',
  bind_to_group: 'Bind To Group',
  start_p1: 'EdgeScale - Making Edge Compute Secure and Manageable',
  start_p2: 'EdgeScale is a scalable and powerful platform which helps you to easily connect IoT things, manage devices and deploy your applications. This page provides a typical workflow of how to register devices and deploy applications.',
  get_start: 'Get Started',
  start_model: "Create and resign a model",
  start_dev: 'Create a device on the cloud',
  start_app: 'user can enroll and upload container based applications',
  start_solution: 'user can enroll and upload firmware or solution images',
  app_deploy: 'Application Deployment',
  solution_deploy: 'Solution Deployment',
  start_app_deploy: 'user can deploy the application to a already exist device',
  start_solution_deploy: 'user can deploy the solution to a already exist device',
  start_task: 'user can check the deploy detail on task list page',
  see_more: 'Documents',
  create_mft_config: 'Generate Manufacture Config',
  root_key_hash: 'Root Key',
  download_template: 'Download Template',
  confile_type: 'Config Type',
  setting_generate: 'Setting Generate',
  upload_config: 'Upload Config',
  create_app: 'Create App',
  config_app: 'Config App',
  audit: 'Audit',
  solutionAudit: 'Solution Audit',
  modelAudit: 'Model Audit',
  appAudit: 'App Audit',
  add_image: 'Add Docker Image',
  port: 'Ports',
  docker_config: 'Docker Config',
  ca_config: 'CA Config',
  update: 'Update',
  service_config: 'Service Config',
  attribute: 'Attribute',
  Approved: 'Approved',
  Rejected: 'Rejected',
  Pending: 'Pending',
  check_code: 'Check Code',
  check_type: 'Check Type',
  ota_create: 'Create Firmware',
  ota_edit: 'Edit Firmware',
  sub_edit: 'Edit Subordinate Device'
}
let message = {}
Object.assign(message, com, tip, eiq, err, mainEn)
export default message