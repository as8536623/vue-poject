<template>
  <div>
    <!--面包屑导航-->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>

    <!--分类列表-->
    <el-card class="box-card">
      <el-button type="primary" @click="buttoncate">添加分类</el-button>
        <tree-table :data="tableData"  :columns="columns" :selection-type="false" :expand-type="false" show-index index-text="#" border>
          <template slot="cat1" scope="scope">
            <i v-if="scope.row.cat_deleted===false" class="el-icon-success" style="color:green;"></i>
            <i v-else class="el-icon-error" style="color:red;"></i>
          </template>
          <template slot="cat2" scope="scope">
            <el-tag v-if="scope.row.cat_level===0">一级</el-tag>
            <el-tag v-else-if="scope.row.cat_level===1" type="success">二级</el-tag>
            <el-tag type="warning" v-else>三级</el-tag>
          </template>
          <template slot="cat3">
            <el-button type="primary">编辑</el-button>
            <el-button type="danger">删除</el-button>
          </template>
        </tree-table>
        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage.pagenum" :page-sizes="[1,5,10,15]" :page-size="currentPage.pagesize" layout="total, sizes, prev, pager, next, jumper" :total="total"></el-pagination>
    </el-card>
    <!-- 添加分类的对话框 -->
    <el-dialog title="添加分类" :visible.sync="dialogFormVisible" @close="resetForm">
      <el-form :model="addFrom" :rules="rules" ref="tableData" label-width="100px">
        <el-form-item label="分类名称" prop="cat_name">
          <el-input v-model="addFrom.cat_name"></el-input>
        </el-form-item>
        <el-form-item label="父级菜单">
          <el-cascader v-model="catid" :options="options" :props="addprops" @change="handleChange" clearable>
          </el-cascader>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogFormVisible = false">确 定</el-button>
      </div>
    </el-dialog>
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
        //总页数
        total:0,

        //表格数据
        columns: [
          {
            label: '分类名称',
            prop: 'cat_name',
            width: '400px',
          },
          {
            label: '是否有效',
            prop: 'cat_deleted',
            minWidth: '50px',
            type: 'template',
            template: 'cat1',
          },
          {
            label: '排序',
            prop: 'cat_level',
            minWidth: '50px',
            type: 'template',
            template: 'cat2',
          },
          {
            label: '操作',
            minWidth: '200px',
            type: 'template',
            template: 'cat3',
          },
        ],
        //添加分类取消框
        dialogFormVisible: false,
        //添加分类名称
        addFrom:{
          cat_name:'',
          cat_pid:0,
          cat_level:0
        },
        addname:'',
        rules: {
          cat_name: [
            {required: true, message: '请输入分类名称', trigger: 'blur'},
            {min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur'}
          ],
        },
        //多层连级
        catid:[],
        options:[],
        addprops:{
          value:'cat_id',
          label:'cat_name',
          children:'children',
          expandTrigger:'hover',
          checkStrictly: true
        },
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
      },
      //分页
      handleSizeChange(val) {
        this.currentPage.pagesize = val;
        this.catelist()
      },
      handleCurrentChange(val) {
        this.currentPage.pagenum = val;
        this.catelist()
      },
      //取消清空
      resetForm() {
        this.$refs.tableData.resetFields();
        this.catid=[];
        this.dialogFormVisible=false
      },
      //点击添加分类弹窗
      buttoncate(){
        this.addcate();
        this.dialogFormVisible=true;
      },
      async addcate(){
        const result=await this.$http.get('categories',{params:{type:2}});
        if(result.data.meta.status==200){
          this.options=result.data.data;
        }else{
          this.$message.error('获取失败')
        }
      },
      handleChange() {
        console.log(this.catid);
      }
    }
  }
</script>

<style scoped>
.el-cascader{
  width: 100%;
}
</style>
