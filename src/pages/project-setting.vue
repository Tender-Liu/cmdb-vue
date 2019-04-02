<template>
    <div class="page-body">
        <div class="page-header">
            <h1 class="page-title">资产管理</h1>
            <el-breadcrumb>
                <el-breadcrumb-item :to="{path: '/'}">首页</el-breadcrumb-item>
                <el-breadcrumb-item >项目配置列表</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="box">
            <!-- 查询搜索框 -->
            <div class="demo-input-suffix searchn-avigation">
                环境：
                <el-select v-model="pages.ambientId" placeholder="环境" style="width: 8%;margin-right: 10px;">
                    <el-option v-for="item in selectAmbientList" :key="item.id" :label="item.ambient_name" :value="item.id"> </el-option>
                </el-select>
                项目：
                <el-select v-model="pages.projectId" placeholder="项目" style="width: 8%;margin-right: 10px;">
                    <el-option v-for="item in selectProjectInfoList" :key="item.project_id" :label="item.project_name" :value="item.project_id"> </el-option>
                </el-select>
                文件名：
                <el-input v-model="pages.fileName" placeholder="文件名" style="width: 15%"></el-input>
                <el-button type="primary" @click.native.prevent="getProjectSettingList()">查询</el-button>
                <el-button type="success" style="float: right; margin-right: 20px;" @click="dialogAddProjectSettingVisible = true"
                    @click.native.prevent="loadAddFromProjectSetting()">添加配置</el-button>
            </div>
            
            <!-- 项目列表展示 -->
            <el-table :data="projectSettingList" border style="width: 100%," >
                <el-table-column prop="setting_id" label="配置ID" align="center" width="100"></el-table-column>
                <el-table-column prop="file_name" label="文件名" align="center"></el-table-column>
                <el-table-column prop="remote_path" label="文件路径" align="center"></el-table-column>
                <el-table-column prop="project__project_name" label="项目名" align="center" width="100"></el-table-column>
                <el-table-column prop="ambient__ambient_name" label="环境名" align="center" width="100"></el-table-column>
                <el-table-column prop="remarks" label="备注" align="center"></el-table-column>
                <el-table-column prop="update_time" label="更新时间"  align="center" width="160"></el-table-column>
                <el-table-column label="操作" width="250" align="center">
                    <template slot-scope="scope">
                        <el-button type="success" size="small" @click="dialogUpdProjectSettingVisible = true"
                            @click.native.prevent="loadFromProjectSettingBySettingId(projectSettingList[scope.$index]['setting_id'])">配置</el-button>
                        <el-button type="primary" size="small" @click="dialogEditProjectSettingVisible = true" 
                            @click.native.prevent="getContentFromProjectSettingByProjectId(projectSettingList[scope.$index]['setting_id'])">编辑</el-button>
                        <el-button type="warning" size="small" @click.native.prevent="delProjectSettingBySettingId(projectSettingList[scope.$index]['setting_id'])">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <br/>
            <!-- 分页 -->
            <el-pagination :page-size="5" :page-count="pages.numPages" :current-page="pages.page" layout="prev, pager, next"
             @current-change="handleCurrentChange"></el-pagination>

        </div>

        <!-- 项目文件内容详情 -->
        <el-dialog title="项目详情" :visible.sync="dialogEditProjectSettingVisible" align="center" width="60%">
            <div width="80%" style="font-family: 'Helvetica Neue'">
            <el-input type="textarea" :rows="15" placeholder="请输入配置文件内容......" v-model="content"> </el-input>
            </div>
            <div slot="footer" class="dialog-footer" align="center" >
                <el-button type="primary" @click="dialogEditProjectSettingVisible = true" @click.native.prevent="editFromProjectSettingByProjectId()">保 存</el-button>
                <el-button @click="dialogEditProjectSettingVisible = false" @click.native.prevent="">退 出</el-button>
            </div>
        </el-dialog>

        <!-- 添加项目配置文件 -->
        <el-dialog title="添加项目配置文件" :visible.sync="dialogAddProjectSettingVisible" width="60%">
            <el-form  ref="projectSetting" :model="projectSetting" label-width="30%" >
                <el-form-item label="文件名：">
                    <el-input v-model="projectSetting.file_name" style="width: 70%"></el-input>
                </el-form-item>
                <el-form-item label="文件路径：">
                    <el-input v-model="projectSetting.remote_path" style="width: 70%"></el-input>
                </el-form-item>
                <el-form-item label="项目：">
                    <el-select v-model="projectSetting.project_id" placeholder="请选择类型" style="width: 70%">
                        <el-option v-for="item in projectInfoList" :key="item.project_id" :label="item.project_name" :value="item.project_id"> </el-option>
                    </el-select>
                </el-form-item>
                
                <el-form-item label="环境：">
                    <el-select v-model="projectSetting.id" placeholder="请选择类型" style="width: 70%">
                        <el-option v-for="item in ambientList" :key="item.id" :label="item.ambient_name" :value="item.id"> </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="项目备注：">
                    <el-input type="textarea" v-model="projectSetting.remarks" :rows="4" style="width: 70%"></el-input>
                </el-form-item>
            </el-form>

            <div slot="footer" class="dialog-footer" align="center" >
                <el-button type="primary" @click="dialogAddProjectSettingVisible = false" @click.native.prevent="addFromProjectSettingByProjectIdAndAmbientId()">确 定</el-button>
                <el-button @click="dialogAddProjectSettingVisible = false">取 消</el-button>
            </div>
        </el-dialog>

        <!-- 修改配置文件信息 -->
        <el-dialog title="修改配置文件信息" :visible.sync="dialogUpdProjectSettingVisible" width="60%">
            <el-form  ref="projectSetting" :model="projectSetting" label-width="30%" >
                <el-form-item label="配置Id：">
                    <el-input v-model="projectSetting.setting_id" style="width: 70%" disabled></el-input>
                </el-form-item>
                <el-form-item label="文件名：">
                    <el-input v-model="projectSetting.file_name" style="width: 70%"></el-input>
                </el-form-item>
                <el-form-item label="文件路径：">
                    <el-input v-model="projectSetting.remote_path" style="width: 70%"></el-input>
                </el-form-item>
                <el-form-item label="项目：">
                    <el-select v-model="projectSetting.project" placeholder="请选择类型" style="width: 70%">
                        <el-option v-for="item in projectInfoList" :key="item.project_id" :label="item.project_name" :value="item.project_id"> </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="环境：">
                    <el-select v-model="projectSetting.ambient" placeholder="请选择类型" style="width: 70%">
                        <el-option v-for="item in ambientList" :key="parseInt(item.id)" :label="item.ambient_name" :value="parseInt(item.id)"> </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="更新时间：">
                    <el-input v-model="projectSetting.update_time" style="width: 70%" disabled></el-input>
                </el-form-item>
                <el-form-item label="项目备注：">
                    <el-input type="textarea" v-model="projectSetting.remarks" :rows="4" style="width: 70%"></el-input>
                </el-form-item>
            </el-form>

            <div slot="footer" class="dialog-footer" align="center" >
                <el-button type="primary" @click="dialogUpdProjectSettingVisible = false" @click.native.prevent="updFromProjectSettingBySettingId()">确 定</el-button>
                <el-button @click="dialogUpdProjectSettingVisible = false">取 消</el-button>
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
                'ambientId': '',
                'projectId': '',
                'fileName': ''
            },
            projectSettingList: [],
            projectSetting: {},
            ambientList: [],
            selectAmbientList: [],
            projectInfoList: [],
            selectProjectInfoList: [],
            dialogUpdProjectSettingVisible: false,
            dialogEditProjectSettingVisible: false,
            dialogAddProjectSettingVisible: false,
            content: ''
        }
    },
    mounted () {
        this.getAmbientList()
        this.getProjectInfoList()
        this.getProjectSettingList()
        this.loadAddFromProjectSetting()
    },
    methods: {
        // pages分页信息初始化
        pageInitialization(){
            this.pages['page'] = 1
            this.pages['projectId']= ''
            this.pages['ambientId']= ''
            this.pages['fileName'] = ''
        },
        // 查询分页数初始化
        selectFromProjectInfoList(){
            this.pages['page'] = 1
            this.getProjectSettingList()
        },
        // 分页绑定事件
        handleCurrentChange (page) {
            let self=this;
            self.pages['page'] = page;
            this.getProjectSettingList()
        },
        // 获取分页列表信息API
        getProjectSettingList(){
            let self=this
            Axios.get('/api/projectSetting/getAllFromProjectSettingByPage?page=' + this.pages['page']+"&projectId="+this.pages['projectId']
                +"&fileName="+this.pages['fileName']+"&ambientId="+this.pages['ambientId'])
            .then(function(response) {
                if ( response.code == 200 ) {
                    self.projectSettingList = response.data.projectSettingList;
                    self.pages['page'] = response.data.page;
                    self.pages['numPages'] = response.data.numPages;
                }
                else{
                    self.$message.error(response.message);
                }
                
            });
        },
        //获取所有项目名称
        getProjectInfoList(){
            let self=this
            Axios.get('/api/projectInfo/getProjectNameFromProjectInfo')
            .then(function(response) {
                if ( response.code == 200 ) {
                    self.selectProjectInfoList = response.data.projectInfoList;
                    self.selectProjectInfoList.splice(self.insertPos, 0, {project_id: '',project_name: '全部'})
                }
                else{
                    self.$message.error(response.message);
                }
            });
            Axios.get('/api/projectInfo/getProjectNameFromProjectInfo')
            .then(function(response) {
                if ( response.code == 200 ) {
                    self.projectInfoList = response.data.projectInfoList;
                }
                else{
                    self.$message.error(response.message);
                }
            });
        },
        //获取所有环境名
        getAmbientList(){
            let self=this
            Axios.get('/api/ambient/getAllFromAmbient')
            .then(function(response) {
                if ( response.code == 200 ) {
                    self.selectAmbientList = response.data.ambientList;
                    self.selectAmbientList.splice(self.insertPos, 0, {id: '',ambient_name: '全部'})
                }
                else{
                    self.$message.error(response.message);
                }
            });
            Axios.get('/api/ambient/getAllFromAmbient')
            .then(function(response) {
                if ( response.code == 200 ) {
                    self.ambientList = response.data.ambientList;
                }
                else{
                    self.$message.error(response.message);
                }
            });
        },
        //根据配置Id，获取文件内容
        getContentFromProjectSettingByProjectId(settingId){
            let self=this
            this.projectSetting.setting_id = settingId
            Axios.get('/api/projectSetting/getContentFromProjectSettingByProjectId', {
                params: {
                    settingId: settingId
                }
            })
            .then(function (response) {
                if ( response.code == 200 ) {
                    self.content = response.data.content
                }
                else{
                    self.$message.error(response.message);
                }
            })
            .catch(function (errer) {
                self.$message.error(errer);
            });
        },
        //添加配置信息
        addFromProjectSettingByProjectIdAndAmbientId(){
            let self=this
            Axios.get('/api/projectSetting/addFromProjectSettingByProjectIdAndAmbientId', {
                params: {
                    projectId: self.projectSetting.project_id,
                    ambientId: self.projectSetting.id,
                    fileName: self.projectSetting.file_name,
                    remotePath: self.projectSetting.remote_path,
                    remarks: self.projectSetting.remarks
                }
            })
            .then(function (response) {
                if ( response.code == 200 ) {
                    self.$message({ type: 'success', message: response.message });
                    self.getProjectSettingList()         
                }
                else{
                    self.$message.error(response.message);
                }
            })
            .catch(function (errer) {
                self.$message.error(errer);
            });
        },
        //添加配置，默认加载数据
        loadAddFromProjectSetting(){
            this.projectSetting = {}
        },
        //编辑文件内容
        editFromProjectSettingByProjectId(){
            let self=this
            Axios.get('/api/projectSetting/editFromProjectSettingByProjectId', {
                params: {
                    settingId: self.projectSetting.setting_id,
                    content: self.content
                }
            })
            .then(function (response) {
                if ( response.code == 200 ) {
                    self.$message({ type: 'success', message: response.message });          
                }
                else{
                    self.$message.error(response.message);
                }
            })
            .catch(function (errer) {
                self.$message.error(errer);
            });
        },
        //加载配置文件信息
        loadFromProjectSettingBySettingId(setting_id){
            let self=this
            Axios.get('/api/projectSetting/getAllFromProjectSettingByProjectId', {
                params: {
                    settingId: setting_id
                }
            })
            .then(function (response) {
                if ( response.code == 200 ) {
                    self.projectSetting = response.data.projectSetting     
                }else{
                    self.$message.error(response.message);
                }
            })
            .catch(function (errer) {
                self.$message.error(errer);
            });
        },
        //更新配置文件信息
        updFromProjectSettingBySettingId(){
            let self=this
            Axios.get('/api/projectSetting/updFromProjectSettingByProjectId', {
                params: {
                    settingId: self.projectSetting.setting_id,
                    projectId: self.projectSetting.project,
                    ambientId: self.projectSetting.ambient,
                    fileName: self.projectSetting.file_name,
                    remotePath: self.projectSetting.remote_path,
                    remarks: self.projectSetting.remarks
                }
            })
            .then(function (response) {
                if ( response.code == 200 ) {
                    self.$message({ type: 'success', message: response.message });
                    self.getProjectSettingList()
                }else{
                    self.$message.error(response.message);
                }
            })
            .catch(function (errer) {
                self.$message.error(errer);
            });
        },
        //删除指定配置文件
        delProjectSettingBySettingId(settingId){
            this.$confirm('是否确定删除配置文件?', '注意', {
                cancelButtonText: '取消',
                confirmButtonText: '确定',
                type: 'warning',
                center: true
            }).then(() => {
                let self=this
                Axios.get('/api/projectSetting/delFromProjectSettingByProjectId?settingId='+settingId)
                .then(function(response) {
                    if (response.code == 200) {
                        self.$message({
                            type: 'success',
                            message: '项目删除成功!'
                        });
                        self.getProjectSettingList()
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