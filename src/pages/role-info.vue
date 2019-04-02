<template>
    <div class="page-body">
        <div class="page-header">
            <h1 class="page-title">权限管理</h1>
            <el-breadcrumb>
                <el-breadcrumb-item :to="{path: '/'}">首页</el-breadcrumb-item>
                <el-breadcrumb-item >角色管理</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="box">

            <div class="demo-input-suffix searchn-avigation">
                角色名：
                <el-input v-model="pages.roleName"  placeholder="角色名" style="width: 20%"></el-input>
                <el-button type="primary" @click.native.prevent="selectFromRoleInfoList()">查询</el-button>
                <el-button type="success" style="float: right; margin-right: 20px;"
                    @click="dialogAddRoleInfoVisible=true"
                    @click.native.prevent="loadAddRoleInfo()">添加角色
                </el-button>
            </div>

            <el-table :data="roleInfoList" border style="width: 100%">
                <el-table-column prop="role_id" label="角色ID" align="center" width="100"></el-table-column>
                <el-table-column prop="role_name" label="角色名" align="center"></el-table-column>
                <el-table-column prop="remarks" label="备注"  align="center"></el-table-column>
                <el-table-column prop="create_time" label="创建时间"  align="center" width="180"></el-table-column>
                <el-table-column label="操作" width="360" align="center">
                    <template slot-scope="scope">
                    <el-button type="success" size="small" @click="dialogRoleInfoVisible=true" @click.native.prevent="getRoleInfoAndApiInfoList(scope.$index)">查看</el-button>
                    <el-button type="primary" size="small" @click="dialogUpdRoleInfoVisible=true" @click.native.prevent="getRoleInfo(scope.$index)">修改信息</el-button>
                    <el-button type="primary" size="small" @click="dialogAddRoleInfoByApiInfoVisible=true" @click.native.prevent="loadRoleInfoAndApiInfoList(roleInfoList[scope.$index]['role_id'])">修改权限</el-button>
                    <el-button type="warning" size="small" @click="delRoleInfo(scope.$index)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <br/>
            <el-pagination :page-size="5" :page-count="pages.numPages" :current-page="pages.page" layout="prev, pager, next"
             @current-change="handleCurrentChange"></el-pagination>
        </div>
    
        <el-dialog title="查看角色详情" :visible.sync="dialogRoleInfoVisible" width="80%" align="center">
            <el-row :gutter="20" style="background-color: #F2F6FC;">
                <el-col :span="3" style="font-weight: bold; "><div>角色ID</div></el-col>
                <el-col :span="3" style="font-weight: bold;"><div>角色名</div></el-col>
                <el-col :span="12" style="font-weight: bold;"><div>备注</div></el-col>
                <el-col :span="6" style="font-weight: bold;"><div>创建时间</div></el-col>
            </el-row>
            <el-row :gutter="20">
                <el-col :span="3"><div>{{roleInfo['role_id']}}</div></el-col>
                <el-col :span="3"><div>{{roleInfo['role_name']}}</div></el-col>
                <el-col :span="12"><div>{{roleInfo['remarks']}}</div></el-col>
                <el-col :span="6"><div>{{roleInfo['create_time']}}</div></el-col>
            </el-row>
            <br>
            <el-table :data="apiInfoList" border style="width: 100%" max-height="500">
                <el-table-column prop="api_id" label="API-ID" align="center"></el-table-column>
                <el-table-column prop="api_url" label="API地址" align="center"></el-table-column>
                <el-table-column prop="api_name" label="API名" align="center"></el-table-column>
                <el-table-column prop="remarks" label="API详情" align="center"></el-table-column>
                <el-table-column prop="create_time" label="创建时间"  align="center" width="180"></el-table-column>
            </el-table>
        </el-dialog>

        <el-dialog title="修改角色信息" :visible.sync="dialogUpdRoleInfoVisible" width="50%" align="center">
            <el-form ref="roleInfo" :model="roleInfo" style="width: 70%;"  label-width="20%" class="demo-ruleForm" >
            <el-form-item label="角色ID">
                <el-input v-model="roleInfo.role_id" disabled></el-input>
            </el-form-item>
            <el-form-item label="角色名">
                <el-input v-model="roleInfo.role_name"></el-input>
            </el-form-item>
            <el-form-item label="创建时间">
                <el-input v-model="roleInfo.create_time" disabled></el-input>
            </el-form-item>
            <el-form-item label="备注">
                <el-input type="textarea" v-model="roleInfo.remarks" :rows="3"></el-input>
            </el-form-item>
            </el-form>
            <el-button type="primary" @click="dialogUpdRoleInfoVisible=false" @click.native.prevent="updRoleInfo()">提交</el-button>
            <el-button @click="dialogUpdRoleInfoVisible=false ,message()">取消</el-button>
        </el-dialog>

        <el-dialog title="添加角色信息" :visible.sync="dialogAddRoleInfoVisible" width="50%" align="center">
            <el-form ref="roleInfo" :model="roleInfo" style="width: 70%;"  label-width="20%" class="demo-ruleForm" >
            <el-form-item label="角色名">
                <el-input v-model="roleInfo.role_name"></el-input>
            </el-form-item>
            <el-form-item label="备注">
                <el-input type="textarea" v-model="roleInfo.remarks" :rows="3"></el-input>
            </el-form-item>
            </el-form>
            <el-button type="primary" @click="dialogAddRoleInfoVisible=false" @click.native.prevent="addRoleInfo()">提交</el-button>
            <el-button @click="dialogAddRoleInfoVisible=false ,message()">取消</el-button>
        </el-dialog>


        <el-dialog title="修改角色权限" :visible.sync="dialogAddRoleInfoByApiInfoVisible" width="90%" align="center">
            <el-row :gutter="20" class="el-row-roleinfo" style="background-color: #F2F6FC;">
                <el-col :span="3" style="font-weight: bold; "><div>角色ID</div></el-col>
                <el-col :span="3" style="font-weight: bold;"><div>角色名</div></el-col>
                <el-col :span="12" style="font-weight: bold;"><div>备注</div></el-col>
                <el-col :span="6" style="font-weight: bold;"><div>创建时间</div></el-col>
            </el-row>
            <el-row :gutter="20" class="el-row-roleinfo">
                <el-col :span="3"><div>{{roleInfo['role_id']}}</div></el-col>
                <el-col :span="3"><div>{{roleInfo['role_name']}}</div></el-col>
                <el-col :span="12"><div>{{roleInfo['remarks']}}</div></el-col>
                <el-col :span="6"><div>{{roleInfo['create_time']}}</div></el-col>
            </el-row>
            <br>
            <el-row style="border: 0;">
                <el-col :span="10" style="background-color: #F2F6FC; font-weight: bold; line-height: 45px;"><div>全部权限</div></el-col>
                <el-col :span="10" :offset="4" style="background-color: #F2F6FC;font-weight: bold; line-height: 45px;"><div>拥有权限</div></el-col>
            </el-row>
            <el-row>
                <el-col :span="10">
                    <div>
                        <el-table :data="notApiInfoList" border style="width: 100%" max-height="500" @selection-change="SelectionNotApiInfoList">
                            <el-table-column type="selection" width="35"></el-table-column>
                            <el-table-column prop="api_name" label="API名" align="center"></el-table-column>
                            <el-table-column prop="api_url" label="API地址" align="center"></el-table-column>
                        </el-table>
                    </div>
                </el-col>
                <el-col :span="4">
                    <div>
                        <p><el-button type="primary" @click="addRoleInfoByApiInfo()">添加<i class="el-icon-arrow-right"></i></el-button></p>
                        <p><el-button type="success" icon="el-icon-arrow-left" @click="delRoleInfoByApiInfo()">移除</el-button></p>
                    </div>
                </el-col>
                <el-col :span="10">
                    <div>
                        <el-table :data="apiInfoList" border style="width: 100%" max-height="500" @selection-change="SelectionApiInfoList">
                            <el-table-column type="selection" width="35"></el-table-column>
                            <el-table-column prop="api_name" label="API名" align="center"></el-table-column>
                            <el-table-column prop="api_url" label="API地址" align="center"></el-table-column>
                        </el-table>
                    </div>
                </el-col>
            </el-row>
        </el-dialog>
    </div>
    
