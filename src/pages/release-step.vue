<template>
    <div class="page-body">
        <div class="page-header">
            <h1 class="page-title">发布管理</h1>
            <el-breadcrumb>
                <el-breadcrumb-item :to="{path: '/'}">首页</el-breadcrumb-item>
                <el-breadcrumb-item >步骤列表</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="box">
            <div class="demo-input-suffix searchn-avigation">
                步骤名：
                <el-input v-model="pages.stepName"  placeholder="步骤名" style="width: 20%"></el-input>
                <el-button type="primary" @click.native.prevent="">查询</el-button>
                <el-button type="success" style="float: right; margin-right: 20px;" @click.native.prevent="">添加步骤</el-button>
            </div>

            <el-table :data="stepInfoList" border style="width: 100%">
                <el-table-column type="expand" label="查看" width="80">
                    <template slot-scope="scope">
                        <div class="content" style="width: 100%">
                            <el-table :data="stepInfoList">
                                    <el-table-column prop="step_path" label="参数命令" align="center"></el-table-column>
                                    <el-table-column prop="remarks" label="参数解释"  align="center"></el-table-column>
                                </el-table>
                            <div v-html="scope.row.notice_content">
                            </div>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column prop="step_id" label="步骤ID" align="center" width="80"></el-table-column>
                <el-table-column prop="step_name" label="步骤名" align="center"></el-table-column>
                <el-table-column prop="step_path" label="脚本路径" align="center"></el-table-column>
                <el-table-column prop="remarks" label="功能介绍"  align="center"></el-table-column>
                <el-table-column prop="update_time" label="更新时间"  align="center" width="180"></el-table-column>
                <el-table-column label="操作" width="260" align="center">
                    <template slot-scope="scope">
                    <el-button type="primary" size="small" @click="" @click.native.prevent="">修改</el-button>
                    <el-button type="warning" size="small" @click="">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>

        </div>
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
                'stepName': ''
            },
            stepInfoList: [
                {
                    'step_id': 1,
                    'step_name': 'nginx操作脚本',
                    'remarks': '针对指定主机注释nginx后，检查配置后，加载nginx',
                    'step_path': 'script/nginx.py',
                    'update_time': '2018-10-10'
                }
            ],
            stepInfo: {}
        }
    },
    methods: {
        getRowKeys(row){
            return row.id
        },//获取当前页的信息
        toggleRowExpansion(row){
            this.expends=[];
            this.expends.push(row.id)//展开当前行的信息
        },
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