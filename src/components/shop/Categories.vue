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
          <template slot="cat3" scope="scope">
            <el-button type="primary" @click="editinfo(scope.row)">编辑</el-button>
            <el-button type="danger" @click="deletecate(scope.row)">删除</el-button>
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
          <el-cascader v-model="catid" :options="options" :props="addprops" @change="handleChange" clearable blur>
          </el-cascader>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="addcate">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 编辑分类的对话框 -->
    <el-dialog title="编辑分类" :visible.sync="editFormVisible">
      <el-form :model="editFrom" :rules="editrules" ref="editData" label-width="100px">
        <el-form-item label="分类名称" prop="cat_name">
          <el-input v-model="editFrom.cat_name"></el-input>
        </el-form-item>
        <el-form-item label="父级菜单">
          <el-cascader v-model="editcatid" :options="options" :props="addprops" disabled>
          </el-cascader>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="editFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="editcate">确 定</el-button>
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

        //编辑分类取消框
        editFormVisible: false,
        //编辑分类名称
        editFrom:{
          cat_name:'',
          cat_id:0,
        },
        editname:'',
        editrules: {
          cat_name: [
            {required: true, message: '请输入分类名称', trigger: 'blur'},
            {min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur'}
          ],
        },
        //多层连级
        editcatid:[],
        sjinfoid:'',
        editoptions:[],
        editprops:{
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
        this.addFrom.cat_pid=0;
        this.addFrom.cat_level=0;
        this.dialogFormVisible=false
      },
      //点击添加分类弹窗
      buttoncate(){
        this.cateinfo();
        this.dialogFormVisible=true;
      },
      async cateinfo(){
        const result=await this.$http.get('categories',{params:{type:2}});
        if(result.data.meta.status==200){
          this.options=result.data.data;
        }else{
          this.$message.error('获取失败')
        }
      },
      handleChange() {
        if(this.catid.length>0){
         this.addFrom.cat_pid=this.catid[this.catid.length-1];
         this.addFrom.cat_level=this.catid.length
        }else{
          this.addFrom.cat_pid=0;
          this.addFrom.cat_level=0
        }
      },
      addcate(){
        this.$refs.tableData.validate(async valid => {
          if (valid) {
            const result=await this.$http.post('categories',this.addFrom);
            if(result.data.meta.status==201){
              this.$message.success('提交成功');
              this.catelist()
              this.dialogFormVisible=false;
            }
          } else {
            this.$message.error('提交失败')
          }
        });
      },
      //删除分类
      deletecate(scope) {
        this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(async () => {
          const result=await this.$http.delete('categories/'+scope.cat_id);
          if(result.data.meta.status==200){
            this.$message.success('删除成功');
            this.catelist()
          }else{
            this.$message.error('删除失败')
          }
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });
      },
      //编辑分类
      async editcateinfo(){
        const result=await this.$http.get('categories',{params:{type:3}});
        if(result.data.meta.status==200){
          this.options=result.data.data;
        }else{
          this.$message.error('获取失败')
        }
      },
      async editinfo(scope){
        this.editFormVisible=true;
        this.editcateinfo();
        const result=await this.$http.get('categories/'+scope.cat_id);
        if(result.data.meta.status==200){
          if(result.data.data.cat_level==0){
            this.editcatid=[];
            this.editFrom.cat_name=result.data.data.cat_name;
            this.editFrom.cat_id=result.data.data.cat_id;
          }else if(result.data.data.cat_level==1){
            this.editFrom.cat_id=result.data.data.cat_id;
            this.editFrom.cat_name=result.data.data.cat_name;
            this.editcatid=[result.data.data.cat_pid,result.data.data.cat_id];
          }else{
            const result1=await this.$http.get('categories/'+result.data.data.cat_pid);
            this.editFrom.cat_id=result.data.data.cat_id;
            this.editFrom.cat_name=result.data.data.cat_name;
            this.editcatid=[result1.data.data.cat_pid,result.data.data.cat_pid,result.data.data.cat_id];
          }
        }else{
          this.$message.error('删除失败')
        }
      },
      editcate(){
        this.$refs.editData.validate(async valid => {
          if (valid) {
            const result=await this.$http.put('categories/'+this.editFrom.cat_id,this.editFrom);
            if(result.data.meta.status==200){
              this.$message.success('编辑成功');
              this.catelist();
              this.editFormVisible=false;
            }else{
              this.$message.error('编辑失败')
            }
          } else {
            this.$message.error('提交失败')
          }
        });

      }
    }
  }
</script>

<style scoped>
.el-cascader{
  width: 100%;
}
  .el-button{
    margin: 15px 0;
  }
</style>
