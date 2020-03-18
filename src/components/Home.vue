<template>
    <el-container>
      <el-header>
        <el-button @click="singout">退出</el-button>
      </el-header>
      <el-container>
        <el-aside :width="flodc ?'64px':'200px'">
          <el-menu :unique-opened="true" :collapse-transition="false" :collapse="flodc" router :default-active="activePath">
            <div class="flod" @click="flodclick">|||</div>
            <el-submenu  :index="item.id+''" v-for="item in menulist" :key="item.id">
              <template slot="title">
                <i :class="iconid[item.id]"></i>
                <span>{{item.authName}}</span>
              </template>
              <el-menu-item :index="'/'+item.path" v-for="item in item.children" :key="item.id" @click="active('/'+item.path)">
                <i class="iconfont icon-tijikongjian"></i>
                {{item.authName}}
              </el-menu-item>
            </el-submenu>
          </el-menu>
        </el-aside>
        <el-main>
          <router-view></router-view>
        </el-main>
      </el-container>
    </el-container>
</template>

<script>
  export default {
    data(){
      return{
        menulist:[],
        iconid:{
          125:'iconfont icon-user',
          103:'iconfont icon-users',
          101:'iconfont icon-shangpin',
          102:'iconfont icon-danju',
          145:'iconfont icon-baobiao'
        },
        flodc:false,
        activePath:''
      }
    },
    created(){
      this.getlist();
      this.activePath=window.sessionStorage.getItem('activePath')
    },
    methods:{
      singout(){
        window.sessionStorage.clear();
        this.$router.push('/login')
      },
      async getlist(){
        const list=await this.$http.get('menus');
        if(list.status==200){
          this.menulist=list.data.data;
        }
      },
      flodclick(){
        this.flodc=!this.flodc
      },
      active(activePath){
        window.sessionStorage.setItem('activePath',activePath);
        this.activePath=activePath;
      }
    }
  }
</script>

<style scoped lang="less">
  .el-container{
    height: 100%;
    overflow: hidden;
  }
  .button{
    width:50px;
    height: 50px;
    background-color: #00a0d2;
    display: flex;
    justify-content: space-between;
  }
  .el-header{
    background-color: #B3C0D1;
    color: #333;
    text-align: center;
    line-height: 60px;
  }

  .el-aside {
    background-color: #D3DCE6;
    color: #333;
    text-align: center;
    line-height: 200px;
    height: 100%;
    overflow: hidden;
  }
  .flod{
     height: 50px;
     margin: 0;
     padding-left: 0;
     list-style: none;
     line-height: 50px;
     background-color: #00a0d2;

   }

  .el-main {
    background-color: #E9EEF3;
    color: #333;
    line-height:10px;
  }
  .iconfont{
    margin-right: 20px;
  }
  .el-submenu .el-menu-item{
    padding: 0;
  }
</style>
