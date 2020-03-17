<template>
    <div>
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>权限管理</el-breadcrumb-item>
        <el-breadcrumb-item>权限列表</el-breadcrumb-item>
      </el-breadcrumb>
      <el-card>
        <el-table :data="list" border stripe>
          <el-table-column type="index" label="#"></el-table-column>
          <el-table-column prop="authName" label="权限名称" width="500px"></el-table-column>
          <el-table-column prop="path" label="路径" width="500px"></el-table-column>
          <el-table-column prop="level" label="权限等级" width="500px">
            <template slot-scope="scope">
              <el-tag v-if="scope.row.level==0">一级</el-tag>
              <el-tag type="success" v-else-if="scope.row.level==1">二级</el-tag>
              <el-tag type="danger" v-else>三级</el-tag>
            </template>
          </el-table-column>
        </el-table>
      </el-card>
    </div>
</template>

<script>
    export default {
      data(){
        return{
          list:[],
        }
      },
      created(){
        this.powerList()
      },
      methods:{
        async powerList(){
          const list=await this.$http.get(`rights/list`);
          if (list.data.meta.status== 200) {
            this.$message.success('获取成功');
            this.list=list.data.data;
          }else{
            this.$message.error('获取失败');
          }
        }
      }
    }
</script>

<style scoped>
  .el-card{
    margin-top: 40px;
  }
  .el-table{
    margin-top: 10px;
    width:100%;
    line-height: 100px;
  }
</style>
