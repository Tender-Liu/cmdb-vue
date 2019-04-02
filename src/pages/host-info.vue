<template>
    <div class="page-body">
        <div class="page-header">
            <h1 class="page-title">资产管理</h1>
            <el-breadcrumb>
                <el-breadcrumb-item :to="{path: '/'}">首页</el-breadcrumb-item>
                <el-breadcrumb-item >服务器列表</el-breadcrumb-item>
            </el-breadcrumb>
        </div>

        <div class="box">
            
            <div class="demo-input-suffix searchn-avigation">
                <el-button type="warning" @click.native.prevent="updAllSaltHostinfo()" style="float: right;">主机更新</el-button>
                <el-button type="primary" @click.native.prevent="collectHostInfo()" style="float: right; margin-right: 10px;">主机收集</el-button>
                <el-button type="success" @click.native.prevent="updProjectListFromHostInfo()" style="float: right; margin-right: 10px;">项目收集</el-button>
                <el-button type="info" @click.native.prevent="loadClose(-1)" style="float: right; margin-right: 10px;">操作主机</el-button>
                环境：
                <el-select v-model="pages.ambientId" placeholder="环境" style="width: 8%;margin-right: 10px;">
                        <el-option v-for="item in ambientList" :key="item.id" :label="item.ambient_name" :value="item.id"> </el-option>
                </el-select>
                项目：
                <el-select v-model="pages.projectId" placeholder="项目" style="width: 8%;margin-right: 10px;">
                    <el-option v-for="item in projectInfoList" :key="item.project_id" :label="item.project_name" :value="item.project_id"> </el-option>
                </el-select>
                IP：
                <el-input  placeholder="IP" v-model="pages.ip" style="width: 15%"></el-input>
                <el-button type="primary" @click.native.prevent="selectFromHostInfo()">查询</el-button>
            </div>
                
            <el-table :data="hostInfoList" border style="width: 100%" v-loading="loading2" element-loading-text="主机资产收集与更新 以及项目收集需要一些时间，还请耐心等待..." @selection-change="handleSelectionChange">
                <el-table-column type="selection" width="35" ></el-table-column>
                <el-table-column prop="host_id" label="id" width="100" align="center"></el-table-column>
                <el-table-column prop="salt_id" label="主机名" width="200" align="center"></el-table-column>
                <el-table-column prop="ip" label="ip地址" width="200" align="center"></el-table-column>
                <el-table-column prop="cpus_number" label="cpu核数"  align="center"></el-table-column>
                <el-table-column prop="memory" label="内存" align="center">
                     <template slot-scope="scope">{{ (scope.row.memory/1024/1024).toFixed(1) }}GB</template>
                </el-table-column>
                <el-table-column prop="os_release" label="系统版本" align="center"></el-table-column>
                <el-table-column prop="state" label="状态" align="center">
                    <template slot-scope="scope">
                        <el-tag :type=stateColor[scope.row.state]>{{state[scope.row.state]}}</el-tag>
                    </template>
                </el-table-column>
                <el-table-column prop="ambient__ambient_name" label="环境" align="center">
                    <template slot-scope="scope">
                        <el-tag >{{scope.row.ambient__ambient_name}}</el-tag>
                    </template>
                </el-table-column>
                <el-table-column label="操作" width="300" align="center">
                    <template slot-scope="scope">
                    <el-button type="success" size="mini" @click="dialogHostInfoVisible=true"
                        @click.native.prevent="showHostInfo(scope.$index)" >详情</el-button>
                    <el-button type="primary" size="mini" @click="dialogUpdHostInfoVisible=true"
                        @click.native.prevent="loadUpdHostInfoLoad(scope.$index)" >修改</el-button>
                    <el-button type="warning" size="mini"
                        @click.native.prevent="updSaltHostinfo(hostInfoList[scope.$index]['host_id'])" >更新</el-button>
                    <el-button size="mini" type="info"
                        @click.native.prevent="loadClose(scope.$index)" >操作</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <br/>
            <el-pagination :page-size="5" :page-count="pages.numPages" :current-page="pages.page" layout="prev, pager, next"
             @current-change="handleCurrentChange"></el-pagination>
        </div>

        <el-dialog title="主机详情" :visible.sync="dialogHostInfoVisible" width="90%">
            <el-row :gutter="20" style="margin-bottom: 20px; padding-bottom: 20px">
                <el-col :span="12">
                <el-card class="box-card">
                    <div slot="header" align="center">
                        <span style="font-size: 16px"><i class="el-icon-setting"></i>主机基本信息</span>
                    </div>
                    <el-row :gutter="20" class="el-row">
                        <el-col :span="8" align="right" style="color:#3399FF"><div>主机Id:</div></el-col>
                        <el-col :span="16" align="center"><div>{{hostInfo.host_id}}</div></el-col>
                    </el-row>
                    <el-row :gutter="20" class="el-row">
                        <el-col :span="8" align="right" style="color:#3399FF"><div>saltId:</div></el-col>
                        <el-col :span="16" align="center"><div>{{hostInfo.salt_id}}</div></el-col>
                    </el-row>
                    <el-row :gutter="20" class="el-row">
                        <el-col :span="8" align="right" style="color:#3399FF"><div>主机名:</div></el-col>
                        <el-col :span="16" align="center"><div>{{hostInfo.host_name}}</div></el-col>
                    </el-row>
                    <el-row :gutter="20" class="el-row">
                        <el-col :span="8" align="right" style="color:#3399FF"><div>主机别名:</div></el-col>
                        <el-col :span="16" align="center"><div>{{hostInfo.alies_name}}</div></el-col>
                    </el-row>
                    <el-row :gutter="20" class="el-row">
                        <el-col :span="8" align="right" style="color:#3399FF"><div>vlan:</div></el-col>
                        <el-col :span="16" align="center">
                            <div><el-tag size="small">{{hostInfo.vlan__vlan_name}}</el-tag></div>
                        </el-col>
                    </el-row>
                    <el-row :gutter="20" class="el-row">
                        <el-col :span="8" align="right" style="color:#3399FF"><div>环境:</div></el-col>
                        <el-col :span="16" align="center">
                            <div><el-tag size="small">{{hostInfo.ambient__ambient_name}}</el-tag></div>
                            </el-col>
                    </el-row>
                    <el-row :gutter="20" class="el-row">
                        <el-col :span="8" align="right" style="color:#3399FF"><div>远程端口:</div></el-col>
                        <el-col :span="16" align="center"><div>{{hostInfo.ssh_port}}</div></el-col>
                    </el-row>
                    <el-row :gutter="20" class="el-row">
                        <el-col :span="8" align="right" style="color:#3399FF"><div>状态:</div></el-col>
                        <el-col :span="16" align="center">
                            <div><el-tag :type=stateColor[hostInfo.state]>{{state[hostInfo.state]}}</el-tag></div>
                        </el-col>
                    </el-row>
                    <el-row :gutter="20" class="el-row">
                        <el-col :span="8" align="right" style="color:#3399FF"><div>是否删除:</div></el-col>
                        <el-col :span="16" align="center">
                            <div><el-tag :type=stateColor[hostInfo.delete]>{{isDelete[hostInfo.delete]}}</el-tag></div>
                        </el-col>
                    </el-row>
                    <el-row :gutter="20" class="el-row">
                        <el-col :span="8" align="right" style="color:#3399FF"><div>备注:</div></el-col>
                        <el-col :span="16" align="center"><div>{{hostInfo.remarks}}</div></el-col>
                    </el-row>
                    <el-row :gutter="20" class="el-row">
                        <el-col :span="8" align="right" style="color:#3399FF"><div>创建时间:</div></el-col>
                        <el-col :span="16" align="center"><div>{{hostInfo.created_time}}</div></el-col>
                    </el-row>
                </el-card>
                </el-col>
                <el-col :span="12">
                <el-card class="box-card">
                    <div slot="header" align="center">
                        <span style="font-size: 16px"><i class="el-icon-setting"></i>主机硬件信息</span>
                    </div>
                    <el-row :gutter="20" class="el-row">
                        <el-col :span="8" align="right" style="color:#3399FF"><div>内存:</div></el-col>
                        <el-col :span="16" align="center"><div>{{parseInt(hostInfo.memory/1023)}}MB</div></el-col>
                    </el-row>
                    <el-row :gutter="20" class="el-row">
                        <el-col :span="8" align="right" style="color:#3399FF"><div>交换分区:</div></el-col>
                        <el-col :span="16" align="center"><div>{{parseInt(hostInfo.swap/1024)}}MB</div></el-col>
                    </el-row>
                    <el-row :gutter="20" class="el-row">
                        <el-col :span="8" align="right" style="color:#3399FF"><div>系统类型:</div></el-col>
                        <el-col :span="16" align="center"><div>{{hostInfo.os_fullname}}</div></el-col>
                    </el-row>
                    <el-row :gutter="20" class="el-row">
                        <el-col :span="8" align="right" style="color:#3399FF"><div>系统版本:</div></el-col>
                        <el-col :span="16" align="center"><div>{{hostInfo.os_release}}</div></el-col>
                    </el-row>
                     <el-row :gutter="20" class="el-row">
                        <el-col :span="8" align="right" style="color:#3399FF"><div>内核版本:</div></el-col>
                        <el-col :span="16" align="center"><div>{{hostInfo.kernel_release}}</div></el-col>
                    </el-row>
                    <el-row :gutter="20" class="el-row">
                        <el-col :span="8" align="right" style="color:#3399FF"><div>cpu信息:</div></el-col>
                        <el-col :span="16" align="center"><div>{{hostInfo.cpu_model}}</div></el-col>
                    </el-row>
                    <el-row :gutter="20" class="el-row">
                        <el-col :span="8" align="right" style="color:#3399FF"><div>cou核数:</div></el-col>
                        <el-col :span="16" align="center"><div>{{hostInfo.cpus_number}}</div></el-col>
                    </el-row>
                    <el-row :gutter="20" class="el-row">
                        <el-col :span="8" align="right" style="color:#3399FF"><div>主机类型:</div></el-col>
                        <el-col :span="16" align="center"><div>{{hostInfo.host_type}}</div></el-col>
                    </el-row>
                    <el-row :gutter="20" class="el-row">
                        <el-col :span="8" align="right" style="color:#3399FF"><div>主机项目:</div></el-col>
                        <el-col :span="16" align="center">
                            <div>
                                <template v-for="projectInfo in projectList">
                                    <el-tag style='margin-right: 10px;'>{{ projectInfo.project_name }}</el-tag>
                                </template>
                            </div>
                        </el-col>
                    </el-row>
                </el-card>
                </el-col>
            </el-row>
            <el-row :gutter="20">
                <el-col :span="12">
                <el-card class="box-card">
                    <div slot="header" align="center">
                        <span style="font-size: 16px"><i class="el-icon-setting"></i>主机网卡信息</span>
                    </div>
                    <el-table :data="ipList" style="width: 100%">
                        <el-table-column prop="id" label="ID" width="80" align="center"></el-table-column>
                        <el-table-column prop="host" label="主机ID" width="80" align="center"></el-table-column>
                        <el-table-column prop="network_name" label="网卡名" align="center"></el-table-column>
                        <el-table-column prop="ip_address" label="IP地址" align="center"></el-table-column>
                        <el-table-column prop="state" label="状态" align="center">
                            <template slot-scope="scope">
                            <el-tag :type=stateColor[scope.row.state]>{{state[scope.row.state]}}</el-tag>
                            </template>
                        </el-table-column>
                    </el-table>
                </el-card>
                </el-col>
                <el-col :span="12" style="margin-bottom: 20px">
                <el-card class="box-card">
                    <div slot="header" align="center">
                        <span style="font-size: 16px"><i class="el-icon-setting"></i>主机磁盘信息</span>
                    </div>
                    <el-table :data="diskList" style="width: 100%">
                        <el-table-column prop="id" label="ID" width="80" align="center"></el-table-column>
                        <el-table-column prop="host" label="主机ID" width="80" align="center"></el-table-column>
                        <el-table-column prop="disk_name" label="硬盘名" align="center"></el-table-column>
                        <el-table-column prop="size_gb" label="硬盘容量/GB"  align="center"></el-table-column>
                        <el-table-column prop="size_bytes" label="硬盘容量/KB" align="center"></el-table-column>
                        <el-table-column prop="state" label="状态" align="center" width="80">
                            <template slot-scope="scope">
                                <el-tag :type=stateColor[scope.row.state]>{{state[scope.row.state]}}</el-tag>
                            </template>
                        </el-table-column>
                    </el-table>
                </el-card>
                </el-col>
            </el-row>
        </el-dialog>
    
        <el-dialog title="修改主机基本信息" :visible.sync="dialogUpdHostInfoVisible" :before-close="UpdHostInfoClose">
            <el-form ref="hostInfo" :model="hostInfo" label-width="120px">
                <el-form-item label="hostID">
                    <el-input v-model="hostInfo.host_id" disabled style="width: 60%"></el-input>
                </el-form-item>
                <el-form-item label="saltID">
                    <el-input v-model="hostInfo.salt_id" disabled style="width: 60%"></el-input>
                </el-form-item>
                <el-form-item label="主机名">
                    <el-input v-model="hostInfo.host_name" disabled style="width: 60%"></el-input>
                </el-form-item>
                <el-form-item label="vlan">
                    <el-select v-model="hostInfo.vlan" placeholder="请选择vlan" style="width: 60%">
                        <el-option v-for="item in vlanList" :key="item.id" :label="item.vlan_name" :value="item.id"> </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="环境">
                    <el-select v-model="hostInfo.ambient" placeholder="请选择环境" style="width: 60%">
                        <el-option v-for="item in ambientList" :key="item.id" :label="item.ambient_name" :value="item.id"> </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="是否删除">
                    <el-select v-model="hostInfo.delete" placeholder="请选择" style="width: 60%">
                        <el-option v-for="(value, key) in isDelete" :key="parseInt(key)" :label="value" :value="parseInt(key)"> </el-option>
                    </el-select>
                    <br>主机处于已删除,就无法更新与一键更新主机信息
                </el-form-item>
                <el-form-item label="主机备注" prop="task_info" label-width="120px">
                    <el-input type="textarea" v-model="hostInfo.remarks" :rows="6" style="width: 80%"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="dialogUpdHostInfoVisible = false" @click.native.prevent="updHostInfoLoad(), addAbitentList()">确 定</el-button>
                <el-button @click="dialogUpdHostInfoVisible = false" @click.native.prevent="addAbitentList()">取 消</el-button>
            </div>
        </el-dialog>
    
        <el-dialog title="控制台" :visible.sync="dialogCommantVisible" width="70%" align="center" style="background-color: #303133;" :before-close="handleClose">
            <div class="demo-input-suffix searchn-avigation">
                <div>
                命令：
                <el-input v-model="saltCommand.command" placeholder="命令" style="width: 40%"></el-input>&nbsp;
                <el-button type="primary" @click="closeExecuteCommand()">执行命令</el-button>
                <el-button type="success" style="margin-left: 20px;" @click="dialogCommantVisible=false">关闭控制台</el-button>
                </div>
                <br><br><br>
                <div style="width: 90%">
                <pre style="width: 100%" align="left" class='console' v-loading="loading1" element-loading-text="命令执行中，请稍后......">{{saltCommand.commandResult}}</pre>
                </div>
            </div>
        </el-dialog>
    </div>
