<template>
    <div class="page-body">
        <div class="page-header">
            <h1 class="page-title">资产管理</h1>
            <el-breadcrumb>
                <el-breadcrumb-item :to="{path: '/'}">首页</el-breadcrumb-item>
                <el-breadcrumb-item >服务器列表</el-breadcrumb-item>
            </el-breadcrumb>
        </div>

        <div class="box">

            <div class="demo-input-suffix searchn-avigation">
                主机名：
                <el-input  placeholder="主机名" style="width: 20%"></el-input>
                <el-button type="primary" >查询</el-button>
            </div>

            <el-table :data="hostInfoList" border style="width: 100%" v-loading="loading" element-loading-text="监控数据收集中..." element-loading-spinner="el-icon-loading">
                <el-table-column prop="host_id" label="主机ID" align="center"></el-table-column>
                <el-table-column prop="host_name" label="主机名" align="center"></el-table-column>
                <el-table-column prop="ip" label="IP地址" align="center"></el-table-column>
                <el-table-column prop="cpu_use" label="CPU使用率"  align="center">
                    <template slot-scope="scope">{{ scope.row.cpu_use.toString()==""?'None':( scope.row.cpu_use.toString() + '%') }}</template>
                </el-table-column>
                <el-table-column prop="mem_use" label="内存使用率"  align="center">
                    <template slot-scope="scope">{{ scope.row.mem_use.toString()==""?'None':((scope.row.mem_use*100).toFixed(2))+'%' }}</template>
                </el-table-column>
                <el-table-column prop="load5_use" label="系统负载"  align="center">
                    <template slot-scope="scope">{{ scope.row.load5_use.toString()==""?'None': scope.row.load5_use }}</template>
                </el-table-column>
                <el-table-column label="操作" width="150" align="center">
                    <template slot-scope="scope">
                    <el-button type="success" size="small" @click.native.prevent="installMonitor(scope.$index)">安装监控</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <br/>
            <el-pagination :page-size="5" :page-count="pages.numPages" :current-page="pages.page" layout="prev, pager, next"
             @current-change="handleCurrentChange"></el-pagination>
        </div>
    </div>
    
</template>

<script>
import Axios from 'axios'
export default {
    data () {
        return {
            hostInfoList: [],
            pages: {
                'page': 1,
                'numPages': 1,
                'hostName': ''
            },
            loading: false
        }
    },
    mounted () {
        let self=this
        this.loading = true
        Axios.get('/api/monitorInfo/getAllHostInfoByPage?page=1')
            .then(function(response) {
                self.loading = false
                if (response.code == 200) {
                    self.hostInfoList = response.data.hostInfoList;
                    self.pages['page'] = response.data.page;
                    self.pages['numPages'] = response.data.numPages;
                }else{
                    self.$message.error(response.message);
                }
        });

    },
    methods: {
        pageInitialization () {
            this.pages['page'] = 1
            this.pages['hostName'] = ''
        },
        selectFromHostList(){
            this.pages['page'] = 1
            this.getAllHostList()
        },
        getAllHostList(){
            let self=this
            this.loading = true
            Axios.get('/api/monitorInfo/getAllHostInfoByPage?page=' + this.pages['page'])
            .then(function(response) {
                self.loading = false
                if (response.code == 200) {
                    self.hostInfoList = response.data.hostInfoList;
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
            this.getAllHostList()
        },
        installMonitor(index){
            let self=this;
            console.log(this.hostInfoList[index]['ip'])
            if (this.hostInfoList[index]['ip'] == '' || this.hostInfoList[index]['ip'] == null){
                this.$message.error('IP为空，不能安装监控');
            }else{
                Axios.get('/api/monitorInfo/createHost?host_ip=' + this.hostInfoList[index]['ip'])
                .then(function(response) {
                    if (response.code == 200){
                        self.pageInitialization()
                        self.selectFromHostList()
                        self.$message({
                            showClose: true,
                            message: response.message,
                            type: 'success'
                        });
                    }else{
                         self.$message({
                            showClose: true,
                            message: response.message,
                            type: 'error'
                        });
                    }
                });
            }
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