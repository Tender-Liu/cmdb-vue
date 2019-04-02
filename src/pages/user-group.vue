<template>
    <div class="page-body">
        <div class="page-header">
            <h1 class="page-title">权限管理</h1>
            <el-breadcrumb>
                <el-breadcrumb-item :to="{path: '/'}">首页</el-breadcrumb-item>
                <el-breadcrumb-item >部门管理</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="box">

            <div class="demo-input-suffix searchn-avigation">
                部门名：
                <el-input v-model="pages.groupName"  placeholder="部门名" style="width: 20%"></el-input>
                <el-button type="primary" @click.native.prevent="selectFromUserGroupList()">查询</el-button>
                <el-button type="success" style="float: right; margin-right: 20px;" @click="dialogAddUserGroupVisible=true" @click.native.prevent="loadAddUserGroup()">添加部门</el-button>
            </div>

            <el-table :data="userGroupList" border style="width: 100%">
                <el-table-column prop="group_id" label="部门ID" align="center"></el-table-column>
                <el-table-column prop="group_name" label="部门名" align="center"></el-table-column>
                <el-table-column prop="role__role_name" label="角色名" align="center"></el-table-column>
                <el-table-column prop="remarks" label="备注"  align="center"></el-table-column>
                <el-table-column prop="create_time" label="创建时间"  align="center" width="180"></el-table-column>
                <el-table-column label="操作" width="250" align="center">
                    <template slot-scope="scope">
                    <el-button type="primary" size="small" @click="dialogUserGroupVisible=true" @click.native.prevent="loadUpdUserGroup(scope.$index)">修改</el-button>
                    <el-button type="warning" size="small" @click="delUserGroup(scope.$index)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <br/>
            <el-pagination :page-size="5" :page-count="pages.numPages" :current-page="pages.page" layout="prev, pager, next"
             @current-change="handleCurrentChange"></el-pagination>
        </div>
    
        <el-dialog title="修改部门信息" :visible.sync="dialogUserGroupVisible" width="50%" align="center">
            <el-form ref="userGroup" :model="userGroup" style="width: 70%;"  label-width="20%" class="demo-ruleForm" >
            <el-form-item label="部门ID">
                <el-input v-model="userGroup.group_id" disabled></el-input>
            </el-form-item>
            <el-form-item label="部门名">
                <el-input v-model="userGroup.group_name"></el-input>
            </el-form-item>
            <el-form-item label="角色">
                <el-select v-model="userGroup.role" placeholder="角色" style="width: 100%">
                    <el-option v-for="item in roleInfoList" :key="item.role_id" :label="item.role_name" :value="item.role_id"> </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="创建时间">
                <el-input v-model="userGroup.create_time" disabled></el-input>
            </el-form-item>
            <el-form-item label="备注">
                <el-input type="textarea" v-model="userGroup.remarks" :rows="3"></el-input>
            </el-form-item>
            </el-form>
            <el-button type="primary" @click="dialogUserGroupVisible=false" @click.native.prevent="updUserGroup()">提交</el-button>
            <el-button @click="dialogUserGroupVisible=false ,message()">取消</el-button>
        </el-dialog>

        <el-dialog title="添加部门" :visible.sync="dialogAddUserGroupVisible" width="50%" align="center">
            <el-form ref="userGroup" :model="userGroup" style="width: 70%;"  label-width="20%" class="demo-ruleForm" >
            <el-form-item label="部门名">
                <el-input v-model="userGroup.group_name"></el-input>
            </el-form-item>
            <el-form-item label="角色">
                <el-select v-model="userGroup.role" placeholder="请选择权限角色" style="width: 100%">
                    <el-option v-for="item in roleInfoList" :key="item.role_id" :label="item.role_name" :value="item.role_id"> </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="备注">
                <el-input type="textarea" v-model="userGroup.remarks" :rows="3"></el-input>
            </el-form-item>
            </el-form>
            <el-button type="primary" @click="dialogAddUserGroupVisible=false" @click.native.prevent="addUserGroup()">提交</el-button>
            <el-button @click="dialogAddUserGroupVisible=false, message()">取消</el-button>
        </el-dialog>
    </div>
    
