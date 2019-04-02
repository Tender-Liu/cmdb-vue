<template>
    <div class="page-body">
        <div class="page-header">
            <h1 class="page-title">权限管理</h1>
            <el-breadcrumb>
                <el-breadcrumb-item :to="{path: '/'}">首页</el-breadcrumb-item>
                <el-breadcrumb-item >用户管理</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="box">

            <div class="demo-input-suffix searchn-avigation">
                部门：
                <el-select v-model="pages.groupId" placeholder="部门" style="width: 10%;margin-right: 10px;">
                        <el-option v-for="item in userGroupList" :key="item.group_id" :label="item.group_name" :value="item.group_id"> </el-option>
                </el-select>
                用户名：
                <el-input v-model="pages.userName" placeholder="用户名" style="width: 20%"></el-input>
                <el-button type="primary" @click.native.prevent="selectFromUserInfoList()">查询</el-button>
            </div>

            <el-table :data="userInfoList" border style="width: 100%">
                <el-table-column prop="user_id" label="用户ID" align="center"></el-table-column>
                <el-table-column prop="user_name" label="用户名" align="center"></el-table-column>
                <el-table-column prop="group__group_name" label="部门" align="center"></el-table-column>
                <el-table-column prop="phone" label="手机号码"  align="center"></el-table-column>
                <el-table-column prop="email" label="邮箱"  align="center"></el-table-column>
                <el-table-column prop="state" label="状态" align="center">
                    <template slot-scope="scope">
                    <el-tag :type=stateColor[scope.row.state]>{{state[scope.row.state]}}</el-tag>
                    </template>
                </el-table-column>
                <el-table-column prop="created_time" label="创建时间" width="180"  align="center"></el-table-column>
                <el-table-column label="操作" width="250" align="center">
                    <template slot-scope="scope">
                    <el-button type="primary" size="small" @click="dialogUserInfoVisible=true" @click.native.prevent="loadUserInfo(scope.$index)">修改信息</el-button>
                    <el-button type="warning" size="small" @click="dialogPasswdoVisible=true" @click.native.prevent="loadUserInfo(scope.$index)">重置密码</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <br/>
            <el-pagination :page-size="5" :page-count="pages.numPages" :current-page="pages.page" layout="prev, pager, next"
             @current-change="handleCurrentChange"></el-pagination>
        </div>

        <el-dialog title="修改个人资料" :visible.sync="dialogUserInfoVisible" width="50%" align="center">
            <el-form ref="userInfo" :model="userInfo" style="width: 70%;"  label-width="20%" class="demo-ruleForm" >
            <el-form-item label="用户名">
                <el-input v-model="userInfo.user_name" disabled></el-input>
            </el-form-item>
            <el-form-item label="部门">
                <el-select v-model="userInfo.group__group_id" placeholder="部门" style="width: 100%">
                    <el-option v-for="item in edituserGroupList" :key="item.group_id" :label="item.group_name" :value="item.group_id"> </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="手机号码">
                <el-input v-model="userInfo.phone" disabled></el-input>
            </el-form-item>
            <el-form-item label="邮箱">
                <el-input v-model="userInfo.email" disabled></el-input>
            </el-form-item>
            <el-form-item label="状态">
                <el-select v-model="userInfo.state" placeholder="请选择" style="width: 100%">
                    <el-option v-for="(value, key) in state" :key="parseInt(key)" :label="value" :value="parseInt(key)"> </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="创建时间">
                <el-input v-model="userInfo.created_time" disabled></el-input>
            </el-form-item>
            </el-form>
            <el-button type="primary" @click="dialogUserInfoVisible=false" @click.native.prevent="updGroupFromUserInfo()">提交</el-button>
            <el-button @click="dialogUserInfoVisible=false, message()">取消</el-button>
        </el-dialog>
    
        <el-dialog title="重置用户密码" :visible.sync="dialogPasswdoVisible" width="40%" align="center">
            <el-form ref="userPassWord" :model="userPassWord" style="width: 70%;"  label-width="20%" class="demo-ruleForm" >
            <el-form-item label="重置密码">
                <el-input type="password" v-model="userPassWord.Passwd"></el-input>
            </el-form-item>
            </el-form>
            <el-button type="primary" @click="dialogPasswdoVisible=false"  @click.native.prevent="updPasswordFromUserInfo()">提交</el-button>
            <el-button @click="dialogPasswdoVisible=false, message()">取消</el-button>
        </el-dialog>

    </div>
    
