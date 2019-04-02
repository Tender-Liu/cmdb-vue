<template>
    <div class="page-body">
        <div class="page-header">
            <h1 class="page-title">权限管理</h1>
            <el-breadcrumb>
                <el-breadcrumb-item :to="{path: '/'}">首页</el-breadcrumb-item>
                <el-breadcrumb-item >API管理</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="box">

            <div class="demo-input-suffix searchn-avigation">
                API名：
                <el-input v-model="pages.apiUrl" placeholder="API名" style="width: 20%"></el-input>
                <el-button type="primary" @click.native.prevent="selectFromApiInfoList()">查询</el-button>
                <el-button type="success" style="float: right; margin-right: 20px;" @click="dialogAddApiInfoVisible=true" @click.native.prevent="loadAddApiInfo()">添加API</el-button>
            </div>

            <el-table :data="apiInfoList" border style="width: 100%">
                <el-table-column prop="api_id" label="API-ID" width="100" align="center"></el-table-column>
                <el-table-column prop="api_url" label="API地址" align="center"></el-table-column>
                <el-table-column prop="api_name" label="API名" align="center"></el-table-column>
                <el-table-column prop="remarks" label="API详情" align="center"></el-table-column>
                <el-table-column prop="create_time" label="创建时间"  align="center" width="180"></el-table-column>
                <el-table-column label="操作" width="220" align="center">
                    <template slot-scope="scope">
                    <el-button type="primary" size="small" @click="dialogUpdApiInfoVisible=true" @click.native.prevent="loadUpdApiInfo(scope.$index)">修改</el-button>
                    <el-button type="warning" size="small" @click="delApiInfo(scope.$index)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <br/>
            <el-pagination :page-size="5" :page-count="pages.numPages" :current-page="pages.page" layout="prev, pager, next"
             @current-change="handleCurrentChange"></el-pagination>
        </div>
    
        <el-dialog title="修改API信息" :visible.sync="dialogUpdApiInfoVisible" width="50%" align="center">
            <el-form ref="apiInfo" :model="apiInfo" style="width: 70%;"  label-width="20%" class="demo-ruleForm" >
            <el-form-item label="API-ID">
                <el-input v-model="apiInfo.api_id" disabled></el-input>
            </el-form-item>
            <el-form-item label="API名">
                <el-input v-model="apiInfo.api_name"></el-input>
            </el-form-item>
            <el-form-item label="API地址">
                <el-input v-model="apiInfo.api_url"></el-input>
            </el-form-item>
            <el-form-item label="创建时间">
                <el-input v-model="apiInfo.create_time" disabled></el-input>
            </el-form-item>
            <el-form-item label="备注">
                <el-input type="textarea" v-model="apiInfo.remarks" :rows="3"></el-input>
            </el-form-item>
            </el-form>
            <el-button type="primary" @click="dialogUpdApiInfoVisible=false" @click.native.prevent="updApiInfo()">提交</el-button>
            <el-button @click="dialogUpdApiInfoVisible=false ,message()">取消</el-button>
        </el-dialog>

        <el-dialog title="添加API信息" :visible.sync="dialogAddApiInfoVisible" width="50%" align="center">
            <el-form ref="apiInfo" :model="apiInfo" style="width: 70%;"  label-width="20%" class="demo-ruleForm" >
            <el-form-item label="API名">
                <el-input v-model="apiInfo.api_name"></el-input>
            </el-form-item>
            <el-form-item label="API地址">
                <el-input v-model="apiInfo.api_url"></el-input>
            </el-form-item>
            <el-form-item label="备注">
                <el-input type="textarea" v-model="apiInfo.remarks" :rows="3"></el-input>
            </el-form-item>
            </el-form>
            <el-button type="primary" @click="dialogAddApiInfoVisible=false" @click.native.prevent="addApiInfo()">提交</el-button>
            <el-button @click="dialogAddApiInfoVisible=false ,message()">取消</el-button>
        </el-dialog>

    </div>
    
</template>

<script>
import Axios from 'axios'
export default {
    data () {
        return {
            apiInfoList: [],
            pages: {
                'page': 1,
                'numPages': 1,
                'apiUrl': ''
            },
            apiInfo: {},
            dialogUpdApiInfoVisible: false,
            dialogAddApiInfoVisible: false

        }
    },
    mounted () {
        this.getAllApiInfoList()
    },
    methods: {
        pageInitialization () {
            this.pages['page'] = 1
            this.pages['apiUrl'] = ''
        },
        selectFromApiInfoList(){
            this.pages['page'] = 1
            this.getAllApiInfoList()
        },
        getAllApiInfoList(){
            let self=this
            Axios.get('/api/apiInfo/getListFromApiInfoByPage?page=' + this.pages.page+'&apiUrl='+this.pages.apiUrl)
            .then(function(response) {
                if (response.code == 200) {
                    self.apiInfoList = response.data.apiInfoList;
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
            this.getAllApiInfoList()
        },
        loadUpdApiInfo(index){
            let self=this
            Axios.get('/api/apiInfo/getAllFromApiInfoByApiId?apiId=' + this.apiInfoList[index]['api_id'])
            .then(function(response) {
                if (response.code == 200) {
                    self.apiInfo = response.data.apiInfo;
                }else{
                    self.$message.error(response.message);
                }
            });
        },
        message(){
            this.userPassWord = { oldPassWd: '', newPasswd: '', enterNewPasswd: '' }
            this.$message('已取消操作！');
        },
        loadAddApiInfo(){
            this.apiInfo = {
                'api_name': '',
                'api_url': '',
                'remarks': ''
            }
        },
        addApiInfo () {
            let self=this
            Axios.get('/api/apiInfo/setFromApiInfo?apiUrl='+this.apiInfo.api_url+'&apiName='+this.apiInfo.api_name
                +'&remarks='+this.apiInfo.remarks).then(function(response) {
                if (response.code == 200) {
                    self.pageInitialization()
                    self.getAllApiInfoList()
                    self.$message({
                        type: 'success',
                        message: response.message
                    });
                }else{
                    self.$message.error(response.message);
                }
            });
        },
        delApiInfo(index){
            this.$confirm('删除API信息，同时角色中,包含的本条信息也会被清除, 是否继续?', '提示', {
                cancelButtonText: '取消',
                confirmButtonText: '确定',
                type: 'warning',
                center: true
            }).then(() => {
                let self=this
                Axios.get('/api/apiInfo/delFromApiInfoByApiId?apiId='+this.apiInfoList[index]['api_id'])
                .then(function(response) {
                    if (response.code == 200) {
                        self.pageInitialization()
                        self.getAllApiInfoList()
                        self.$message({
                            type: 'success',
                            message: '删除API信息成功!'
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
        updApiInfo () {
            let self=this
            Axios.get('/api/apiInfo/updAllFromApiInfoByApiId?apiId='+this.apiInfo.api_id+'&apiUrl='+this.apiInfo.api_url+
                '&apiName='+this.apiInfo.api_name+'&remarks='+this.apiInfo.remarks)
            .then(function(response) {
                if (response.code == 200) {
                    self.pageInitialization()
                    self.getAllApiInfoList()
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