<template>
    <div class="page-body">
        <div class="page-header">
            <h1 class="page-title">我的任务</h1>
            <el-breadcrumb>
                <el-breadcrumb-item :to="{path: '/'}">首页</el-breadcrumb-item>
                <el-breadcrumb-item >我的任务</el-breadcrumb-item>
            </el-breadcrumb>
        </div>

        <div class="box">
            <div class="demo-input-suffix searchn-avigation">
                任务标题：
                <el-input  placeholder="任务标题" v-model="pages.taskName" style="width: 20%"></el-input>
                <el-button type="primary" @click.native.prevent="selectFromTaskList()">查询</el-button>
                <el-button type="info" size="medium"  @click.native="getPageInfo()" style="float: right; margin-right: 10px;">所有任务</el-button>
                <el-button type="warning" size="medium" @click.native="getPageInfo(1)" style="float: right; margin-right: 10px;">审核中</el-button>
                <el-button type="danger" size="medium" @click.native="getPageInfo(2)" style="float: right; margin-right: 10px;">审核未通过</el-button>
                <el-button type="primary" size="medium" @click.native="getPageInfo(3)" style="float: right; margin-right: 10px;">审核完成</el-button>
                <el-button type="success" size="medium" @click.native="getPageInfo(4)" style="float: right; margin-right: 10px;">已完成</el-button>
                <br/>
            </div>
            <el-table :data="taskList" border style="width: 100%">
                <el-table-column prop="task_id" label="taskId"  align="center"></el-table-column>
                <el-table-column prop="task_name" label="任务标题" width="200" align="center"></el-table-column>
                <el-table-column prop="task_state" label="任务状态"   align="center">
                    <template slot-scope="scope">
                        <el-tag :type=stateColor[scope.row.task_state]>{{state[scope.row.task_state]}}</el-tag>
                    </template>
                </el-table-column>
                <el-table-column prop="create__user_name" label="申请人"  align="center"></el-table-column>
                <el-table-column prop="execute__user_name" label="处理人"  align="center"></el-table-column>
                <el-table-column prop="authorizer__user_name" label="授权人"  align="center"></el-table-column>
                <el-table-column prop="created_date" label="创建时间" width="160" align="center"></el-table-column>
                <el-table-column prop="modify_date" label="完成时间" width="160" align="center"></el-table-column>
                <el-table-column label="操作" width="320" align="center">
                    <template slot-scope="scope">
                    <el-button type="success" size="mini" 
                        @click="dialogTableVisible=true" @click.native.prevent="showTaskInfo(scope.$index)">查看</el-button>
                    <el-button type="primary" size="mini"
                        @click="dialogFormVisible=true" @click.native.prevent="loadUpdTaskInfo(scope.$index)">修改</el-button>
                    <el-button type="danger" size="mini" 
                    @click="dialogAuthorizer=true" @click.native.prevent="loadUpdTaskInfo(scope.$index)">授权</el-button>
                    <el-button type="warning" size="mini" @click.native.prevent="UpdTaskListByStatus(scope.$index, 4)" >完成</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <br/>
            <el-pagination :page-size="5" :page-count="pages.numPages" :current-page="pages.page" layout="prev, pager, next" @current-change="handleCurrentChange"></el-pagination>
        </div>
        <el-dialog title="任务详情" :visible.sync="dialogTableVisible" width="90%" align="center">
            <el-row :gutter="20" class="el-row-roleinfo" style="background-color: #F2F6FC;">
                <el-col :span="2" style="font-weight: bold; font-size: 15px;"><div>taskID</div></el-col>
                <el-col :span="5" style="font-weight: bold; font-size: 15px;"><div>任务标题</div></el-col>
                <el-col :span="3" style="font-weight: bold; font-size: 15px;"><div>任务状态</div></el-col>
                <el-col :span="2" style="font-weight: bold; font-size: 15px;"><div>申请人</div></el-col>
                <el-col :span="2" style="font-weight: bold; font-size: 15px;"><div>处理人</div></el-col>
                <el-col :span="2" style="font-weight: bold; font-size: 15px;"><div>授权人</div></el-col>
                <el-col :span="4" style="font-weight: bold; font-size: 15px;"><div>创建时间</div></el-col>
                <el-col :span="4" style="font-weight: bold; font-size: 15px;"><div>完成时间</div></el-col>
            </el-row>
            <el-row :gutter="20" class="el-row-roleinfo">
                <el-col :span="2"><div >{{taskInfo['task_id']}}</div></el-col>
                <el-col :span="5"><div >{{taskInfo['task_name']}}</div></el-col>
                <el-col :span="3">
                    <div >
                    <el-tag :type=stateColor[taskInfo.task_state]>{{state[taskInfo['task_state']]}}</el-tag>
                    </div>
                </el-col>
                <el-col :span="2"><div >{{taskInfo['create__user_name']}}</div></el-col>
                <el-col :span="2"><div >{{taskInfo['execute__user_name']}}</div></el-col>
                <el-col :span="2"><div >{{taskInfo['authorizer__user_name']}}</div></el-col>
                <el-col :span="4"><div >{{taskInfo['created_date']}}</div></el-col>
                <el-col :span="4"><div >{{taskInfo['modify_date']}}</div></el-col>
            </el-row>
            <br>
            <el-collapse v-model="activeNames" align="left">
                    <el-collapse-item title="任务详情" name="1"><pre>{{ taskInfo.task_info }}</pre></el-collapse-item>
                    <el-collapse-item title="拒绝授权理由" name="2"><pre>{{ taskInfo.remarks }}</pre></el-collapse-item>
            </el-collapse>
            <br>
            <br>
            <el-steps :active="taskInfo.task_state" align-center finish-status="success">
                <el-step title="审核中"></el-step>
                <el-step title="审核未通过"></el-step>
                <el-step title="审核完成"></el-step>
                <el-step title="已完成"></el-step>
            </el-steps>
        </el-dialog>

        <el-dialog title="修改任务信息" :visible.sync="dialogFormVisible" width="50%" >
            <el-form :model="taskInfo" label-width="120px">
                <el-form-item label="任务标题"  >
                    <el-input v-model="taskInfo.task_name" disabled style="width: 60%"></el-input>
                </el-form-item>
                <el-form-item label="任务状态">
                    <el-select v-model="taskInfo.task_state" clearable placeholder="请选择" style="width: 60%" disabled>
                        <el-option v-for="item in options" :key="item.value" :value="item.value" :label="item.label"> </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="创建人">
                    <el-select v-model="taskInfo.create_id" placeholder="暂无创建人" disabled style="width: 60%">
                        <el-option v-for="item in userInfo" :key="item.user_id" :label="item.user_name" :value="item.user_id"> </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="授权人">
                    <el-select v-model="taskInfo.authorizer_id" placeholder="暂无授权人" style="width: 60%">
                        <el-option v-for="item in userInfo" :key="item.user_id" :label="item.user_name" :value="item.user_id"> </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="指派人">
                    <el-select v-model="taskInfo.execute_id" placeholder="暂无指派人" style="width: 60%">
                        <el-option v-for="item in userInfo" :key="item.user_id" :label="item.user_name" :value="item.user_id"> </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="任务完成时间">
                    <el-col>
                        <el-date-picker type="date" placeholder="选择日期" style="width: 60%" value-format="yyyy-MM-dd" v-model="taskInfo.modify_date"></el-date-picker>
                    </el-col>
                </el-form-item>
                <el-form-item label="任务内容">
                    <el-input type="textarea" v-model="taskInfo.task_info" :rows="6" style="width: 70%" placeholder="请输入任务内容"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisible = false">取 消</el-button>
                <el-button type="primary" @click="dialogFormVisible = false"  @click.native="executeUpdTaskInfo()">确 定</el-button>
            </div>
        </el-dialog>

        <el-dialog title="任务授权提示" :visible.sync="dialogAuthorizer">
            <el-form :model="taskInfo">
                <el-form-item label="拒绝授权理由">
                    <el-input type="textarea" v-model="taskInfo.remarks" :rows="6"></el-input>
                </el-form-item>
                <p :span="12">如若授权不通过，请务必填写理由！授权通过可以不填写</p>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="dialogAuthorizer=false" @click.native.prevent="updAuthorizer(3)">确认授权</el-button>
                <el-button type="danger" @click="dialogAuthorizer=false" @click.native.prevent="updAuthorizer(2)">拒绝授权</el-button>
                <el-button @click="dialogAuthorizer = false">取&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;消</el-button>
            </div>
        </el-dialog>
    </div>
    
