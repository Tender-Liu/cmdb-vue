<template>
  <div class="fullscreen">
    <div class="home-login-box" >
      <div style="text-align: center">
        <img src="../assets/logo.png" alt class="logo">
      </div>
      <form action class="login-form">
        <div class="m-list-group">
          <div class="m-list-group-item">
            <input type="text" placeholder="邮箱或手机登录" class="m-input" v-model="username">
          </div>
          <div class="m-list-group-item">
            <input type="password" placeholder="密码" class="m-input" v-model="password">
          </div>
        </div>
        <button class="m-btn sub select-none" @click.prevent="handleLogin" v-loading="isLoging">登陆</button>
        <p class="text-tips">还没有账号？</p>
        <a href="/register" class="m-btn m-btn-text">注册</a>
      </form>
    </div>
  </div>
</template>
<script>
import {mapActions} from 'vuex'
import Axios from 'axios'
export default {
  name: 'login',
  data () {
    return {
      username: '',
      password: '',
      isLoging: false
    }
  },
  methods: {
    ...mapActions(['login']),
    handleLogin () {
      let self=this;
      if (!self.username || !self.password) {
        return this.$message.warning('用户名和密码不能为空')
      } else {
        Axios.get('/api/userInfo/getFromUserInfoByLogin?account='+this.username+'&password='+this.password)
          .then(function(response) {
            var message = response['message'];
            var code = response['code'];
            if( code != 200 || message != '登录完成'){
              return self.$message.warning(message);
            }else{
              self.isLoging = false
              self.login({
                username: response.data['userName']
              }).then(res => {
                self.$message.success('登录成功')
                self.$router.push({name: 'home'})
                self.isLoging = false
              })
            }
        }); 
      }
      
    }
  }
}
</script>
<style type="text/css">
.m-list-group {
  border-radius: 3px;
  padding: 0;
  margin: 0 0 20px;
}
.m-list-group .m-list-group-item {
  position: relative;
  display: block;
  padding: 6px 10px;
  margin-bottom: -1px;
  background-color: #fff;
  border: 1px solid #e7ecee;
}
.m-list-group .m-list-group-item:first-child {
  border-top-left-radius: 3px;
  border-top-right-radius: 3px;
}
.fullscreen {
  position: absolute;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}
.home-login-box {
  position: relative;
  width: 330px;
  margin: 0 auto;
  padding: 0px 15px;
}
.home-login-box .logo {
  max-width: 40%;
  margin-bottom: 20px;
}
.home-login-box .text-tips {
  text-align: center;
  color: #909db7;
  font-size: 16px;
}
.home-login-box .m-input {
  width: 100%;
  padding: 10px;
  border: none;
  outline: none;
  box-sizing: border-box;
}
.home-login-box .m-btn {
  font-size: 18px;
  width: 100%;
  color: #fff;
  background-color: #36c1fa;
  display: inline-block;
  padding: 10px 12px;
  margin-bottom: 5px;
  line-height: 1.42857143;
  text-align: center;
  cursor: pointer;
  outline: none;
  border-radius: 2px;
  border: 1px solid #36c1fa;
  box-sizing: border-box;
  text-decoration: none;
}
.home-login-box .m-btn.m-btn-text {
  background: #fff;
  color: #36c1fa;
}
.home-login-box .m-btn:hover {
  background-color: #2db7f5;
}
.home-login-box .m-btn.m-btn-text:hover {
  background-color: #f4f5f5;
}
.home-login-box .m-btn:active {
  opacity: 0.8;
}
@media (max-width: 768px) {
  .home-login-box {
    width: auto;
  }
}
</style>