</template>

<script>
import Axios from 'axios'
export default {
    data () {
        return {
            userGroupList: [],
            pages: {
                'page': 1,
                'numPages': 1,
                'groupName': ''
            },
            userGroup: {},
            dialogUserGroupVisible: false,
            dialogAddUserGroupVisible: false,
            roleInfoList: []
        }
    },
    mounted () {
        this.selectFromUserGroupList()
        this.getRoleInfoList()
    },
    methods: {
        pageInitialization () {
            this.pages['page'] = 1
            this.pages['groupName'] = ''
        },
        selectFromUserGroupList(){
            this.pages['page'] = 1
            this.getAllUserGroupList()
        },
        getAllUserGroupList(){
            let self=this
            Axios.get('/api/userGroup/getListFromUserGroupByPage?page=' + this.pages.page+'&groupName='+this.pages.groupName)
            .then(function(response) {
                if (response.code == 200) {
                    self.userGroupList = response.data.userGroupList;
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
            this.getAllUserGroupList()
        },
        delUserGroup(index){
            this.$confirm('删除部门，部门中的人会被移除, 是否继续?', '提示', {
                cancelButtonText: '取消',
                confirmButtonText: '确定',
                type: 'warning',
                center: true
            }).then(() => {
                let self=this
                Axios.get('/api/userGroup/delFromUserGroupByGroupId?groupId='+this.userGroupList[index]['group_id'])
                .then(function(response) {
                    if (response.code == 200) {
                        self.pageInitialization()
                        self.getAllUserGroupList()
                        self.$message({
                            type: 'success',
                            message: '删除部门成功!'
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
        message(){
            this.userPassWord = { oldPassWd: '', newPasswd: '', enterNewPasswd: '' }
            this.$message('已取消操作！');
        },
        getRoleInfoList(){
            let self=this
            Axios.get('/api/roleInfo/getRoleIdAndRoleNameFromRoleInfo')
            .then(function(response) {
                if (response.code == 200) {
                    self.roleInfoList = response.data.roleInfoList;
                }else{
                    self.$message.error(response.message);
                }
            });
        },
        loadUpdUserGroup(index){
            let self=this
            Axios.get('/api/userGroup/getAllFromUserGroupByGroupId?groupId='+this.userGroupList[index]['group_id'])
            .then(function(response) {
                if (response.code == 200) {
                    self.userGroup = response.data.userGroup;
                }else{
                    self.$message.error(response.message);
                }
            });
        },
        loadAddUserGroup(){
            this.userGroup = {
                'group_name': '',
                'role': '',
                'remarks': ''
            }
        },
        addUserGroup(){
            let self=this
            Axios.get('/api/userGroup/setFromUserGroup?groupName='+this.userGroup.group_name+'&roleId='+this.userGroup.role
                +'&remarks='+this.userGroup.remarks)
            .then(function(response) {
                if (response.code == 200) {
                    self.pageInitialization()
                    self.getAllUserGroupList()
                    self.$message({
                        type: 'success',
                        message: response.message
                    });
                }else{
                    self.$message.error(response.message);
                }
            });
        },
        updUserGroup(){
            let self=this
            if (this.userGroup.role == null) {
                this.userGroup.role = ''
            }
            Axios.get('/api/userGroup/updAllFromUserGroupByGroupId?groupId='+this.userGroup.group_id+'&groupName='+this.userGroup.group_name+
                '&roleId='+this.userGroup.role+'&remarks='+this.userGroup.remarks)
            .then(function(response) {
                if (response.code == 200) {
                    self.pageInitialization()
                    self.getAllUserGroupList()
                    self.$message({
                        type: 'success',
                        message: response.message
                    });
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
</style>