<template>
    <div class="page-body">
        <div class="page-header">
            <h1 class="page-title">资产管理</h1>
            <el-breadcrumb>
                <el-breadcrumb-item :to="{path: '/'}">首页</el-breadcrumb-item>
                <el-breadcrumb-item >环境管理</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="box">

            <div class="demo-input-suffix searchn-avigation">
                环境名：
                <el-input  placeholder="环境名" v-model="pages.ambientName" style="width: 20%"></el-input>
                <el-button type="primary" @click.native.prevent="selectFromAmbientList()">查询</el-button>
                <el-button type="success" @click.native.prevent="loadAddAmbientInfoLoad()"
                        @click="dialogAddAmbientInfoVisible=true" style="float: right; margin-right: 20px;">添加环境</el-button>
            </div>
            
            <el-table :data="ambientList" border style="width: 100%" >
                <el-table-column prop="id" label="id" align="center"></el-table-column>
                <el-table-column prop="ambient_name" label="环境名" align="center"></el-table-column>
                <el-table-column prop="remarks" label="备注"  align="center"></el-table-column>
                <el-table-column prop="created_time" label="创建时间"  align="center"></el-table-column>
                <el-table-column label="操作" width="250" align="center">
                    <template slot-scope="scope">
                    <el-button type="primary" size="small" @click.native.prevent="loadUpdAmbientInfoLoad(scope.$index)"
                        @click="dialogUpdAmbientInfoVisible=true">修改</el-button>
                    <el-button type="warning" size="small" @click.native.prevent="delAmbientInfo(scope.$index)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <br/>
            <el-pagination :page-size="5" :page-count="pages.numPages" :current-page="pages.page" layout="prev, pager, next"
             @current-change="handleCurrentChange"></el-pagination>
        </div>
        
        <el-dialog title="修改环境" :visible.sync="dialogUpdAmbientInfoVisible">
            <el-form ref="ambientInfo" :model="ambientInfo" label-width="120px">
                <el-form-item label="环境ID">
                    <el-input v-model="ambientInfo.id" disabled style="width: 60%"></el-input>
                </el-form-item>
                <el-form-item label="环境名">
                    <el-input v-model="ambientInfo.ambient_name"  style="width: 60%"></el-input>
                </el-form-item>
                <el-form-item label="备注">
                    <el-input type="textarea" v-model="ambientInfo.remarks" :rows="3" style="width: 60%"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="dialogUpdAmbientInfoVisible = false"
                    @click.native.prevent="updAmbientInfoLoad()">确 定</el-button>
                <el-button @click="dialogUpdAmbientInfoVisible = false">取 消</el-button>
            </div>
        </el-dialog>

        <el-dialog title="添加环境" :visible.sync="dialogAddAmbientInfoVisible">
            <el-form ref="ambientInfo" :model="ambientInfo" label-width="120px">
                <el-form-item label="环境名">
                    <el-input v-model="ambientInfo.ambient_name"  style="width: 60%"></el-input>
                </el-form-item>
                <el-form-item label="备注">
                    <el-input type="textarea" v-model="ambientInfo.remarks" :rows="3" style="width: 60%"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="dialogAddAmbientInfoVisible = false"
                    @click.native.prevent="addAmbientInfoLoad()">确 定</el-button>
                <el-button @click="dialogAddAmbientInfoVisible = false">取 消</el-button>
            </div>
        </el-dialog>

    </div>
</template>

<script>
import Axios from 'axios'
export default {
    data () {
        return {
            ambientList: [],
            ambientInfo: {},
            dialogUpdAmbientInfoVisible: false,
            dialogAddAmbientInfoVisible: false,
            pages: {
                'page': 1,
                'numPages': 1,
                'ambientName': ''
            }
        }
    },
    mounted () {
        let self=this
        Axios.get('/api/ambient/getAllFromAmbientByPage?page=1')
            .then(function(response) {
            self.ambientList = response.data.ambientList;
            self.pages['page'] = response.data.page;
            self.pages['numPages'] = response.data.numPages;
        });
    },
    methods: {
        pageInitialization(){
            this.pages['page'] = 1
            this.pages['vlanName'] = ''
        },
        selectFromAmbientList(){
            this.pages['page'] = 1
            this.getAllAmbientList()
        },
        getAllAmbientList(){
            let self=this
            Axios.get('/api/ambient/getAllFromAmbientByPage?page='+ this.pages['page']+"&ambientName="+this.pages['ambientName'])
            .then(function(response) {
                self.ambientList = response.data['ambientList'];
                self.pages['page'] = response.data.page;
                self.pages['numPages'] = response.data.numPages;
            });
        },
        handleCurrentChange (page) {
            let self=this;
            self.pages['page'] = page;
            this.getAllAmbientList()
        },
        loadUpdAmbientInfoLoad(index){
            let self=this
            Axios.get('/api/ambient/getAllFromAmbientById?id='+this.ambientList[index]['id'])
                .then(function(response) {
                    if(response.code){
                        self.ambientInfo = response.data.ambient
                    }
                    else{
                        self.vlanInfo = []
                    }
            });
        },
        updAmbientInfoLoad(){
            let self=this
            Axios.get('/api/ambient/updAllFromAmbientById?id='+this.ambientInfo['id']+'&ambientName='+this.ambientInfo['ambient_name']+
                '&remarks='+this.ambientInfo['remarks'])
                .then(function(response) {
                    self.pageInitialization()
                    self.getAllAmbientList()
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
        loadAddAmbientInfoLoad(){
            this.ambientInfo = {
                'ambient_name': '',
                'remarks': ''
            }
        },
        addAmbientInfoLoad(){
            let self=this
            Axios.get('/api/ambient/setFromAmbient?ambientName='+this.ambientInfo['ambient_name']+'&remarks='+this.ambientInfo['remarks'])
                .then(function(response) {
                if (response.code == 200) {
                    self.pageInitialization()
                    self.getAllAmbientList()
                    self.$message({
                        type: 'success',
                        message: response.message
                    });
                }else{
                    self.$message.error(response.message);
                }
            });
        },
        delAmbientInfo(index){
            let self=this
            this.$confirm('确定是否要删除环境信息?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                Axios.get('/api/ambient/delFromAmbientById?id=' + self.ambientList[index]['id'])
                        .then(function(response) {
                            if (response.code == 200){
                                self.pageInitialization()
                                self.getAllAmbientList()
                                self.$message({
                                type: 'success',
                                message: response.message
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