</template>
<script>
import Axios from 'axios'
export default {
    data () {
        return {
            taskList: [],
            taskInfo: {},
            pages:{
                page: 1,
                numPages: 1,
                taskName: ''
            },
            activeNames: ['1', '2'],
            dialogTableVisible: false,
            dialogFormVisible: false,
            dialogAuthorizer: false,
            userInfo: [],
            state: {
                1: '审核中',
                2: '审核失败',
                3: '审核完成',
                4: '已完成'
            },
            options: [
                { value: 1, label: '审核中' },
                { value: 2, label: '审核失败' },
                { value: 3, label: '审核完成' },
                { value: 4, label: '已完成' }
            ],
            stateColor: {
                1: 'info',
                2: 'danger',
                3: 'primary',
                4: 'success'
            },
            taskInfo: {},

        }
    },
    mounted () {
        this.selectFromTaskList()
    },
    methods: {
        pageInitialization () {
            this.pages['page'] = 1
            this.pages['taskName'] = ''
        },
        selectFromTaskList(){
            this.pages['page'] = 1
            this.getPageInfo()
        },
        showTaskInfo (index) {
            let self=this
            Axios.get('/api/taskList/getAllFromTaskListByTaskId?taskId='+this.taskList[index]['task_id']).then(function(response) {
                self.taskInfo = response.data.taskList;
                self.taskInfo.task_info = self.taskInfo.task_info.replace(/<br>/g,'\r\n')
                if (self.taskInfo.remarks != '' && self.taskInfo.remarks != null){
                    self.taskInfo.remarks = self.taskInfo.remarks.replace(/<br>/g,'\r\n')
                }
            });      
        },
        getPageInfo (taskState) {
            let self=this 
            if ( taskState == undefined) {
               taskState = ''
            }
            Axios.get('/api/taskList/getAllFromTaskListByPage?page=' + this.pages.page+'&type=user'+'&taskName='+this.pages.taskName+'&taskState='+taskState)
            .then(function(response) {
                if( response.code == 200){
                    self.taskList = response.data.taskList;
                    self.pages.numPages = response.data.num_pages;
                    self.pages.page = response.data.page;
                }
                else{
                    self.$notify({
                        title: '失败',
                        message: response.message,
                        type: 'warning'
                    });
                }
                
            });
        },
        handleCurrentChange (val) {
            this.pages.page = val;
            this.getPageInfo()
        },
        loadUpdTaskInfo (index) {
            let self=this;
            Axios.get('/api/taskList/getAllFromTaskListByTaskId?taskId='+this.taskList[index]['task_id']).then(function(response) {
                self.taskInfo = response.data.taskList;
                self.taskInfo.task_info = self.taskInfo.task_info.replace(/<br>/g,'\r\n')
                if (self.taskInfo.remarks != '' && self.taskInfo.remarks != null){
                    self.taskInfo.remarks = self.taskInfo.remarks.replace(/<br>/g,'\r\n')
                }
            });
            Axios.get('/api/userInfo/getAllUserInfo').then(function(response) {
                self.userInfo = response.data;
            });
        },
        executeUpdTaskInfo () {
            let self=this;
            Axios.get('/api/taskList/updAllFromTaskListByTaskId?taskId='+this.taskInfo.task_id
            +'&taskInfo='+this.taskInfo.task_info.replace(/\n|\r\n/g,'<br>')+'&executeId='+this.taskInfo.execute_id+
            '&authorizerId='+this.taskInfo.authorizer_id+'&modifyDate='+this.taskInfo.modify_date
            ).then(function(response) {
                if( response.code == 200){
                    self.getPageInfo()
                    self.$notify({
                        title: '成功',
                        message: response.message,
                        type: 'success'
                    });
                }
                else{
                    self.$notify({
                        title: '失败',
                        message: response.message,
                        type: 'warning'
                    });
                }
            });

        },
        UpdTaskListByStatus(index, taskState){
            let self=this;
            Axios.get('/api/taskList/updTaskStateFromTaskListByTaskId?taskId='+this.taskList[index]['task_id']+'&taskState='+taskState)
            .then(function(response) {
                if( response.code == 200){
                    self.getPageInfo()
                    self.$notify({
                        title: '成功',
                        message: response.message,
                        type: 'success'
                    });
                }
                else{
                    self.$notify({
                        title: '失败',
                        message: response.message,
                        type: 'warning'
                    });
                }
            });
        },
        updAuthorizer(state){
            let self=this;
            if (this.taskInfo.remarks != '' && this.taskInfo.remarks != null){
                    this.taskInfo.remarks = this.taskInfo.remarks.replace(/\n|\r\n/g,'<br>')
            }
            if (state == 2 && this.taskInfo.remarks == ''){
                this.$notify({
                        title: '失败',
                        message: '请填写授权失败的理由！',
                        type: 'warning'
                });
            }
            else{
                Axios.get('/api/taskList/updTaskStateFromTaskListByTaskId?taskId='+this.taskInfo.task_id+'&taskState='+state+
                    '&remarks='+this.taskInfo.remarks)
                .then(function(response) {
                if( response.code == 200){
                    self.getPageInfo()
                    self.$notify({
                        title: '成功',
                        message: response.message,
                        type: 'success'
                    });
                }
                else{
                    self.$notify({
                        title: '失败',
                        message: response.message,
                        type: 'warning'
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
        padding-left: 20px;
    }
    .el-row-roleinfo{
        font-size: 16px;
        line-height: 40px;
        vertical-align: middle;
        border-bottom: 1px solid #efefef;
        padding: 5px;
    }
</style>