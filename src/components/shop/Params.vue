<template>
  <div>
    <!--面包屑导航-->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品参数</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-alert title="注意：只允许给第三级分类设置参数" type="warning" show-icon></el-alert>
      <div class="block">
        <span class="demonstration">选择商品列表:</span>
        <el-cascader v-model="catekeys" :options="cateoptions" :props="cateprops" @change="handleChange"></el-cascader>
      </div>
      <el-tabs v-model="paramsName" @tab-click="handleClick" >
        <el-tab-pane label="动态参数" name="many">
          <el-button type="primary" @click="buttondyn" :disabled="handlebutton">添加动态参数</el-button>
          <!--动态数据表格-->
          <el-table :data="dynparamslist" border style="width: 100%">
            <el-table-column type="expand">
              <template slot-scope="scope">
                <el-card class="box-card">
                  <el-tag :key="i" v-for="(item,i) in scope.row.attr_vals" closable @close="handleClose(i,scope.row)">
                    {{item}}
                  </el-tag>
                  <el-input class="input-new-tag" v-if="scope.row.inputVisible" v-model="scope.row.inputValue" ref="saveTagInput" size="small" @keyup.enter.native="handleInputConfirm(scope.row)" @blur="handleInputConfirm(scope.row)">
                  </el-input>
                  <el-button v-else class="button-new-tag" size="small" @click="showInput(scope.row)">+ New Tag</el-button>
                </el-card>
              </template>
            </el-table-column>
            <el-table-column prop="index" label="#"  type="index">
            </el-table-column>
            <el-table-column prop="attr_name" label="参数名" width="180"></el-table-column>
            <el-table-column prop="address" label="操作">
              <template slot-scope="scope">
                <el-button type="primary" @click="editinfo(scope.row)">编辑</el-button>
                <el-button type="danger" @click="deleteparams(scope.row)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="静态参数" name="only">
          <el-button type="primary" @click="buttonstatic" :disabled="handlebutton">添加静态参数</el-button>
          <!--静态数据表格-->
          <el-table :data="staticparamslist" border style="width: 100%">
            <el-table-column type="expand">
              <template slot-scope="scope">
                <el-card class="box-card">
                  <el-tag :key="i" v-for="(item,i) in scope.row.attr_vals" closable @close="handleClose(i,scope.row)">
                    {{item}}
                  </el-tag>
                  <el-input class="input-new-tag" v-if="scope.row.inputVisible" v-model="scope.row.inputValue" ref="saveTagInput" size="small" @keyup.enter.native="handleInputConfirm(scope.row)" @blur="handleInputConfirm(scope.row)">
                  </el-input>
                  <el-button v-else class="button-new-tag" size="small" @click="showInput(scope.row)">+ New Tag</el-button>
                </el-card>
              </template>
            </el-table-column>
            <el-table-column prop="index" label="#"  type="index"></el-table-column>
            <el-table-column prop="attr_name" label="参数名" width="180"></el-table-column>
            <el-table-column prop="address" label="操作">
              <template slot-scope="scope">
                <el-button type="primary" @click="editinfo(scope.row)">编辑</el-button>
                <el-button type="danger" @click="deleteparams(scope.row)">删除</el-button>
              </template>
            </el-table-column>

          </el-table>
        </el-tab-pane>
        <!--添加属性对话框-->
        <el-dialog :title="'添加'+title" :visible.sync="dialogFormVisible" @close="resetForm">
          <el-form :model="listtabform" :rules="rules" ref="listtabform">
            <el-form-item :label="title+':'" prop="attr_name">
              <el-input v-model="listtabform.attr_name" ></el-input>
            </el-form-item>
            <el-form-item :label="title+'选项:'" prop="attr_vals" >
              <el-input v-model="listtabform.attr_vals" placeholder="动态参数请用逗号,分隔"></el-input>
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button @click="resetForm">取 消</el-button>
            <el-button type="primary" @click="addparams">确 定</el-button>
          </div>
        </el-dialog>
        <!--编辑属性对话框-->
        <el-dialog :title="'编辑'+title" :visible.sync="editFormVisible">
          <el-form :model="edittabform" :rules="rules" ref="edittabform">
            <el-form-item :label="title+':'" prop="attr_name">
              <el-input v-model="edittabform.attr_name" ></el-input>
            </el-form-item>
            <el-form-item :label="title+'选项:'" prop="attr_vals" >
              <el-input v-model="edittabform.attr_vals" placeholder="添加动态参数请用逗号,分隔"></el-input>
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button @click="editresetForm">取 消</el-button>
            <el-button type="primary" @click="editparams(edittabform.attr_id)">确 定</el-button>
          </div>
        </el-dialog>
      </el-tabs>
    </el-card>
  </div>
</template>

