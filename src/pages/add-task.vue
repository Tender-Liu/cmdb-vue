<template>
    <div class="page-body">
        <div class="page-header">
            <h1 class="page-title">添加任务</h1>
            <el-breadcrumb>
                <el-breadcrumb-item :to="{path: '/'}">首页</el-breadcrumb-item>
                <el-breadcrumb-item >添加任务</el-breadcrumb-item>
            </el-breadcrumb>
        </div>

        <div class="box" v-loading="loading1" element-loading-text="任务添加中, 请稍等...">
            <el-form ref="taskInfo" :model="taskInfo" style="width: 50%;"
            status-icon label-width="100px" class="demo-ruleForm" >
            <el-form-item label="任务标题">
                <el-input v-model="taskInfo.taskName"></el-input>
            </el-form-item>
            <el-form-item label="指派人">
                <el-select v-model="taskInfo.executeId" placeholder="请选择指派人" style="width: 100%;">
                    <el-option v-for="item in userInfo" :key="item.user_id" :label="item.user_name" :value="item.user_id"> </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="授权人">
                <el-select v-model="taskInfo.authorizerId" placeholder="请选择授权人" style="width: 100%;">
                    <el-option v-for="item in userInfo" :key="item.user_id" :label="item.user_name" :value="item.user_id"> </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="预计完成时间">
                <el-col>
                    <el-date-picker type="date" placeholder="选择日期" style="width: 100%;" value-format="yyyy-MM-dd" v-model="taskInfo.modifyDate"></el-date-picker>
                </el-col>
            </el-form-item>
            <el-form-item label="任务内容">
                <el-input type="textarea" :rows="6" v-model="taskInfo.taskInfo"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="primary"  @click.native="addTaskList()" >提交</el-button>
                <el-button @click.native="resetForm()">重置</el-button>
            </el-form-item>
            </el-form>
        </div>
    </div>    
</template>

<script>
import Axios from 'axios'
export default {
    data() {
        return {
            taskInfo: {
                taskName: '',
                taskInfo: '',
                executeId: '',
                authorizerId: '',
                modifyDate: ''
            },
            userInfo: [],
            loading1: false
        }
    },
    mounted () {
        let self=this
        Axios.get('/api/userInfo/getAllUserInfo').then(function(response) {
            self.userInfo = response.data;
        });
    },
    methods: {
        addTaskList(){
            let self=this
            if (this.taskInfo.taskName == '' || this.taskInfo.taskInfo == '' || this.taskInfo.executeId == ''
            || this.taskInfo.authorizerId == '' || this.taskInfo.modifyDate == ''){
                this.$notify({
                    title: '提示',
                    message: '请将所有内容填写完整，谢谢！',
                    type: 'warning'
                });
            }
            else{
                this.loading1 = true
                Axios.get('/api/taskList/setAllFromTaskList?taskInfo='+self.taskInfo.taskInfo.replace(/\n|\r\n/g,'<br>')+'&taskName='+self.taskInfo.taskName
                +'&executeId='+self.taskInfo.executeId+'&authorizerId='+self.taskInfo.authorizerId+'&modifyDate='+self.taskInfo.modifyDate
                ).then(function(response) {
                    self.loading1 = false
                    if( response.code == 200){
                        self.$notify({
                            title: '成功',
                            message: response.message,
                            type: 'success'
                        });
                        self.resetForm()
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
        },
        resetForm() {
            this.taskInfo = {
                taskName: '',
                taskInfo: '',
                executeId: '',
                authorizerId: '',
                modifyDate: ''
            }
        }
    }
  }
</script>


<style>
    .page-body{
        width: 100%;
        overflow: auto;
    }
    
</style>