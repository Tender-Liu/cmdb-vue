<template>
    <div class="page-body">
        <div class="page-header">
            <h1 class="page-title">发布管理</h1>
            <el-breadcrumb>
                <el-breadcrumb-item :to="{path: '/'}">首页</el-breadcrumb-item>
                <el-breadcrumb-item >GIT列表</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="box">
            <div class="demo-input-suffix searchn-avigation">
                git名：
                <el-input v-model="pages.gitName"  placeholder="git名" style="width: 20%"></el-input>
                <el-button type="primary" @click.native.prevent="getAllFromGitInfoByPage()">查询</el-button>
                <el-button type="success" style="float: right; margin-right: 20px;" @click="dialogAddGitInfoVisible = true" @click.native.prevent="gitInfo={}">添加GIT账户</el-button>
            </div>

            <el-table :data="gitInfoList" border style="width: 100%">
                <el-table-column prop="git_id" label="GitId" align="center" width="100"></el-table-column>
                <el-table-column prop="git_name" label="Git用户" align="center"></el-table-column>
                <el-table-column prop="git_pass" label="Git密码"  align="center"></el-table-column>
                <el-table-column prop="git_key" label="Git私钥" align="center"></el-table-column>
                <el-table-column prop="update_time" label="更新时间"  align="center" width="180"></el-table-column>
                <el-table-column prop="remarks" label="备注"  align="center" width="180"></el-table-column>
                <el-table-column label="操作" width="250" align="center"> 
                    <template slot-scope="scope">
                        <el-button type="success" size="small"@click="dialogTestGitInfoVisible = true"
                            @click.native.prevent="getAllFromProjectNameFromGitId(gitInfoList[scope.$index].git_id)">测试</el-button>
                        <el-button type="primary" size="small"@click="dialogUpdGitInfoVisible = true"
                            @click.native.prevent="getGitNameFromGitInfo(gitInfoList[scope.$index].git_id)">修改</el-button>
                        <el-button type="warning" size="small" @click.native.prevent="delFromGitInfoByGitId(gitInfoList[scope.$index].git_id)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <br/>
            <!-- 分页 -->
            <el-pagination :page-size="5" :page-count="pages.numPages" :current-page="pages.page" layout="prev, pager, next"
             @current-change="handleCurrentChange"></el-pagination>

        </div>


        <!-- git账号密码测试-->
        <el-dialog title="Git账号测试项目" :visible.sync="dialogTestGitInfoVisible" width="40%">
            <div class="demo-input-suffix searchn-avigation" align="center">
                项目：
                <el-select v-model="projectId" placeholder="请选择的项目" style="width: 40%">
                    <el-option v-for="item in projectInfoList" :key="item.project_id" :label="item.project_name" :value="item.project_id"> </el-option>
                </el-select>
                <el-button type="primary" @click.native.prevent="getBranchsFromGitByProjectId()">测试</el-button>

                <el-card class="box-card" style="width: 85%"  v-loading="loadingGitBranchs"
                    element-loading-text="第一次获取分支比较慢, 还请耐心等待一下, 谢谢!" element-loading-background="rgba(0, 0, 0, 0.8)">
                    <div v-for="branch in branchs">
                        <el-tag  class="git_branch">{{ branch }}</el-tag>
                    </div>
                </el-card>
            </div>
            
            <div slot="footer" class="dialog-footer" align="center" >
                <el-button @click="dialogTestGitInfoVisible = false">退 出</el-button>
            </div>
        </el-dialog>

        <!-- 添加Git用户信息 -->
        <el-dialog title="修改Git信息" :visible.sync="dialogAddGitInfoVisible" width="60%">
            <el-form  ref="gitInfo" :model="gitInfo" label-width="30%" >
                <el-form-item label="Git用户：">
                    <el-input v-model="gitInfo.git_name" style="width: 70%"></el-input>
                </el-form-item>
                <el-form-item label="Git密码：">
                    <el-input v-model="gitInfo.git_pass" style="width: 70%"></el-input>
                </el-form-item>
                <el-form-item label="Git私钥：">
                     <el-input type="textarea" v-model="gitInfo.git_key" :rows="4" style="width: 70%" disabled placeholder="注意: git地址只能支持http协议，ssh协议暂不支持"></el-input>
                </el-form-item>
                <el-form-item label="备注：">
                    <el-input type="textarea" v-model="gitInfo.remarks" :rows="4" style="width: 70%"></el-input>
                </el-form-item>
            </el-form>

            <div slot="footer" class="dialog-footer" align="center" >
                <el-button type="primary" @click="dialogAddGitInfoVisible = false" @click.native.prevent="addFromGitInfo()">确 定</el-button>
                <el-button @click="dialogAddGitInfoVisible = false">取 消</el-button>
            </div>
        </el-dialog>

        <!-- 修改Git用户信息 -->
        <el-dialog title="修改Git信息" :visible.sync="dialogUpdGitInfoVisible" width="60%">
            <el-form  ref="gitInfo" :model="gitInfo" label-width="30%" >
                <el-form-item label="GitId：">
                    <el-input v-model="gitInfo.git_id" style="width: 70%" disabled></el-input>
                </el-form-item>
                <el-form-item label="Git用户：">
                    <el-input v-model="gitInfo.git_name" style="width: 70%"></el-input>
                </el-form-item>
                <el-form-item label="Git密码：">
                    <el-input v-model="gitInfo.git_pass" style="width: 70%"></el-input>
                </el-form-item>
                <el-form-item label="Git私钥：">
                     <el-input type="textarea" v-model="gitInfo.git_key" :rows="4" style="width: 70%" disabled placeholder="注意: git地址只能支持http协议，ssh协议暂不支持"></el-input>
                </el-form-item>
                <el-form-item label="备注：">
                    <el-input type="textarea" v-model="gitInfo.remarks" :rows="4" style="width: 70%"></el-input>
                </el-form-item>
            </el-form>

            <div slot="footer" class="dialog-footer" align="center" >
                <el-button type="primary" @click="dialogUpdGitInfoVisible = false" @click.native.prevent="updAllFromGitInfoByGitId()">确 定</el-button>
                <el-button @click="dialogUpdGitInfoVisible = false">取 消</el-button>
            </div>
        </el-dialog>

    </div>
