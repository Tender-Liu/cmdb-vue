<template>
    <div class="page-body">
        <div class="page-header">
            <h1 class="page-title">资产管理</h1>
            <el-breadcrumb>
                <el-breadcrumb-item :to="{path: '/'}">首页</el-breadcrumb-item>
                <el-breadcrumb-item >vlan管理</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="box">

            <div class="demo-input-suffix searchn-avigation">
                VLAN名：
                <el-input  placeholder="vlan名" v-model="pages.vlanName" style="width: 20%"></el-input>
                <el-button type="primary" @click.native.prevent="selectFromVlanList()">查询</el-button>
                <el-button type="success" @click.native.prevent="loadAddVLanInfoLoad()"
                        @click="dialogAddVlanInfoVisible=true" style="float: right; margin-right: 20px;">添加VLAN</el-button>
            </div>

            <el-table :data="vlanList" border style="width: 100%," >
                <el-table-column prop="id" label="id" align="center"></el-table-column>
                <el-table-column prop="vlan_name" label="vlan名" align="center"></el-table-column>
                <el-table-column prop="gateway" label="网关" align="center"></el-table-column>
                <el-table-column prop="network" label="子网掩码"  align="center"></el-table-column>
                <el-table-column prop="created_time" label="创建时间"  align="center"></el-table-column>
                <el-table-column label="操作" width="250" align="center">
                    <template slot-scope="scope">
                    <el-button type="primary" size="small" @click.native.prevent="loadUpdVLanInfoLoad(scope.$index)"
                        @click="dialogUpdVlanInfoVisible=true">修改</el-button>
                    <el-button type="warning" size="small" @click.native.prevent="delVlanInfo(scope.$index)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <br/>
            <el-pagination :page-size="5" :page-count="pages.numPages" :current-page="pages.page" layout="prev, pager, next"
             @current-change="handleCurrentChange"></el-pagination>
        </div>

        <el-dialog title="修改vlan" :visible.sync="dialogUpdVlanInfoVisible">
            <el-form ref="vlanInfo" :model="vlanInfo" label-width="120px">
                <el-form-item label="vlanID">
                    <el-input v-model="vlanInfo.id" disabled style="width: 60%"></el-input>
                </el-form-item>
                <el-form-item label="vlan名">
                    <el-input v-model="vlanInfo.vlan_name"  style="width: 60%"></el-input>
                </el-form-item>
                <el-form-item label="网关">
                    <el-input v-model="vlanInfo.gateway"  style="width: 60%"></el-input>
                </el-form-item>
                <el-form-item label="子网掩码">
                    <el-input v-model="vlanInfo.network"  style="width: 60%"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="dialogUpdVlanInfoVisible = false"
                    @click.native.prevent="updVLanInfoLoad()">确 定</el-button>
                <el-button @click="dialogUpdVlanInfoVisible = false">取 消</el-button>
            </div>
        </el-dialog>

        <el-dialog title="添加vlan" :visible.sync="dialogAddVlanInfoVisible">
            <el-form ref="vlanInfo" :model="vlanInfo" label-width="120px">
                <el-form-item label="vlan名">
                    <el-input v-model="vlanInfo.vlan_name"  style="width: 60%"></el-input>
                </el-form-item>
                <el-form-item label="网关">
                    <el-input v-model="vlanInfo.gateway"  style="width: 60%"></el-input>
                </el-form-item>
                <el-form-item label="子网掩码">
                    <el-input v-model="vlanInfo.network"  style="width: 60%"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="dialogAddVlanInfoVisible = false"
                    @click.native.prevent="addVLanInfoLoad()">确 定</el-button>
                <el-button @click="dialogAddVlanInfoVisible = false">取 消</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
import Axios from 'axios'
export default {
    data () {
        return {
            vlanList: [],
            vlanInfo: {},
            dialogAddVlanInfoVisible: false,
            dialogUpdVlanInfoVisible: false,
            pages: {
                'page': 1,
                'numPages': 1,
                'vlanName': ''
            }
        }
    },
    mounted () {
        let self=this
        Axios.get('/api/vlan/getAllFromVlanByPage?page=1')
            .then(function(response) {
                self.vlanList = response.data.vlanList;
                self.pages['page'] = response.data.page;
                self.pages['numPages'] = response.data.numPages;
        });
    },
    methods: {
        pageInitialization(){
            this.pages['page'] = 1
            this.pages['vlanName'] = ''
        },
        selectFromVlanList(){
            this.pages['page'] = 1
            this.getAllVlanList()
        },
        getAllVlanList(){
            let self=this
            Axios.get('/api/vlan/getAllFromVlanByPage?page=' + this.pages['page']+"&vlanName="+this.pages['vlanName'])
            .then(function(response) {
                self.vlanList = response.data.vlanList;
                self.pages['page'] = response.data.page;
                self.pages['numPages'] = response.data.numPages;
            });
        },
        handleCurrentChange (page) {
            let self=this;
            self.pages['page'] = page;
            this.getAllVlanList()
        },
        delVlanInfo(index){
            let self=this
            this.$confirm('确定是否要删除本条Vlan信息?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                Axios.get('/api/vlan/delFromVlanById?id=' + self.vlanList[index]['id'])
                        .then(function(response) {
                            if (response.code == 200){
                                self.pageInitialization()
                                self.getAllVlanList()
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
        },
        loadUpdVLanInfoLoad(index){
            let self=this
            Axios.get('/api/vlan/getAllFromValnById?id='+this.vlanList[index]['id'])
                .then(function(response) {
                    if(response.code){
                        self.vlanInfo = response.data.vlan
                    }
                    else{
                        self.vlanInfo = []
                    }
            });
        },
        loadAddVLanInfoLoad(){
            this.vlanInfo = {
                'vlan_name' : '',
                'gateway': '',
                'network': ''
            }
        },
        updVLanInfoLoad(){
            let self=this
            Axios.get('/api/vlan/updAllFromVlanById?id='+this.vlanInfo['id']+'&vlanName='+this.vlanInfo['vlan_name']+
                '&gateway='+this.vlanInfo['gateway']+'&network='+this.vlanInfo['network'])
                .then(function(response) {
                    self.pageInitialization()
                    self.getAllVlanList()
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
        addVLanInfoLoad(){
            let self=this
            Axios.get('/api/vlan/setFromVlan?vlanName='+this.vlanInfo['vlan_name']+
                '&gateway='+this.vlanInfo['gateway']+'&network='+this.vlanInfo['network'])
                .then(function(response) {
                if (response.code == 200) {
                    self.pageInitialization()
                    self.getAllVlanList()
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

