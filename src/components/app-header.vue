<template>
<m-navbar :theme="theme.theme.headerTheme">
  <m-navbar-brand>
    <i class="side-switch" 
      :class="{
        'el-icon-more': !mini,
        'el-icon-more-outline': mini
      }"
      @click="handleSwitchSide"></i>
  </m-navbar-brand>
  
  <m-nav align="right">
    <m-nav-item padding="0">
      <m-dropdown align="right" v-if="user" padding="0 10px" @command="command">
        <a href="#" style="display: inline-block; padding: 0px; color: inherit">
          <!-- <img src="../assets/user.jpg" alt="" style="border-radius: 3px;vertical-align: middle;"> -->
          <span>{{user.username}}</span> 
          <span class="caret"></span>
        </a>
        <m-dropdown-panel >
          <m-dropdown-item cmd='logout'>退出登陆</m-dropdown-item>
        </m-dropdown-panel>
      </m-dropdown>
    </m-nav-item>
    <m-nav-item padding="0 5px">
      <a href="#" @click.stop.prevent="handleSwitchScreen">
        <i 
          class="fa" 
          :class="isFullScreen ? 'fa-compress' : 'fa-expand'"
          ></i>
      </a>
    </m-nav-item>

    <m-nav-item padding="0">
      <m-dropdown align="right" padding="0 10px">
        <a href="#"  style="padding:0 0px; color: inherit">
          <i class="fa fa-gears"></i>
        </a>
        <m-dropdown-panel style="width: 200px; min-height: 100px;">
          <el-form>
            <el-form-item label="侧边栏">
              <el-switch v-model="showAside" @change="handleSwitchHideSide" />
            </el-form-item>
            <el-form-item label="主题">
              <el-select v-model="themeType" style="width: 100px">
                <el-option
                  v-for="theme in themes"
                  :key="theme.label"
                  :label="theme.label"
                  :value="theme.name"
                  ></el-option>
              </el-select>
            </el-form-item>
          </el-form>
        </m-dropdown-panel>
      </m-dropdown>
    </m-nav-item>
  </m-nav>
</m-navbar>
</template>
<script type="text/javascript">
import {mapActions, mapState} from 'vuex'
import Axios from 'axios'
import {
  requestFullScreen,
  exitFullscreen
} from '@/utils'
import themes from './theme'
export default {
  name: 'app-header',
  data () {
    return {
      mini: false,
      isFullScreen: false,
      themes,
      themeType: '',
      showAside: true,
      theme: {theme: {headerTheme: 'info'}}
    }
  },
  computed: {
    ...mapState({
      user: ({user}) => user.user
    })
  },
  watch: {
    themeType (val) {
      this.theme = this.themes.find(e => e.name === val) || {}
      this.$emit('set-theme', this.theme)
      localStorage.setItem('theme', val)
    }
  },
  methods: {
    ...mapActions(['getLoginUser', 'logout']),
    command(cmd){
      if (cmd == 'logout') {
        Axios.get('/api/userInfo/delFromSessionByKey').then(function(response) {})
        let self=this;
        self.$router.push({name: 'p-login'});
        this.logout()
      }
    },
    handleSwitchSide () {
      this.mini = !this.mini
      this.$emit('switch', this.mini)
    },
    handleSwitchScreen () {
      if (this.isFullScreen) {
        exitFullscreen()
        this.isFullScreen = false
      } else {
        requestFullScreen()
        this.isFullScreen = true
      }
    },
    handleSwitchHideSide () {
      console.log('change')
      this.$emit('hide-side')
    }
  },
  created () {
    this.getLoginUser()
    var theme = localStorage.getItem('theme') || 'default'
    this.themeType = theme
  }
}
</script>
<style type="text/css">
  .side-switch{
    display: inline-block;
    font-size: 32px;
    cursor: pointer;
    color: inherit;
    margin-top: 10px;
  }
  .side-switch:hover{
    color: #fff;
  }
</style>
