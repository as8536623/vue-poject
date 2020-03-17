<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card class="box-card">
      <el-button type="primary">添加分类</el-button>
      <template>
        <el-table :data="tableData" style="width: 100%;margin-bottom: 20px;" row-key="cat_id" border :tree-props="{children: 'children',hasChildren: 'hasChildren'}">
          <el-table-column prop="index" label="#" width="180" type=index ></el-table-column>
          <el-table-column prop="cat_name" label="分类名称" width="180"></el-table-column>
          <el-table-column prop="date" label="是否有效" width="180"></el-table-column>
          <el-table-column prop="name" label="排序" width="180"></el-table-column>
          <el-table-column prop="address" label="操作"></el-table-column>
        </el-table>
        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage.pagenum" :page-sizes="[1,5,10,15]" :page-size="currentPage.pagesize" layout="total, sizes, prev, pager, next, jumper" :total="total">
        </el-pagination>
      </template>
    </el-card>
  </div>
</template>

<script>
  export default {
    data(){
      return{
        tableData:[],
        //当前页数
        currentPage:{
          type:3,
          pagenum:1,
          pagesize:5
        },
        total:0,
      }
    },
    created(){
      this.catelist()
    },
    methods:{
      //获取分类列表
      async catelist(){
        const result=await this.$http.get('categories',{params:this.currentPage});
        if(result.data.meta.status==200){
          this.tableData=result.data.data.result;
          this.total=result.data.data.total
        }else{
          this.$message.error('获取失败')
        }
        console.log(this.tableData.cat_level)
      },
      //分页
      handleSizeChange(val) {
        this.currentPage.pagesize = val;
        this.catelist()
      },
      handleCurrentChange(val) {
        this.currentPage.pagenum = val;
        this.catelist()
      }
    }
  }
</script>

<style scoped>
  .el-card{
    margin-top: 20px;
  }
</style>