<script>
    export default {
      data(){
        return{
          //分类列表
          catekeys:[],
          cateoptions:[],
          cateprops:{
            value:'cat_id',
            label:'cat_name',
            children:'children',
            expandTrigger:'hover',
          },
          //tabs选择哪个
          paramsName:'many',
          //获取列表
          //动态属性数据
          dynparamslist:[],
          //动态选项数据
          dyndata:'',
          //静态属性数据
          staticparamslist:[],
          //form属性
          listtabform:{
            attr_name:'',
            attr_sel:'',
            attr_vals:'',

          },
          edittabform:{
            attr_name:'',
            attr_sel:'',
            attr_vals:'',
          },
          //添加关闭对话框
          dialogFormVisible:false,
          //编辑关闭对话框
          editFormVisible:false,
          //添加选项属性input
          inputVisible: false,
          //输入框的文本
          inputValue: '',
          //table标题
          title:'',
          //验证
          rules: {
            attr_name: [
              {required: true, message: '请输入活动名称', trigger: 'blur'},
              {min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur'}
            ],
          },
        }
      },
      created(){
        this.cateslist()
      },
      computed:{
        handlebutton(){
          if(this.catekeys.length!=3){
            return true
          }else{
            return false
          };
        },
        catid(){
          if(this.catekeys.length==3){
            return this.catekeys[2]
          }else{
            return null
          }
        }
      },
      methods:{
        //查询分类列表
        async cateslist(){
          const result=await this.$http.get('categories',{params:{type:3}});
          if(result.data.meta.status==200){
            this.cateoptions=result.data.data;
          }else{
            this.$message.error('获取失败')
          }
        },
        //级联选择框变化
        handleChange(){
          this.getparams();
        },
        //获取参数数据
        async getparams(){
          if(this.catekeys.length<3){
            this.catekeys=[];
            this.dynparamslist=[];
            this.staticparamslist=[];
            return
          }
          const result=await this.$http.get(`categories/${this.catid}/attributes`,{params:{sel:this.paramsName}});
          if(result.data.meta.status==200){
            result.data.data.forEach(item=>{
              item.attr_vals=item.attr_vals?item.attr_vals.split(','):[];
              item.inputVisible = false;
              item.inputValue='';
            });
            if(this.paramsName=='many'){
              this.dynparamslist=result.data.data;
            }else{
              this.staticparamslist=result.data.data;
            }
          }else{
            this.$message.error('获取失败')
          }
        },
        //tabs栏变化
        handleClick() {
          this.getparams();

        },
        //添加取消清空填写
        resetForm() {
          this.$refs.listtabform.resetFields();
          this.dialogFormVisible=false
        },
        //编辑取消清空填写
        editresetForm() {
          this.editFormVisible=false
        },
        //动态添加按钮
        buttondyn(){
          this.dialogFormVisible=true;
          if(this.paramsName=='many'){
            this.title='动态数据';
            this.listtabform.attr_sel=this.paramsName
          }
        },
        //静态添加按钮
        buttonstatic(){
          this.dialogFormVisible=true;
          if(this.paramsName=='only'){
            this.title='静态数据';
            this.listtabform.attr_sel=this.paramsName
          }
        },
        //编辑动态添加按钮
        editdyn(){
          this.editFormVisible=true;
          if(this.paramsName=='many'){
            this.title='动态数据';
          }
        },
        //编辑静态按钮
        editstatic(){
          this.editFormVisible=true;
          if(this.paramsName=='only'){
            this.title='静态数据';
          }
        },
        //添加数据
        addparams(){
          this.$refs.listtabform.validate(async(valid) => {
            if (valid) {
              const result=await this.$http.post(`categories/${this.catid}/attributes`,this.listtabform);
              if(result.data.meta.status==201) {
                this.$message.success('成功');
                this.getparams();
                this.dialogFormVisible=false
              }else{
                this.$message.error('添加失败')
              }
            }else {
              return false
            }
          });
        },
        //删除
        deleteparams(row){
          this.$confirm('此操作将永久删除, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(async() => {
            const result=await this.$http.delete(`categories/${row.cat_id}/attributes/${row.attr_id}`);
            if(result.data.meta.status==200) {
              this.$message.success('成功');
              this.getparams();
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
        editinfo(scope){
          this.editFormVisible=true;
          if(this.paramsName=='many'){
            this.title='动态数据';

          }else{
            this.title='静态数据';
          }
          this.edittabform.attr_id=scope.attr_id;
          this.edittabform.attr_name=scope.attr_name;
          this.edittabform.attr_sel=scope.attr_sel;
          this.edittabform.attr_vals=scope.attr_vals.toString();
        },
        //编辑数据
        editparams(attrid){
          this.$refs.edittabform.validate(async(valid) => {
            if (valid) {
              const result=await this.$http.put(`categories/${this.catid}/attributes/${attrid}`,this.edittabform);
              if(result.data.meta.status==200) {
                this.$message.success('成功');
                this.getparams();
                this.editFormVisible=false
              }else{
                this.$message.error('失败')
              }
            }else {
              return false
            }
          });
        },
        //切换input框
        showInput(scope) {
          scope.inputVisible = true;
          this.$nextTick(_ => {
            this.$refs.saveTagInput.$refs.input.focus();
          });
        },
        //修改选项数据
        async handleInputConfirm(scope) {
          if(scope.inputValue!==''){
            scope.attr_vals.push(scope.inputValue.trim());
            const result=await this.$http.put(`categories/${scope.cat_id}/attributes/${scope.attr_id}`,{attr_name:scope.attr_name,attr_sel:scope.attr_sel,attr_vals:scope.attr_vals.join(',')});
            if(result.data.meta.status==200) {
              scope.inputVisible = false;
              scope.inputValue = '';
              this.$message.success('成功');
            }else{
              this.$message.error('失败')
            }
          }else{
            scope.inputVisible = false;
            scope.inputValue = '';
            return
          }
        },
        //删除选项
        handleClose(i,scope){
          scope.attr_vals.splice(i,1);
          this.handleInputConfirm(scope)
        }
      }
    }
</script>

<style scoped>
.el-cascader{
  margin: 20px 0;
}
  .demonstration{
    margin-right: 10px;
  }
  .el-tab-pane{
    line-height: 20px;
  }
  .el-input{
    width: 200px;
  }
  .el-tag{
   margin: 0 5px;
  }
</style>
