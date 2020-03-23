<template>
    <div>
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>订单管理</el-breadcrumb-item>
        <el-breadcrumb-item>订单列表</el-breadcrumb-item>
      </el-breadcrumb>
      <el-card class="box-card">
        <el-input placeholder="请输入内容" v-model="queryInfo.query" class="input-with-select" clearable @clear="getlist">
          <el-button slot="append" icon="el-icon-search" @click="getlist"></el-button>
        </el-input>
        <el-table :data="orderlist" border style="width: 100%">
          <el-table-column  label="#" width="180" type="index"></el-table-column>
          <el-table-column prop="order_number" label="订单号" width="180"></el-table-column>
          <el-table-column prop="order_price" label="订单价格" width="180"></el-table-column>
          <el-table-column prop="order_pay" label="是否支付"></el-table-column>
          <el-table-column prop="create_time" label="下单时间"></el-table-column>
          <el-table-column label="操作">
            <el-button type="primary" icon="el-icon-edit" circle  @click="editinfo"></el-button>
            <el-button type="success" icon="el-icon-map-location" circle @click="showwl"></el-button>
          </el-table-column>
        </el-table>
        <!--//分页-->
        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="queryInfo.pagenum" :page-sizes="[1, 5, 10, 15]" :page-size="queryInfo.pagesize" layout="total, sizes, prev, pager, next, jumper" :total="total">
        </el-pagination>

        <el-dialog title="收货地址" :visible.sync="dialogFormVisible" @close="resetForm">
          <el-form :model="editform" :rules="rules" ref="editform">
            <el-form-item label="省市区/县" prop="address1">
              <el-cascader v-model="editform.address1" :options="cityData" :props="{ expandTrigger: 'hover' }"></el-cascader>
            </el-form-item>
            <el-form-item label="详细地址" prop="address2">
              <el-input v-model="editform.address2" autocomplete="off"></el-input>
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button @click="dialogFormVisible = false">取 消</el-button>
            <el-button type="primary" @click="dialogFormVisible = false">确 定</el-button>
          </div>
        </el-dialog>

        <el-dialog title="物流" :visible.sync="wlFormVisible">
          <el-timeline :reverse="reverse">
            <el-timeline-item v-for="(item, index) in wlinfo" :key="index" :timestamp="item.ftime">
              {{item.context}}
            </el-timeline-item>
          </el-timeline>
        </el-dialog>
      </el-card>
    </div>
</template>
<script>
  import cityData from './citydata.js'
    export default {
      data(){
        return{
          //查询参数
          orderlist:[],
          queryInfo: {
            query:'',
            pagenum:1,
            pagesize:10
          },
          total:0,
          //对话框
          dialogFormVisible: false,
          wlFormVisible: false,
          //修改数据绑定
          editform:{
            address1:[],
            address2:''
          },
          cityData,
          //验证信息
          rules: {
            address1: [
              { required: true, message: '请选择省区县', trigger: 'blur' },
            ],
            address2: [
              { required: true, message: '请输入详细地址', trigger: 'blur' },
            ]
          },
          wlinfo:[],
          //时间线
          reverse: true,
        }
      },
      created() {
        this.getlist();
      },
      methods:{
        async getlist(){
          const result=await this.$http.get('orders',{params:this.queryInfo});
          this.orderlist=result.data.data.goods;
          this.total=result.data.data.total
        },
        //分页
        handleSizeChange(val) {
          this.queryInfo.pagesize=val;
          this.getlist()
        },
        handleCurrentChange(val) {
          this.queryInfo.pagenum=val;
          this.getlist()
        },
        //修改地址
        editinfo(){
          this.dialogFormVisible=true
        },
        //添加取消清空填写项目
        resetForm() {
          this.$refs.editform.resetFields();
          this.dialogFormVisible=false
        },

        async showwl(){
          const result=await  this.$http.get('/kuaidi/1106975712662');
          if(result.data.meta.status!=200){
            this.$message.error('失败')
          }
          this.wlFormVisible=true;
          this.wlinfo=result.data.data;
        }
      }
    }
</script>

<style scoped>
  .input-with-select{
    width:30%;
  }

  .el-cascader {
    width: 100%;
  }
</style>