</template>

<script>
import Axios from 'axios'
export default {
    data () {
        return {
            pages: {
                'page': 1,
                'numPages': 1,
                'gitName': ''
            },
            gitInfoList: [],
            gitInfo: {},
            projectInfoList: [],
            branchs: [],
            projectId: '',
            loadingGitBranchs: false,
            dialogUpdGitInfoVisible: false,
            dialogAddGitInfoVisible: false,
            dialogTestGitInfoVisible: false
        }
    },
    mounted () {
        this.getAllFromGitInfoByPage()
    },
    methods: {
        // 分页绑定事件
        handleCurrentChange (page) {
            let self=this;
            self.pages['page'] = page;
            this.getAllFromGitInfoByPage()
        },
        //获取分页信息
        getAllFromGitInfoByPage(){
            let self=this
            Axios.get('/api/gitInfo/getAllFromGitInfoByPage', {
                params: {
                    page: self.pages.page,
                    gitName: self.pages.gitName
                }
            }).then(function (response) {
                if ( response.code == 200 ) {
                    self.gitInfoList = response.data.gitInfoList
                    self.pages.page = response.data.page;
                    self.pages.numPages = response.data.numPages;
                }else{
                    self.$message.error(response.message);
                }
            })
            .catch(function (errer) {
                self.$message.error(errer);
            });
        },
        //获取指定git信息详情
        getGitNameFromGitInfo(gitId){
            let self=this
            Axios.get('/api/gitInfo/getAllFromGitInfoByGitId', {
                params: {
                    gitId: gitId
                }
            }).then(function (response) {
                if ( response.code == 200 ) {
                    self.gitInfo = response.data.gitInfo
                }else{
                    self.$message.error(response.message);
                }
            })
            .catch(function (errer) {
                self.$message.error(errer);
            });
        },
        //删除git信息
        delFromGitInfoByGitId(gitId){
            this.$confirm('是否确定删除git用户信息?', '注意', {
                cancelButtonText: '取消',
                confirmButtonText: '确定',
                type: 'warning',
                center: true
            }).then(() => {
                let self=this
                Axios.get('/api/gitInfo/delFromGitInfoByGitId?gitId='+gitId)
                .then(function(response) {
                    if (response.code == 200) {
                        self.$message({
                            type: 'success',
                            message: '项目删除成功!'
                        });
                        self.getAllFromGitInfoByPage()
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
        //更新git用户信息
        updAllFromGitInfoByGitId(){
            let self=this
            Axios.get('/api/gitInfo/updAllFromGitInfoByGitId', {
                params: {
                    gitId: self.gitInfo.git_id,
                    remarks: self.gitInfo.remarks,
                    gitName: self.gitInfo.git_name,
                    gitKey: self.gitInfo.git_key,
                    gitPass: self.gitInfo.git_pass
                }
            }).then(function (response) {
                if ( response.code == 200 ) {
                    self.$message({ type: 'success', message: response.message });
                    self.getAllFromGitInfoByPage()
                }else{
                    self.$message.error(response.message);
                }
            })
            .catch(function (errer) {
                self.$message.error(errer);
            });
        },
        //添加git用户信息
        addFromGitInfo(){
            let self=this
            Axios.get('/api/gitInfo/addFromGitInfo', {
                params: {
                    remarks: self.gitInfo.remarks,
                    gitName: self.gitInfo.git_name,
                    gitKey: self.gitInfo.git_key,
                    gitPass: self.gitInfo.git_pass
                }
            }).then(function (response) {
                if ( response.code == 200 ) {
                    self.$message({ type: 'success', message: response.message });
                    self.getAllFromGitInfoByPage()
                }else{
                    self.$message.error(response.message);
                }
            })
            .catch(function (errer) {
                self.$message.error(errer);
            });
        },
        //获取指定gitId的项目列表
        getAllFromProjectNameFromGitId(gitId){
            let self=this;
            this.branchs = [];
            this.projectId = '';
            Axios.get('/api/projectInfo/getAllFromProjectNameFromGitId?gitId='+gitId, {
                }).then(function (response) {
                if ( response.code == 200 ) {
                    self.projectInfoList = response.data.projectInfoList
                }else{
                    self.$message.error(response.message);
                }
            })
            .catch(function (errer) {
                self.$message.error(errer);
            });
        },
        //根据项目id，查询git分支
        getBranchsFromGitByProjectId(){
            this.loadingGitBranchs = true;
            let self=this
            Axios.get('/api/gitInfo/getBranchsFromGitByProjectId?projectId='+this.projectId, {
                }).then(function (response) {
                if ( response.code == 200 ) {
                    self.branchs = response.data.branchs
                }else{
                    self.$message.error(response.message);
                    self.branchs = []
                }
                self.loadingGitBranchs = false;
            })
            .catch(function (errer) {
                self.$message.error(errer);
                self.branchs = []
                self.loadingGitBranchs = false;
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
    .box-card {
        margin-top: 20px;
        width: 80%;
        height: 300px;
    }
    .git_branch {
        float: left;
        height: 40px;
        font-size: 14px;
        line-height: 40px;
        margin: 10px 10px 5px 10px;
    }
</style>