</template>
<script>
import Axios from 'axios'
export default {
    data () {
        return {
            hostInfoList: [],
            pages: {
                'page': 1,
                'numPages': 1,
                'projectId': '',
                'ambientId': '',
                'ip': ''
            },
            loading2: false,
            loading1: false,
            state: {
                0: '正常',
                1: '异常'
            },
            isDelete: {
                0: '管理中',
                1: '已删除'
            },
            stateColor: {
                0: 'success',
                1: 'danger'
            },
            dialogHostInfoVisible: false,
            dialogUpdHostInfoVisible: false,
            hostInfo: {},
            ipList: [],
            diskList: [],
            vlanList: [],
            ambientList: [],
            projectInfoList: [],
            projectList: [],
            saltIdList: [],
            selectHostInfo: [],
            dialogCommantVisible: false,
            saltCommand: {
                'command': '',
                'commandResult': ''
            }
        }
    },
    mounted () { 
        let self=this
        Axios.get('/api/hostInfo/getAllHostInfoByPage?page=1')
            .then(function(response) {
            self.hostInfoList = response.data.hostInfoList;
            self.pages['page'] = response.data.page;
            self.pages['numPages'] = response.data.numPages;
        });
        Axios.get('/api/ambient/getAllFromAmbient').then(function(response) {
            if (response.code == 200){
                self.ambientList = response.data.ambientList
                self.ambientList.splice(self.insertPos, 0, {id: '',ambient_name: '全部'})
            }
        });
        Axios.get('/api/vlan/getIdAndVlanNameFromVlan').then(function(response) {
            if (response.code == 200){
                self.vlanList = response.data.vlanList;
            }
        });
        Axios.get('/api/projectInfo/getProjectNameFromProjectInfo').then(function(response) {
            if (response.code == 200){
                self.projectInfoList = response.data.projectInfoList;
                self.projectInfoList.splice(self.insertPos, 0, {project_id: '',project_name: '全部'})
            }
        });
    },
    methods: {
        handleSelectionChange(val) {
            this.selectHostInfo = val;
        },
        pageInitialization(){
            // this.pages['page'] = 1
            this.pages['projectId'] = ''
            this.pages['ambientId'] = ''
        },
        selectFromHostInfo(){
            this.pages['page'] = 1
            this.getPagehostInfo()
        },
        getPagehostInfo () {
            let self=this
            Axios.get('/api/hostInfo/getAllHostInfoByPage?page=' + this.pages['page']+"&projectId="+this.pages['projectId']
            +'&ambientId='+this.pages['ambientId']+'&ip='+this.pages['ip'])
            .then(function(response) {
                if (response.code == 200) {
                    self.hostInfoList = response.data.hostInfoList;
                    self.pages['page'] = response.data.page;
                    self.pages['numPages'] = response.data.numPages;
                }
                else{
                    self.$message.error(response.message);
                }
                
            });
        },
        handleCurrentChange (page) {
            let self=this;
            this.pages['page'] = page;
            this.getPagehostInfo()
        },
        collectHostInfo () {
            let self=this
            Axios.get('/api/salt/getNewSaltId')
            .then(function(response) {
                if (response.code == 200) {
                    self.$confirm('系统检测到 '+response.data.length+' 台新主机,是否添加到系统中', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }).then(() => {
                        self.loading2 = true
                        Axios.get('/api/salt/setNewHostInfo?saltIdList=' + JSON.stringify(response.data))
                        .then(function(response) {
                            self.loading2 = false
                            if (response.code == 200){
                                self.$message({
                                type: 'success',
                                message: response.message
                                });
                                self.pageInitialization()
                                self.getPagehostInfo()
                            }else{
                                self.$message.error(response.message);
                            }
                        });
                    }).catch(() => {
                        self.$message({
                        type: 'info',
                        message: '已取消操作'
                        });          
                    });
                }
                else{
                    self.$message.info(response.message);
                }
            });
            
        },
        updAllSaltHostinfo(){
            this.loading2 = true
            let self=this
            Axios.get('/api/salt/updAllHostInfoBySalt')
            .then(function(response) {
                self.loading2 = false
                if (response.code == 200) {
                    self.pageInitialization()
                    self.getPagehostInfo()
                    self.$message({
                        type: 'success',
                        message: response.message
                    });
                }else{
                    self.$message.error(response.message);
                }
                
            });
            
        },
        updProjectListFromHostInfo(){
            this.loading2 = true
            let self=this
            Axios.get('/api/salt/getProjectListFromHostInfoBySalt')
            .then(function(response) {
                self.loading2 = false
                if (response.code == 200) {
                    self.pageInitialization()
                    self.getPagehostInfo()
                    self.$message({
                        type: 'success',
                        message: response.message
                    });
                }else{
                    self.$message.error(response.message);
                }
                
            });
            
        },
        showHostInfo(index){
            let self=this
            Axios.get('/api/hostInfo/getAllHostInfoByHostId?hostId='+this.hostInfoList[index]['host_id']).then(function(response) {
                if (response.code == 200){
                    self.hostInfo = response.data.hostInfo;
                    self.ipList = response.data.ipList;
                    self.diskList = response.data.diskList;
                    self.projectList = response.data.projectInfoList;
                }
                else{
                    self.hostInfo = {};
                    self.ipList = [];
                    self.diskList = [];
                }
                
            });
        },
        loadUpdHostInfoLoad(index){
            this.ambientList.splice(0, 1)
            let self=this
            Axios.get('/api/hostInfo/getHostInfoByHostId?hostId='+this.hostInfoList[index]['host_id']).then(function(response) {
                if (response.code == 200){
                    self.hostInfo = response.data.hostInfo;
                }
            });
        },
        updHostInfoLoad(){

            let self=this
            if(this.hostInfo.vlan==0||this.hostInfo.vlan==null){
                this.hostInfo.vlan=''
            }
            if(this.hostInfo.ambient==0||this.hostInfo.ambient==null){
                this.hostInfo.ambient=''
            }
            Axios.get('/api/hostInfo/updHostInfoByHostId?hostId='+this.hostInfo.host_id+'&vlanId='+this.hostInfo.vlan+
            '&ambientId='+this.hostInfo.ambient+'&remarks='+this.hostInfo.remarks+'&delete='+this.hostInfo.delete
            ).then(function(response) {
                if (response.code == 200) {
                    self.$message({
                        type: 'success',
                        message: response.message
                    });
                    self.pageInitialization()
                    self.getPagehostInfo()
                }else{
                    self.$message.error(response.message);
                }
            });
        },
        updSaltHostinfo(hostId){
            this.loading2 = true
            let self=this
            Axios.get('/api/salt/updAllHostInfoBySalt?hostId='+hostId)
            .then(function(response) {
                self.loading2 = false
                self.pageInitialization()
                self.getPagehostInfo()
                if (response.code == 200) {
                    self.$message({
                        type: 'success',
                        message: response.message
                    });
                }else{
                    self.$message.error(response.message);
                }
            });
            
        },
        addAbitentList(){
            this.ambientList.splice(self.insertPos, 0, {id: '',ambient_name: '全部'})
        },
        handleClose(){},
        UpdHostInfoClose(){
            this.ambientList.splice(self.insertPos, 0, {id: '',ambient_name: '全部'})
            this.dialogUpdHostInfoVisible = false;
        },
        loadClose(index){
            this.saltIdList.length = 0
            this.saltCommand.command = ''
            this.saltCommand.commandResult = ''
            if (index >= 0) {
                this.saltIdList.push(this.hostInfoList[index]['salt_id'])
            }
            else{
                for (var i = 0; i< this.selectHostInfo.length; ++i) {
                    this.saltIdList.push(this.selectHostInfo[i]['salt_id'])
                }
            }
            if (this.saltIdList.length == 0){
                this.$message.error('请选择需要批量操作的主机！');
            }
            else{
                this.dialogCommantVisible = true
            }
        },
        closeExecuteCommand(){
            this.saltCommand.commandResult = '\n'
            this.loading1 = true
            let self=this
            Axios.get('/api/salt/getCommandFromSaltBySaltIdList?saltIdList=' + this.saltIdList
                +'&command='+this.saltCommand.command)
            .then(function(response) {
                if (response.code == 200) {
                    for (var saltId in self.saltIdList){
                        self.saltCommand.commandResult += 'salt_id: '+self.saltIdList[saltId]+'\ncommand: '+self.saltCommand.command
                        +'\ncommand result: \n'+response.data.commandResult[self.saltIdList[saltId]]+'\n\n'
                    }
                    
                }else{
                    self.saltCommand.commandResult = response.message
                }
                self.loading1 = false
            });
        }
    }
}
</script>

<style>
    .box-body{
        width: 100%;
        overflow: auto;
    }

    .clearfix:before,
    .clearfix:after {
        display: table;
        content: "";
    }
    .clearfix:after {
        clear: both
    }

    .box-card {
        width: 100%;
    }
    
    .el-row {
        border-bottom: 1px solid #efefef;
        line-height: 45px;
    }
    .searchn-avigation{
        margin-bottom: 20px;
    }
    .console{
        font-size: 16px;
        min-height: 500px; 
        background-color: black;
        color: #efefef;
        white-space:pre-wrap;
        word-wrap:break-word;
        font-weight:normal;
    }
</style>