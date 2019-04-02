<template>
    <div class="page-body">
        <div class="page-header">
            <h1 class="page-title">资产管理</h1>
            <el-breadcrumb>
                <el-breadcrumb-item :to="{path: '/'}">首页</el-breadcrumb-item>
                <el-breadcrumb-item >项目列表</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="box">
            <!-- 查询搜索框 -->
            <div class="demo-input-suffix searchn-avigation">
                项目名：
                <el-input v-model="pages.projectName"  placeholder="项目名" style="width: 20%"></el-input>
                <el-button type="primary" @click.native.prevent="selectFromProjectInfoList()">查询</el-button>
                <el-button type="success" style="float: right; margin-right: 20px;" @click="dialogAddProjectInfoVisible=true" @click.native.prevent="loadAddProjectInfo()">添加项目</el-button>
            </div>
            
            <!-- 项目列表展示 -->
            <el-table :data="projectInfoList" border style="width: 100%," >
                <el-table-column prop="project_id" label="项目ID" align="center" width="100"></el-table-column>
                <el-table-column prop="project_name" label="项目名称" align="center"></el-table-column>
                <el-table-column prop="project_path" label="项目路径" align="center"></el-table-column>
                <el-table-column prop="project_path" label="包路径" align="center"></el-table-column>
                <el-table-column prop="project_port" label="端口" align="center" width="100"></el-table-column>
                <el-table-column prop="project_type" label="类型" align="center" width="100">
                    <template slot-scope="scope">
                        <el-tag :type=typeColor[scope.row.project_type] >{{type[scope.row.project_type]}}</el-tag>
                    </template>
                </el-table-column>
                <el-table-column prop="update_time" label="更新时间"  align="center" width="160"></el-table-column>
                <el-table-column label="操作" width="250" align="center">
                    <template slot-scope="scope">
                        <el-button type="primary" size="small"  @click="dialogProjectInfoVisible=true"
                            @click.native.prevent="getProjectInfo(projectInfoList[scope.$index]['project_id'])">查看</el-button>
                        <el-button type="primary" size="small" @click="dialogUpdProjectInfoVisible = true" 
                            @click.native.prevent="getProjectInfo(projectInfoList[scope.$index]['project_id'])">修改</el-button>
                        <el-button type="warning" size="small" @click.native.prevent="delProjectInfoByProjectId(projectInfoList[scope.$index]['project_id'])">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <br/>
            <!-- 分页 -->
            <el-pagination :page-size="5" :page-count="pages.numPages" :current-page="pages.page" layout="prev, pager, next"
             @current-change="handleCurrentChange"></el-pagination>

        </div>

    <!-- 查看项目详情对话框 -->
    <el-dialog title="项目详情" :visible.sync="dialogProjectInfoVisible" width="80%" align="center">
        <el-row :gutter="20" style="margin-bottom: 10px; padding-bottom: 10px">
            <el-col :span="11">
                <el-card class="box-card">
                <el-row :gutter="20" class="el-row">
                    <el-col :span="8" align="right" style="color:#3399FF"><div>项目Id:</div></el-col>
                    <el-col :span="16" align="center"><div>{{projectInfo.project_id}}</div></el-col>
                </el-row>
                <el-row :gutter="20" class="el-row">
                    <el-col :span="8" align="right" style="color:#3399FF"><div>项目名称:</div></el-col>
                    <el-col :span="16" align="center"><div>{{projectInfo.project_name}}</div></el-col>
                </el-row>
                <el-row :gutter="20" class="el-row">
                    <el-col :span="8" align="right" style="color:#3399FF"><div>端口:</div></el-col>
                    <el-col :span="16" align="center"><div>{{projectInfo.project_port}}</div></el-col>
                </el-row>
                <el-row :gutter="20" class="el-row">
                    <el-col :span="8" align="right" style="color:#3399FF"><div>类型:</div></el-col>
                    <el-col :span="16" align="center"><div><el-tag :type=typeColor[projectInfo.project_type]>{{type[projectInfo.project_type]}}</el-tag></div></el-col>
                </el-row>
                <el-row :gutter="20" class="el-row">
                    <el-col :span="8" align="right" style="color:#3399FF"><div>更新时间:</div></el-col>
                    <el-col :span="16" align="center"><div>{{projectInfo.update_time}}</div></el-col>
                </el-row>
                <el-row :gutter="20" class="el-row">
                    <el-col :span="8" align="right" style="color:#3399FF"><div>备注:</div></el-col>
                    <el-col :span="16" align="center"><div>{{projectInfo.remarks}}</div></el-col>
                </el-row>
                </el-card>
            </el-col>
            <el-col :span="13">
                <el-card class="box-card">
                <el-row :gutter="20" class="el-row">
                    <el-col :span="8" align="right" style="color:#3399FF"><div>项目路径:</div></el-col>
                    <el-col :span="16" align="center"><div>{{projectInfo.project_path}}</div></el-col>
                </el-row>
                <el-row :gutter="20" class="el-row">
                    <el-col :span="8" align="right" style="color:#3399FF"><div>项目包路径:</div></el-col>
                    <el-col :span="16" align="center"><div>{{projectInfo.package_path}}</div></el-col>
                </el-row>
                <el-row :gutter="20" class="el-row">
                    <el-col :span="8" align="right" style="color:#3399FF"><div>git账号:</div></el-col>
                    <el-col :span="16" align="center"><div>{{projectInfo.git__git_name}}</div></el-col>
                </el-row>
                <el-row :gutter="20" class="el-row">
                    <el-col :span="8" align="right" style="color:#3399FF"><div>gitlab地址:</div></el-col>
                    <el-col :span="16" align="center"><div>{{projectInfo.github_url}}</div></el-col>
                </el-row>
                <el-row :gutter="20" class="el-row">
                    <el-col :span="8" align="right" style="color:#3399FF"><div>maven包获取路径:</div></el-col>
                    <el-col :span="16" align="center"><div>{{projectInfo.maven_path}}</div></el-col>
                </el-row>
                </el-card>
            </el-col>
        </el-row>
    </el-dialog>

    <!-- 修改项目详情对话框 -->
    <el-dialog title="修改项目详情" :visible.sync="dialogUpdProjectInfoVisible" width="60%">
        <el-form  ref="projectInfo" :model="projectInfo" label-width="30%" >
            <el-form-item label="项目ID：" >
                <el-input v-model="projectInfo.project_id" disabled style="width: 70%"></el-input>
            </el-form-item>
            <el-form-item label="项目名称：">
                <el-input v-model="projectInfo.project_name" style="width: 70%"></el-input>
            </el-form-item>
            <el-form-item label="项目路径：">
                <el-input v-model="projectInfo.project_path" style="width: 70%"></el-input>
            </el-form-item>
            <el-form-item label="包路径：" >
                <el-input v-model="projectInfo.package_path" style="width: 70%"></el-input>
            </el-form-item>
            <el-form-item label="端口：" >
                <el-input v-model="projectInfo.project_port" style="width: 70%"></el-input>
            </el-form-item>
            <el-form-item label="git账户：" >
                <el-select v-model="projectInfo.git" placeholder="请选择git账户" style="width: 70%">
                    <el-option v-for="item in gitInfoList" :key="parseInt(item.git_id)" :label="item.git_name" :value="parseInt(item.git_id)"> </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="github_url：" >
                <el-input v-model="projectInfo.github_url" style="width: 70%" placeholder="注意: git地址只能支持http协议，ssh协议暂不支持"></el-input>
            </el-form-item>
            <el-form-item label="maven包获取路径：" >
                <el-input v-model="projectInfo.maven_path" style="width: 70%"></el-input>
            </el-form-item>
            <el-form-item label="类型：">
                <el-select v-model="projectInfo.project_type" placeholder="请选择类型" style="width: 70%">
                    <el-option v-for="(key, value) in type" :key="parseInt(value)" :label="key" :value="parseInt(value)"> </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="项目备注：">
                <el-input type="textarea" v-model="projectInfo.remarks" :rows="4" style="width: 70%"></el-input>
            </el-form-item>
        </el-form>

        <div slot="footer" class="dialog-footer" align="center">
            <el-button type="primary" @click="dialogUpdProjectInfoVisible = false" @click.native.prevent="updProjectInfoByProjectId()">确 定</el-button>
            <el-button @click="dialogUpdProjectInfoVisible = false" @click.native.prevent="">取 消</el-button>
        </div>
    </el-dialog>

    <!-- 添加项目对话框 -->
    <el-dialog title="添加新项目" :visible.sync="dialogAddProjectInfoVisible" width="60%">
        <el-form  ref="projectInfo" :model="projectInfo" label-width="30%" >
            <el-form-item label="项目名称：">
                <el-input v-model="projectInfo.project_name" style="width: 70%"></el-input>
            </el-form-item>
            <el-form-item label="项目路径：">
                <el-input v-model="projectInfo.project_path" style="width: 70%"></el-input>
            </el-form-item>
            <el-form-item label="包路径：" >
                <el-input v-model="projectInfo.package_path" style="width: 70%"></el-input>
            </el-form-item>
            <el-form-item label="端口：" >
                <el-input v-model="projectInfo.project_port" style="width: 70%"></el-input>
            </el-form-item>
            <el-form-item label="git账户：" >
                <el-select v-model="projectInfo.git" placeholder="请选择git账户" style="width: 70%">
                    <el-option v-for="item in gitInfoList" :key="parseInt(item.git_id)" :label="item.git_name" :value="parseInt(item.git_id)"> </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="github_url：" >
                <el-input v-model="projectInfo.github_url" style="width: 70%" placeholder="注意: git地址只能支持http协议，ssh协议暂不支持"></el-input>
            </el-form-item>
            <el-form-item label="maven包获取路径：" >
                <el-input v-model="projectInfo.maven_path" style="width: 70%"></el-input>
            </el-form-item>
            <el-form-item label="类型：">
                <el-select v-model="projectInfo.project_type" placeholder="请选择类型" style="width: 70%">
                    <el-option v-for="(key, value) in type" :key="parseInt(value)" :label="key" :value="parseInt(value)"> </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="项目备注：">
                <el-input type="textarea" v-model="projectInfo.remarks" :rows="4" style="width: 70%"></el-input>
            </el-form-item>
        </el-form>

        <div slot="footer" class="dialog-footer" align="center">
            <el-button type="primary" @click="dialogAddProjectInfoVisible = false" @click.native.prevent="addProjectInfo()">确 定</el-button>
            <el-button @click="dialogAddProjectInfoVisible = false" @click.native.prevent="">取 消</el-button>
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
                'projectName': ''
            },
            type: {
                1: '维金',
                2: '自研'
            },
            typeColor: {
                1: '',
                2: 'success',
            },
            projectInfoList: [],
            projectInfo: {},
            gitInfoList: [],
            dialogProjectInfoVisible: false,
            dialogUpdProjectInfoVisible: false,
            dialogAddProjectInfoVisible: false
        }
    },
    mounted () {
        this.getProjectInfoList()
        this.getGitNameFromGitInfo()
    },
    methods: {
        // pages分页信息初始化
        pageInitialization(){
            this.pages['page'] = 1
            this.pages['projectName'] = ''
        },
        // 查询分页数初始化
        selectFromProjectInfoList(){
            this.pages['page'] = 1
            this.getProjectInfoList()
        },
        // 分页绑定事件
        handleCurrentChange (page) {
            let self=this;
            self.pages['page'] = page;
            this.getProjectInfoList()
        },
        // 获取分页列表信息API
        getProjectInfoList(){
            let self=this
            Axios.get('/api/projectInfo/getAllFromProjectInfoByPage?page=' + this.pages['page']+"&projectName="+this.pages['projectName'])
            .then(function(response) {
                if ( response.code == 200 ) {
                    self.projectInfoList = response.data.projectInfoList;
                    self.pages['page'] = response.data.page;
                    self.pages['numPages'] = response.data.numPages;
                }
                else{
                    self.$message.error(response.message);
                }
                
            });
        },
        // 获取指定项目详情，以及项目配置信息
        getProjectInfo(projectId){
            let self=this
            Axios.get('/api/projectInfo/getAllFromProjectInfoByProjectId?projectId=' + projectId)
            .then(function(response) {
                if ( response.code == 200 ) {
                    self.projectInfo = response.data.projectInfo;
                }
                else{
                    self.$message.error(response.message);
                }
                
            });
        },
        //更新指定项目信息
        updProjectInfoByProjectId(){
            let self=this
            Axios.get('/api/projectInfo/updFromProjectInfoByProjectId', {
                params: {
                    projectId: self.projectInfo.project_id,
                    projectName: self.projectInfo.project_name,
                    projectPath: self.projectInfo.project_path,
                    packagePath: self.projectInfo.package_path,
                    projectPort: self.projectInfo.project_port,
                    projectType: self.projectInfo.project_type,
                    githubUrl: self.projectInfo.github_url,
                    gitId: self.projectInfo.git,
                    mavenPath: self.projectInfo.maven_path,
                    remarks: self.projectInfo.remarks
                }
            })
            .then(function(response) {
                if ( response.code == 200 ) {
                    self.getProjectInfoList()
                    self.$message({
                        type: 'success',
                        message: response.message
                    });
                }
                else{
                    self.$message.error(response.message);
                }
            });
        },
        //添加项目信息
        addProjectInfo(){
            let self=this
            Axios.get('/api/projectInfo/setFromProjectInfo', {
                params: {
                    projectName: self.projectInfo.project_name,
                    projectPath: self.projectInfo.project_path,
                    packagePath: self.projectInfo.package_path,
                    projectPort: self.projectInfo.project_port,
                    projectType: self.projectInfo.project_type,
                    githubUrl: self.projectInfo.github_url,
                    gitId: self.projectInfo.git,
                    mavenPath: self.projectInfo.maven_path,
                    remarks: self.projectInfo.remarks
                }
            })
            .then(function(response) {
                if ( response.code == 200 ) {
                    self.getProjectInfoList()
                    self.$message({
                        type: 'success',
                        message: response.message
                    });
                }
                else{
                    self.$message.error(response.message);
                }
            });
        },
        // 删除项目
        delProjectInfoByProjectId(projectId){
            this.$confirm('删除项目，包含次项目得主机也会更新, 是否继续?', '提示', {
                cancelButtonText: '取消',
                confirmButtonText: '确定',
                type: 'warning',
                center: true
            }).then(() => {
                let self=this
                Axios.get('/api/projectInfo/delFromProjectInfoByProjectId?projectId='+projectId)
                .then(function(response) {
                    if (response.code == 200) {
                        self.getProjectInfoList()
                        self.$message({
                            type: 'success',
                            message: '项目删除成功!'
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
        loadAddProjectInfo(){
            this.projectInfo = {}
        },
        //获取git下拉框数据
        getGitNameFromGitInfo(){
            let self=this
            Axios.get('/api/gitInfo/getGitNameFromGitInfo',)
            .then(function (response) {
                if ( response.code == 200 ) {
                    self.gitInfoList = response.data.gitInfoList
                }
                else{
                    self.$message.error(response.message);
                }
            })
            .catch(function (errer) {
                self.$message.error(errer);
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
    .el-row {
        border-bottom: 1px solid #efefef;
        line-height: 50px;
    }
    .box-card {
        width: 100%;
    }
</style>