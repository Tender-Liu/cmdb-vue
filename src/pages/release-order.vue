<template>
    <div class="page-body">
        <div class="page-header">
            <h1 class="page-title">发布管理</h1>
            <el-breadcrumb>
                <el-breadcrumb-item :to="{path: '/'}">首页</el-breadcrumb-item>
                <el-breadcrumb-item >工单管理</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="box">
            <div class="demo-input-suffix searchn-avigation">
                工单名：
                <el-input placeholder="工单名" v-model=pages.orderTitle style="width: 20%"></el-input>
                <el-button type="primary" @click.native.prevent="getListFromReleaseOrderByPage()">查询</el-button>
                <el-button type="success" style="float: right; margin-right: 20px;"
                     @click="dialogAddOrderInfoVisible=true" @click.native.prevent="releaseOrder={}">添加工单</el-button>
            </div>

            <!--页面工单信息，表格数据-->
            <el-table :data="releaseOrderList" border style="width: 100%">
                <el-table-column prop="order_id" label="工单号" align="center" width="100"></el-table-column>
                <el-table-column prop="order_title" label="工单标题" align="center"></el-table-column>
                <el-table-column prop="order_content" label="工单内容"  align="center"></el-table-column>
                <el-table-column prop="authorizer" label="授权状态" align="center" width="120">
                    <template slot-scope="scope">
                        <el-button :type=Object.values(orderAuth[scope.row.authorizer])[0] size="small"> {{ Object.keys(orderAuth[scope.row.authorizer])[0] }} </el-button>
                    </template>
                </el-table-column>
                <el-table-column prop="status" label="工单状态"  align="center" width="120">
                    <template slot-scope="scope">
                         <m-button :type=Object.values(orderStatus[scope.row.status])[0] size="small">{{ Object.keys(orderStatus[scope.row.status])[0] }}</m-button>
                    </template>
                </el-table-column>
                <el-table-column prop="release_time" label="发布时间"  align="center" width="160"></el-table-column>
                <el-table-column label="操作" width="220" align="center"> 
                    <template slot-scope="scope">
                        <el-button type="success" size="small" @click="dialogOrderInfoVisible=true"
                            @click.native.prevent="getAllFromReleaseOrderByOrderId(releaseOrderList[scope.$index]['order_id'])">查看</el-button>
                        <el-button type="primary" size="small" @click="dialogEditOrderInfoVisible=true"
                            @click.native.prevent="getAllFromReleaseOrderByOrderId(releaseOrderList[scope.$index]['order_id'])">修改</el-button>
                        <el-button type="success" icon="el-icon-menu" circle=true size="small"></el-button>
                    </template>
                </el-table-column>
            </el-table>
            <br/>
            <!-- 分页 -->
            <el-pagination :page-size="5" :page-count="pages.numPages" :current-page="pages.page" layout="prev, pager, next"
             @current-change="handleCurrentChange"></el-pagination>
        </div>

        <!-- 工单详情页面 -->
        <el-dialog :visible.sync="dialogOrderInfoVisible" width="80%" align="center">
            <el-row :gutter="20" style="margin-bottom: 10px; padding-bottom: 10px">
                <el-col :span="12">
                    <el-card class="box-card">
                    <div slot="header" align="center">
                        <span style="font-size: 16px"><i class="el-icon-setting"></i>工单详情</span>
                    </div>
                    <el-row :gutter="20" class="el-row">
                        <el-col :span="8" align="right" style="color:#3399FF"><div>工单号:</div></el-col>
                        <el-col :span="16" align="center"><div>{{ releaseOrder.order_id }}</div></el-col>
                    </el-row>
                    <el-row :gutter="20" class="el-row">
                        <el-col :span="8" align="right" style="color:#3399FF"><div>工单标题:</div></el-col>
                        <el-col :span="16" align="center"><div>{{ releaseOrder.order_title }}</div></el-col>
                    </el-row>
                    <el-row :gutter="20" class="el-row">
                        <el-col :span="8" align="right" style="color:#3399FF"><div>工单状态:</div></el-col>
                        <el-col :span="16" align="center">
                            <template v-if="releaseOrder.status !==  undefined ">
                            <div>
                                <m-button :type=Object.values(orderStatus[releaseOrder.status])[0] size="small">{{ Object.keys(orderStatus[releaseOrder.status])[0] }}</m-button>
                            </div>
                            </template>
                        </el-col>
                    </el-row>
                    <el-row :gutter="20" class="el-row">
                        <el-col :span="8" align="right" style="color:#3399FF"><div>创建人:</div></el-col>
                        <el-col :span="16" align="center"><div>{{ releaseOrder.author__user_name }}</div></el-col>
                    </el-row>
                    <el-row :gutter="20" class="el-row">
                        <el-col :span="8" align="right" style="color:#3399FF"><div>发布人:</div></el-col>
                        <el-col :span="16" align="center"><div>{{ releaseOrder.executor__user_name }}</div></el-col>
                    </el-row>
                    <el-row :gutter="20" class="el-row">
                        <el-col :span="8" align="right" style="color:#3399FF"><div>ftp目录:</div></el-col>
                        <el-col :span="16" align="center"><div>{{ releaseOrder.ftp_path }}</div></el-col>
                    </el-row>
                    <el-row :gutter="20" class="el-row">
                        <el-col :span="8" align="right" style="color:#3399FF"><div>发布环境:</div></el-col>
                        <el-col :span="16" align="center"><div><el-tag>{{ releaseOrder.ambient__ambient_name }}</el-tag></div></el-col>
                    </el-row>
                    <el-row :gutter="20" class="el-row">
                        <el-col :span="8" align="right" style="color:#3399FF"><div>发布时间:</div></el-col>
                        <el-col :span="16" align="center"><div>{{ releaseOrder.release_time }}</div></el-col>
                    </el-row>
                    <el-row :gutter="20" class="el-row">
                        <el-col :span="8" align="right" style="color:#3399FF"><div>发布内容:</div></el-col>
                        <el-col :span="16" align="center"><div>{{ releaseOrder.order_content }}</div></el-col>
                    </el-row>
                    <el-row :gutter="20" class="el-row">
                        <el-col :span="8" align="right" style="color:#3399FF"><div>备注:</div></el-col>
                        <el-col :span="16" align="center"><div>{{ releaseOrder.remarks }}</div></el-col>
                    </el-row>
                    </el-card>
                </el-col>
                <el-col :span="12">
                    <el-card class="box-card">
                    <div slot="header" align="center">
                        <span style="font-size: 16px"><i class="el-icon-setting"></i>授权进度详情</span>
                    </div>
                    <el-row :gutter="20" class="el-row">
                        <el-col :span="8" align="right" style="color:#3399FF"><div>工单授权状态:</div></el-col>
                        <el-col :span="16" align="center">
                            <template v-if="releaseOrder.authorizer !==  undefined ">
                            <div>
                                <el-button :type=Object.values(orderAuth[releaseOrder.authorizer])[0] size="small"> {{ Object.keys(orderAuth[releaseOrder.authorizer])[0] }} </el-button>
                            </div>
                            </template>
                        </el-col>
                    </el-row>
                    <el-row :gutter="20" class="el-row">
                        <el-col :span="8" align="right" style="color:#3399FF"><div>技术审核人:</div></el-col>
                        <el-col :span="16" align="center"><div>{{ releaseOrder.artisan__user_name }}</div></el-col>
                    </el-row>
                    <el-row :gutter="20" class="el-row">
                        <el-col :span="8" align="right" style="color:#3399FF"><div>技术授权:</div></el-col>
                        <el-col :span="16" align="center">
                            <template v-if="releaseOrder.authorizerList !==  undefined ">
                            <div>
                                <el-button :type=Object.values(authorizer[releaseOrder.authorizerList.artisan])[0] size="small"> {{ Object.keys(authorizer[releaseOrder.authorizerList.artisan])[0] }} </el-button>
                            </div>
                            </template>
                        </el-col>
                    </el-row>
                    <el-row :gutter="20" class="el-row">
                        <el-col :span="8" align="right" style="color:#3399FF"><div>产品审核人:</div></el-col>
                        <el-col :span="16" align="center"><div>{{ releaseOrder.product__user_name }}</div></el-col>
                    </el-row>
                    <el-row :gutter="20" class="el-row">
                        <el-col :span="8" align="right" style="color:#3399FF"><div>产品授权:</div></el-col>
                        <el-col :span="16" align="center">
                            <template v-if="releaseOrder.authorizerList !==  undefined ">
                            <div>
                                <el-button :type=Object.values(authorizer[releaseOrder.authorizerList.product])[0] size="small"> {{ Object.keys(authorizer[releaseOrder.authorizerList.product])[0] }} </el-button>
                            </div>
                            </template>
                        </el-col>
                    </el-row>
                    <el-row :gutter="20" class="el-row">
                        <el-col :span="8" align="right" style="color:#3399FF"><div>更新时间:</div></el-col>
                        <el-col :span="16" align="center"><div>{{ releaseOrder.update_time }}</div></el-col>
                    </el-row>
                    </el-card>
                </el-col>
            </el-row>
            
            <div slot="footer" class="dialog-footer" align="center" >
                <el-button @click="dialogOrderInfoVisible = false">退 出</el-button>
            </div>
        </el-dialog>

        <!-- 添加工单 -->
        <el-dialog title="添加新工单" :visible.sync="dialogAddOrderInfoVisible" width="60%">
            <el-form  ref="releaseOrder" :model="releaseOrder" label-width="30%" >
                <el-form-item label="工单标题：">
                    <el-input v-model="releaseOrder.order_title" style="width: 70%"></el-input>
                </el-form-item>
                <el-form-item label="发布环境：" >
                    <el-select v-model="releaseOrder.ambient_id" placeholder="请选择环境" style="width: 70%">
                        <el-option v-for="item in ambientList" :key="parseInt(item.id)" :label="item.ambient_name" :value="parseInt(item.id)"> </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="运维发布人：" >
                    <el-select v-model="releaseOrder.executor_id" placeholder="请选择发布人员" style="width: 70%">
                        <el-option v-for="item in executorList" :key="parseInt(item.user_id)" :label="item.user_name" :value="parseInt(item.user_id)"> </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="技术审核人：" >
                    <el-select v-model="releaseOrder.artisan_id" placeholder="请选择审核人员" style="width: 70%">
                        <el-option v-for="item in artisanList" :key="parseInt(item.user_id)" :label="item.user_name" :value="parseInt(item.user_id)"> </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="产品审核人：" >
                    <el-select v-model="releaseOrder.product_id" placeholder="请选择审核人员" style="width: 70%">
                        <el-option v-for="item in productList" :key="parseInt(item.user_id)" :label="item.user_name" :value="parseInt(item.user_id)"> </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="ftp路径">
                    <el-input v-model="releaseOrder.ftp_path" style="width: 70%"></el-input>
                </el-form-item>
                <el-form-item label="发布时间：">
                    <el-date-picker v-model="releaseOrder.release_time" type="datetime" placeholder="选择发布日期" style="width: 70%"></el-date-picker>
                </el-form-item>
                <el-form-item label="发布内容：">
                    <el-input type="textarea" v-model="releaseOrder.order_content" :rows="4" style="width: 70%"></el-input>
                </el-form-item>
                <el-form-item label="备注：">
                    <el-input type="textarea" v-model="releaseOrder.remarks" :rows="4" style="width: 70%"></el-input>
                </el-form-item>
            </el-form>

            <div slot="footer" class="dialog-footer" align="center">
                <el-button type="primary" @click="dialogAddOrderInfoVisible = false" @click.native.prevent="addFromReleaseOrader()">确 定</el-button>
                <el-button @click="dialogAddOrderInfoVisible = false">取 消</el-button>
            </div>
        </el-dialog>

        <!-- 修改工单信息 -->
        <el-dialog title="修改工单信息" :visible.sync="dialogEditOrderInfoVisible" width="60%">
            <el-form  ref="releaseOrder" :model="releaseOrder" label-width="30%" >
                <el-form-item label="工单ID：">
                    <el-input v-model="releaseOrder.order_id" style="width: 70%" disabled></el-input>
                </el-form-item>
                <el-form-item label="工单标题：">
                    <el-input v-model="releaseOrder.order_title" style="width: 70%"></el-input>
                </el-form-item>
                <el-form-item label="发布环境：" >
                    <el-select v-model="releaseOrder.ambient_id" placeholder="请选择环境" style="width: 70%">
                        <el-option v-for="item in ambientList" :key="parseInt(item.id)" :label="item.ambient_name" :value="parseInt(item.id)"> </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="运维发布人：" >
                    <el-select v-model="releaseOrder.executor_id" placeholder="请选择发布人员" style="width: 70%">
                        <el-option v-for="item in executorList" :key="parseInt(item.user_id)" :label="item.user_name" :value="parseInt(item.user_id)"> </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="技术审核人：" >
                    <el-select v-model="releaseOrder.artisan_id" placeholder="请选择审核人员" style="width: 70%">
                        <el-option v-for="item in artisanList" :key="parseInt(item.user_id)" :label="item.user_name" :value="parseInt(item.user_id)"> </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="产品审核人：" >
                    <el-select v-model="releaseOrder.product_id" placeholder="请选择审核人员" style="width: 70%">
                        <el-option v-for="item in productList" :key="parseInt(item.user_id)" :label="item.user_name" :value="parseInt(item.user_id)"> </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="ftp路径">
                    <el-input v-model="releaseOrder.ftp_path" style="width: 70%"></el-input>
                </el-form-item>
                <el-form-item label="发布时间：">
                    <el-date-picker v-model="releaseOrder.release_time" type="datetime" placeholder="选择发布日期" style="width: 70%"></el-date-picker>
                </el-form-item>
                <el-form-item label="发布内容：">
                    <el-input type="textarea" v-model="releaseOrder.order_content" :rows="4" style="width: 70%"></el-input>
                </el-form-item>
                <el-form-item label="备注：">
                    <el-input type="textarea" v-model="releaseOrder.remarks" :rows="4" style="width: 70%"></el-input>
                </el-form-item>
            </el-form>

            <div slot="footer" class="dialog-footer" align="center">
                <el-button type="primary" @click="dialogEditOrderInfoVisible = false" @click.native.prevent="editReleaseOrderByOrderId()">确 定</el-button>
                <el-button @click="dialogEditOrderInfoVisible = false">取 消</el-button>
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
                'orderTitle': '',
                'status': ''
            },
            releaseOrderList: [],
            releaseOrder: {},
            //授权与工单文字描述与色彩渲染，固定格式，不能修改--start
            orderStatus: [{"新工单":"default"}, {"等待":"primary"}, {"暂停":"warning"}, {"运行中":"info"}, {"已完成":"success"}, {"失败":"danger"}],
            orderAuth:{ "-1":{"授权失败":"danger"}, "1": {"审核中":"primary"}, "2":{"授权中":"warning"}, "3":{"授权通过":"success"} },
            authorizer:{ "-1":{"审核失败":"danger"}, "1":{"申请中":"primary"}, "2":{"授权通过":"success"} },
            //--end
            dialogOrderInfoVisible: false,
            dialogAddOrderInfoVisible: false,
            dialogEditOrderInfoVisible: false,
            artisanList: [], //技术经理列表
            productList: [], //产品经理列表
            executorList: [], //发布人员列表
            ambientList: [], //环境列表


            
        }
    },
    mounted () {
        this.getListFromReleaseOrderByPage();
        this.loadAddReleaseOrder()
    },
    methods: {
        //分页绑定事件
        handleCurrentChange (val) {
            this.pages.page = val;
            this.getListFromReleaseOrderByPage()
        },
        //分页查询--获取表格数据
        getListFromReleaseOrderByPage(){
            let self = this
            Axios.get('/api/releaseOrder/getListFromReleaseOrderByPage', {
                params: {
                    page: self.pages.page,
                    orderTitle: self.pages.orderTitle,
                    status: self.pages.status
                }
            }).then(function (response) {
                if ( response.code == 200 ) {
                    self.releaseOrderList = response.data.releaseOrderList
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
        //查看指定工单信息
        getAllFromReleaseOrderByOrderId(orderId){
            let self = this
            Axios.get('/api/releaseOrder/getAllFromReleaseOrderByOrderId', {
                params: {
                    orderId: orderId
                }
            }).then(function (response) {
                if ( response.code == 200 ) {
                    self.releaseOrder = response.data.releaseOrder
                }else{
                    self.$message.error(response.message);
                }
            })
            .catch(function (errer) {
                self.$message.error(errer);
            });
        },
        //加载添加工单数据默认值 授权人列表，环境列表
        loadAddReleaseOrder(){
            let self = this
            Axios.get('/api/userInfo/getAllUserInfo', {
                params: {
                    groupId: 1
                }
            }).then(function (response) {
                if ( response.code == 200 ) {
                    self.executorList = response.data
                }else{
                    self.$message.error(response.message);
                }
            })
            .catch(function (errer) {
                self.$message.error(errer);
            });
            Axios.get('/api/userInfo/getAllUserInfo', {
                params: {
                    groupId: 2
                }
            }).then(function (response) {
                if ( response.code == 200 ) {
                    self.artisanList = response.data
                }else{
                    self.$message.error(response.message);
                }
            })
            .catch(function (errer) {
                self.$message.error(errer);
            });
            Axios.get('/api/userInfo/getAllUserInfo', {
                params: {
                    groupId: 3
                }
            }).then(function (response) {
                if ( response.code == 200 ) {
                    self.productList = response.data
                }else{
                    self.$message.error(response.message);
                }
            })
            .catch(function (errer) {
                self.$message.error(errer);
            });
            Axios.get('/api/ambient/getAllFromAmbient',)
            .then(function (response) {
                if ( response.code == 200 ) {
                    self.ambientList = response.data.ambientList
                }else{
                    self.$message.error(response.message);
                }
            })
            .catch(function (errer) {
                self.$message.error(errer);
            });
            
        },
        //添加工单信息
        addFromReleaseOrader(){
            let self = this
            Axios.get('/api/releaseOrder/setFromReleaseOrder', {
                params: {
                    orderTitle: self.releaseOrder.order_title,
                    orderContent: self.releaseOrder.order_content,
                    releaseTime: self.releaseOrder.release_time,
                    executorId: self.releaseOrder.executor_id,
                    ambientId: self.releaseOrder.ambient_id,
                    artisanId: self.releaseOrder.artisan_id,
                    productId: self.releaseOrder.product_id,
                    remarks: self.releaseOrder.remarks,
                    ftpPath: self.releaseOrder.ftp_path
                }
            }).then(function (response) {
                if ( response.code == 200 ) {
                    self.$message({ type: 'success', message: response.message });
                    self.getListFromReleaseOrderByPage()
                }else{
                    self.$message.error(response.message);
                }
            })
        },
        //修改工单信息
        editReleaseOrderByOrderId(){
            let self = this
            Axios.get('/api/releaseOrder/updContentFromReleaseOrdeByOrderId', {
                params: {
                    orderId: self.releaseOrder.order_id,
                    orderTitle: self.releaseOrder.order_title,
                    orderContent: self.releaseOrder.order_content,
                    releaseTime: self.releaseOrder.release_time,
                    executorId: self.releaseOrder.executor_id,
                    ambientId: self.releaseOrder.ambient_id,
                    artisanId: self.releaseOrder.artisan_id,
                    productId: self.releaseOrder.product_id,
                    remarks: self.releaseOrder.remarks,
                    ftpPath: self.releaseOrder.ftp_path
                }
            }).then(function (response) {
                if ( response.code == 200 ) {
                    self.$message({ type: 'success', message: response.message });
                    self.getListFromReleaseOrderByPage()
                }else{
                    self.$message.error(response.message);
                }
            })
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