</template>

<script>
import Axios from 'axios'
export default {
    data () {
        return {
            userInfoList: [],
            pages: {
                'page': 1,
                'numPages': 1,
                'groupId': 0,
                'userName': ''
            },
            userGroupList: [],
            edituserGroupList: [],
            userInfo: {},
            dialogUserInfoVisible: false,
            dialogPasswdoVisible:false,
            userPassWord: {Passwd: ''},
            state: {
                1: '在职',
                2: '离职'
            },
            stateColor: {
                1: 'success',
                2: 'info'
            }
        }
    },
    mounted () {
        this.selectFromUserInfoList()
        this.getUserGroup()
    },
    methods: {
        pageInitialization () {
            this.pages['page'] = 1
            this.pages['groupId'] = ''
            this.pages['userName'] = ''
        },
        selectFromUserInfoList(){
            this.pages['page'] = 1
            this.getAllUserInfoList()
        },
        getAllUserInfoList(){
            let self=this
            Axios.get('/api/userInfo/getAllFromUserInfoByPage?page=' + this.pages.page+'&groupId='+this.pages.groupId
                    +'&userName='+this.pages.userName)
            .then(function(response) {
                if (response.code == 200) {
                    self.userInfoList = response.data.userInfoList;
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
            this.getAllUserInfoList()
        },
        getUserGroup(){
            let self=this
            Axios.get('/api/userGroup/getGroupIdAndGroupNameFromUserGroup').then(function(response) {
                if (response.code == 200){
                    self.userGroupList = response.data.userGroupList
                    self.userGroupList.splice(self.insertPos, 0, {'group_id': 0,'group_name': '全部'})
                }
            });
        },
        loadUserInfo(index){
            let self=this
            Axios.get('/api/userInfo/getAllFromUsreInfoByUserId?userId='+this.userInfoList[index].user_id).then(function(response) {
                if (response.code == 200){
                    self.userInfo = response.data.userInfo
                }
            });
            Axios.get('/api/userGroup/getGroupIdAndGroupNameFromUserGroup').then(function(response) {
                if (response.code == 200){
                    self.edituserGroupList = response.data.userGroupList
                }
            });
        },
        message(){
            this.userPassWord = { oldPassWd: '', newPasswd: '', enterNewPasswd: '' }
            this.$message('已取消操作！');
        },
        updGroupFromUserInfo(){
            if (this.userInfo.group__group_id == null) {
                this.userInfo.group__group_id = ''
            }
            let self=this
            Axios.get('/api/userInfo/updGroupFromUserInfoByUserId?userId='+this.userInfo.user_id+'&groupId='+this.userInfo.group__group_id+'&state='+this.userInfo.state)
                .then(function(response) {
                    if (response.code == 200){
                        self.pageInitialization ()
                        self.selectFromUserInfoList()
                        self.$message({
                            type: 'success',
                            message: response.message
                        });  
                    }else{
                        self.$message.error(response.message);
                    }
            });
        },
        updPasswordFromUserInfo(){
            let self=this
            Axios.get('/api/userInfo/updPassWordFromUserInfoByUserId?userId='+this.userInfo.user_id+'&password='+this.userPassWord.Passwd)
                .then(function(response) {
                    if (response.code == 200){
                        self.pageInitialization ()
                        self.selectFromUserInfoList()
                        self.$message({
                            type: 'success',
                            message: response.message
                        });  
                    }else{
                        self.$message.error(response.message);
                    }
            });
            this.userPassWord = {Passwd: ''}
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