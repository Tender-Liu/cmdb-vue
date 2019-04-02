<template>
    <div class="page-body">
        <div class="page-header">
            <h1 class="page-title">权限管理</h1>
            <el-breadcrumb>
                <el-breadcrumb-item :to="{path: '/'}">首页</el-breadcrumb-item>
                <el-breadcrumb-item >用户管理</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="box" align="center">
            <el-card style="width: 55%;">
                <div slot="header" >
                    <span style="font-size: 18px"><i class="fa fa-address-card-o"></i> &nbsp;个人信息</span>
                </div>
                <div>
                    <el-row :gutter="20">
                        <el-col :span="8" align="right" style="color:#3399FF"><div><i class="fa fa-address-book-o"></i> &nbsp;用户名: </div></el-col>
                        <el-col :span="16" align="center" ><div>{{ userInfo.user_name }}</div></el-col>
                    </el-row>
                    <el-row :gutter="20">
                        <el-col :span="8" align="right" style="color:#3399FF"><div><i class="fa fa-users"></i> &nbsp;部门: </div></el-col>
                        <el-col :span="16" align="center" ><div>{{ userInfo.group__group_name }}</div></el-col>
                    </el-row>
                    <el-row :gutter="20">
                        <el-col :span="8" align="right" style="color:#3399FF"><div><i class="fa fa-tablet"></i> &nbsp;手机号码: </div></el-col>
                        <el-col :span="16" align="center" ><div>{{ userInfo.phone }}</div></el-col>
                    </el-row>
                    <el-row :gutter="20">
                        <el-col :span="8" align="right" style="color:#3399FF"><div><i class="fa fa-envelope-o"></i> &nbsp;邮箱: </div></el-col>
                        <el-col :span="16" align="center" ><div>{{ userInfo.email }}</div></el-col>
                    </el-row>
                    <el-row :gutter="20">
                        <el-col :span="8" align="right" style="color:#3399FF"><div><i class="fa fa-calendar-check-o"></i> &nbsp;创建时间: </div></el-col>
                        <el-col :span="16" align="center" ><div>{{ userInfo.created_time }}</div></el-col>
                    </el-row>
                    <br>
                    <el-button type="primary" @click="dialogUserInfoVisible=true">修改信息</el-button>
                    <el-button type="primary" @click="dialogPasswdoVisible=true">修改密码</el-button>
                </div>
            </el-card>
        </div>

        <el-dialog title="修改个人资料" :visible.sync="dialogUserInfoVisible" width="50%" align="center">
            <el-form ref="userInfo" :model="userInfo" style="width: 70%;"  label-width="20%" class="demo-ruleForm" >
            <el-form-item label="用户名">
                <el-input v-model="userInfo.user_name" ></el-input>
            </el-form-item>
            <el-form-item label="部门">
                <el-input v-model="userInfo.group__group_name" disabled></el-input>
            </el-form-item>
            <el-form-item label="手机号码">
                <el-input v-model="userInfo.phone"></el-input>
            </el-form-item>
            <el-form-item label="邮箱">
                <el-input v-model="userInfo.email"></el-input>
            </el-form-item>
            <el-form-item label="创建时间">
                <el-input v-model="userInfo.created_time" disabled></el-input>
            </el-form-item>
            </el-form>
            <el-button type="primary" @click="dialogUserInfoVisible=false" @click.native.prevent="updInfoFromUserInfo()">提交</el-button>
            <el-button @click="dialogUserInfoVisible=false, message()">取消</el-button>
        </el-dialog>

        <el-dialog title="修改密码" :visible.sync="dialogPasswdoVisible" width="40%" align="center">
            <el-form ref="userPassWord" :model="userPassWord" style="width: 70%;"  label-width="20%" class="demo-ruleForm" >
            <el-form-item label="老密码">
                <el-input type="password" v-model="userPassWord.oldPassWd"></el-input>
            </el-form-item>
            <el-form-item label="新密码">
                <el-input type="password" v-model="userPassWord.newPasswd"></el-input>
            </el-form-item>
            <el-form-item label="确认密码">
                <el-input type="password" v-model="userPassWord.enterNewPasswd"></el-input>
            </el-form-item>
            </el-form>
            <el-button type="primary" @click="dialogPasswdoVisible=false"  @click.native.prevent="updPassWordFromUserInfo()">提交</el-button>
            <el-button @click="dialogPasswdoVisible=false, message()">取消</el-button>
        </el-dialog>
    </div>
    