</template>

<script>
import Axios from 'axios'
export default {
    data () {
        return {
            roleInfoList: [],
            pages: {
                'page': 1,
                'numPages': 1,
                'roleName': ''
            },
            dialogRoleInfoVisible: false,
            dialogUpdRoleInfoVisible: false,
            dialogAddRoleInfoVisible: false,
            dialogAddRoleInfoByApiInfoVisible: false,
            roleInfo: {},
            apiInfoList: [],
            notApiInfoList: [],
            selectApiIdList: [],
            selectNotApiIdList:[]
        }
    },
    mounted () {
        this.selectFromRoleInfoList()
    },
    methods: {
        SelectionNotApiInfoList(val) {
            this.selectNotApiIdList = val;
        },
        SelectionApiInfoList(val) {
            this.selectApiIdList = val;
        },
        pageInitialization () {
            this.pages['page'] = 1
            this.pages['roleName'] = ''
        },
        selectFromRoleInfoList(){
            this.pages['page'] = 1
            this.getAllRoleInfoList()
        },
        getAllRoleInfoList(){
            let self=this
            Axios.get('/api/roleInfo/getListFromRoleInfoByPage?page=' + this.pages.page+'&roleName='+this.pages.roleName)
            .then(function(response) {
                if (response.code == 200) {
                    self.roleInfoList = response.data.roleInfoList;
                    self.pages['page'] = response.data.page;
                    self.pages['numPages'] = response.data.numPages;
                }else{
                    self.$message.error(response.message);
                }
            });
        },
        handleCurrentChange (page) {
            let self=this;
            self.pages['page'] = page;
            this.getAllRoleInfoList()
        },
        getRoleInfoAndApiInfoList(index){
            let self=this
            Axios.get('/api/roleInfo/getAllFromRoleInfoAndApiInfoByRoleId?roleId='+this.roleInfoList[index]['role_id'])
            .then(function(response) {
                if (response.code == 200) {
                    self.roleInfo = response.data.roleInfo;
                    self.apiInfoList = response.data.apiInfoList
                }else{
                    self.$message.error(response.message);
                }
            });
        },
        getRoleInfo(index){
            let self=this
            Axios.get('/api/roleInfo/getAllFromRoleInfoByRoleId?roleId='+this.roleInfoList[index]['role_id'])
            .then(function(response) {
                if (response.code == 200) {
                    self.roleInfo = response.data.roleInfo;
                }else{
                    self.$message.error(response.message);
                }
            });
        },
        message(){
            this.userPassWord = { oldPassWd: '', newPasswd: '', enterNewPasswd: '' }
            this.$message('已取消操作！');
        },
        updRoleInfo(){
            let self=this
            Axios.get('/api/roleInfo/updAllFromRoleInfoByRoleId?roleId='+this.roleInfo['role_id']
                +'&roleName='+this.roleInfo['role_name']+'&remarks='+this.roleInfo['remarks'])
            .then(function(response) {
                if (response.code == 200) {
                    self.pageInitialization()
                    self.getAllRoleInfoList()
                    self.$message({
                        type: 'success',
                        message: response.message
                    });
                }else{
                    self.$message.error(response.message);
                }
            });
        },
        loadAddRoleInfo(){
            this.roleInfo = {
                'role_name' : '',
                'remarks' : ''
            }
        },
        addRoleInfo(){
            let self=this
            Axios.get('/api/roleInfo/setFromRoleInfo?roleName='+this.roleInfo['role_name']+'&remarks='+this.roleInfo['remarks'])
            .then(function(response) {
                if (response.code == 200) {
                    self.pageInitialization()
                    self.getAllRoleInfoList()
                    self.$message({
                        type: 'success',
                        message: response.message
                    });
                }else{
                    self.$message.error(response.message);
                }
            });
        },
        delRoleInfo(index){
            this.$confirm('删除角色，同时部门中,关联的角色也会被清除, 是否继续?', '提示', {
                cancelButtonText: '取消',
                confirmButtonText: '确定',
                type: 'warning',
                center: true
            }).then(() => {
                let self=this
                Axios.get('/api/roleInfo/delFromRoleInfoByRoleId?roleId='+this.roleInfoList[index]['role_id'])
                .then(function(response) {
                    if (response.code == 200) {
                        self.pageInitialization()
                        self.getAllRoleInfoList()
                        self.$message({
                            type: 'success',
                            message: '删除角色成功!'
                        });
                    }else{
                        self.$message.error(response.message);
                    }
                });
            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消删除'
                });          
            });
        },
        addRoleInfoByApiInfo(){
            var notApiIdList = new Array()
            for(var i in this.selectNotApiIdList){
                notApiIdList.push(this.selectNotApiIdList[i]['api_id'])
            }
            if (notApiIdList.length > 0){
                let self=this
                Axios.get('/api/roleInfo/addApiListFromRoleIdByRoleId?roleId='+this.roleInfo.role_id+'&apiList=['+notApiIdList+']')
                .then(function(response) {
                    if (response.code == 200) {
                        self.loadRoleInfoAndApiInfoList(self.roleInfo.role_id)
                        self.$message({
                            type: 'success',
                            message: response.message
                        });
                    }else{
                        self.$message.error(response.message);
                    }
                });
            }
        },
        delRoleInfoByApiInfo(){
            var apiIdList = new Array()
            for(var i in this.selectApiIdList){
                apiIdList.push(this.selectApiIdList[i]['api_id'])
            }
            if (apiIdList.length > 0){
                let self=this
                Axios.get('/api/roleInfo/delApiListFromRoleIdByRoleId?roleId='+this.roleInfo.role_id+'&apiList=['+apiIdList+']')
                .then(function(response) {
                    if (response.code == 200) {
                        self.loadRoleInfoAndApiInfoList(self.roleInfo.role_id)
                        self.$message({
                            type: 'success',
                            message: response.message
                        });
                    }else{
                        self.$message.error(response.message);
                    }
                });
            }
            
        },
        loadRoleInfoAndApiInfoList(roleId){
            let self=this
            Axios.get('/api/roleInfo/getListFromRoleInfoAndApiInfoByRoleId?roleId='+roleId)
            .then(function(response) {
                if (response.code == 200) {
                    self.roleInfo = response.data.roleInfo;
                    self.apiInfoList = response.data.apiInfoList;
                    self.notApiInfoList = response.data.notApiInfoList;
                }else{
                    self.$message.error(response.message);
                }
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
    .searchn-avigation{
        margin-bottom: 20px;
    }
    .el-row-roleinfo{
        font-size: 16px;
        line-height: 40px;
        vertical-align: middle;
        border-bottom: 1px solid #efefef;
        margin-bottom: 18px;
    }
    .el-row{
        font-size: 16px;
    }
</style>