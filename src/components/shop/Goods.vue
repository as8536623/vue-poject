<template>
    <div>
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>商品管理</el-breadcrumb-item>
        <el-breadcrumb-item>商品列表</el-breadcrumb-item>
      </el-breadcrumb>
      <el-card class="box-card">
        <el-input placeholder="请输入内容" v-model="shopQuery.query" class="input-with-select" clearable @clear="goodsList">
          <el-button slot="append" icon="el-icon-search" @click="goodsList"></el-button>
        </el-input>
        <el-button type="primary" class="btnaddshop" @click="addGoodinfo">添加商品</el-button>
        <el-table :data="list" border style="width: 100%">
          <el-table-column prop="index" label="#" type="index" width="180"></el-table-column>
          <el-table-column prop="goods_name" label="商品名称" width="180"></el-table-column>
          <el-table-column prop="goods_number" label="商品数量" width="180"></el-table-column>
          <el-table-column prop="goods_weight" label="商品重量"></el-table-column>
          <el-table-column label="创建时间">
            <template slot-scope="scope">
              {{scope.row.add_time | dateFormat}}
            </template>
          </el-table-column>
          <el-table-column  label="操作">
            <template slot-scope="scope">
              <el-button type="primary" icon="el-icon-edit" @click="editinfo(scope.row.goods_id)">编辑</el-button>
              <el-button type="danger" icon="el-icon-delete" @click="gooddelete(scope.row.goods_id)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="shopQuery.pagenum" :page-sizes="[10, 15, 20, 30]" :page-size="shopQuery.pagesize" layout="total, sizes, prev, pager, next, jumper" :total="total">
        </el-pagination>

        <!--//添加表单-->
        <el-dialog title="添加商品" :visible.sync="dialogFormVisible" @close="resetForm">
          <el-form :model="addgoodform">
            <el-form-item label="活动名称">
              <el-input v-model="addgoodform.goods_name" autocomplete="off"></el-input>
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button @click="resetForm">取 消</el-button>
            <el-button type="primary" @click="dialogFormVisible = false">确 定</el-button>
          </div>
        </el-dialog>
      </el-card>
    </div>
</template>

<script>

    export default {
      data(){
       return{
         //商品列表
         list:[],
         //商品参数
         shopQuery:{
           query:'',
           pagenum:1,
           pagesize:10
         },
         //总页数
         total:0,
         //添加商品提交信息
         addgoodform:{
           goods_name:'',
           goods_cat:'',
           goods_price:'',
           goods_number:'',
           goods_weight:'',
           goods_introduce:'',
           pics:'',
           attrs:'',
         },
         //关闭弹出框
         dialogFormVisible:false,
       }
      },
      created(){
        this.goodsList();
      },
      methods:{
        //查询商品列表
        async goodsList(){
          const result=await this.$http.get('goods',{params:this.shopQuery});
          if(result.data.meta.status==200){
            this.$message.success('成功')
            this.list=result.data.data.goods;
            this.total=result.data.data.total;
          }else{
            this.$message.error('失败')
          }
        },
        //每页显示条数
        handleSizeChange(val) {
          this.shopQuery.pagesize=val;
          this.goodsList();
        },
        //当前页码
        handleCurrentChange(val) {
          this.shopQuery.pagenum=val;
          this.goodsList();
        },
        //添加取消清空填写项目
        resetForm() {
          this.$refs.addform.resetFields();
          this.dialogFormVisible=false
        },
        //添加商品
        addGoodinfo(){
          this.$router.push('/goods/add')
        },
        //删除商品
        gooddelete(id){
          this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(async() => {
            const result=await this.$http.delete('goods/'+id);
            if(result.data.meta.status==200){
              this.$message.success('成功');
              this.goodsList();
            }else{
              this.$message.error('失败')
            }
          }).catch(() => {
            this.$message({
              type: 'info',
              message: '已取消删除'
            });
          });
        },
        //编辑商品
        async editinfo(id){
          this.$router.push({name:'edit',params:{goodid:id}})
        }
      }
    }
</script>

<style scoped>
  .el-card{
    margin-top: 20px;
  }
  .input-with-select{
    width: 20%;
  }
  .btnaddshop{
    margin-left: 20px;
  }
</style>