</template>

<script>
import Axios from 'axios'
import {mapActions, mapState} from 'vuex'
export default {
    data () {
        return {
            userInfo: {},
            userPassWord: {
                oldPassWd: '',
                newPasswd: '',
                enterNewPasswd: ''
            },
            dialogUserInfoVisible: false,
            dialogPasswdoVisible: false
        }
    },
    mounted () {
        this.getAllUserInfo()
    },
    methods: {
        ...mapActions(['getLoginUser', 'logout']),
        getAllUserInfo(){
            let self=this
            Axios.get('/api/userInfo/getAllFromUsreInfoByMyself')
            .then(function(response) {
                if (response.code == 200) {
                    self.userInfo = response.data.userInfo;
                }else{
                    self.$message.error(response.message);
                }
            });
        },
        message(){
            this.userPassWord = { oldPassWd: '', newPasswd: '', enterNewPasswd: '' }
            this.$message('已取消操作！');
        },
        updInfoFromUserInfo(){
            if (this.userInfo.user_name == '') {
                this.$message.error('更新失败: 用户名不能为空');
                this.getAllUserInfo()
                return
            }
            if( this.userInfo.email == ''){
                this.$message.error('更新失败: 邮箱不能为空');
                this.getAllUserInfo()
                return
            }else{
                var reg=/^(\w-*\.*)+@(\w-?)+(\.\w{2,})+$/;;
                if(!reg.test(this.userInfo.email)){
                    this.$message.error('更新失败: 邮箱格式不正确');
                    this.getAllUserInfo()
                    return
                }
            }
            if(this.userInfo.phone == ''){
                this.$message.error('更新失败: 手机号码不能为空');
                this.getAllUserInfo()
                return
            }else{
                var reg=/^1[23456789]\d{9}$/;
                if(!reg.test(this.userInfo.phone)){
                    this.$message.error('更新失败: 手机号码不正确');
                    this.getAllUserInfo()
                    return
                }
            }

            let self=this
            Axios.get('/api/userInfo/updInfoFromUserInfo?userName='+this.userInfo.user_name+'&phone='+this.userInfo.phone
                +'&email='+this.userInfo.email)
                .then(function(response) {
                    self.getAllUserInfo()
                    if (response.code == 200){
                        self.$message({
                            type: 'success',
                            message: response.message
                        });  
                    }else{
                        self.$message.error(response.message);
                    }
            });
            
        },
        updPassWordFromUserInfo(){
            if(this.userPassWord.oldPassWd == ''  && this.userPassWord.newPasswd == ''  && this.userPassWord.enterNewPasswd == ''){
                this.$message.error('输入的密码不能为空!');
            }
            else if(this.userPassWord.oldPassWd.length < 6  && this.userPassWord.newPasswd.length < 6  && this.userPassWord.enterNewPasswd.length < 6){
                this.$message.error('输入的密码不能小于6个字符!');
            }
            else if (this.userPassWord.newPasswd != this.userPassWord.enterNewPasswd) {
                this.$message.error('输入的两次新密码不相同！'); 
            }
            else{
                let self=this
                Axios.get('/api/userInfo/updPassWordFromUserInfo?oldPassWrod='+this.userPassWord.oldPassWd+'&newPassWord='+this.userPassWord.newPasswd)
                    .then(function(response) {
                        if (response.code == 200){
                            self.$message({
                                type: 'success',
                                message: response.message+',请重新登录！'
                            });
                            Axios.get('/api/userInfo/delFromSessionByKey').then(function(response) {})
                            self.$router.push({name: 'p-login'});
                            self.logout()
                        }else{
                            self.$message.error(response.message);
                        }
                });
            }
            this.userPassWord = { oldPassWd: '', newPasswd: '', enterNewPasswd: '' }
        }
    }
}
</script>

<style>
    .box-body{
        width: 100%;
        overflow: auto;
    }
    .el-row{
        line-height: 45px;
        vertical-align: middle;
        font-size: 15px;
        border-bottom: 1px solid #efefef;
        margin-bottom: 5px；
    }
</style>