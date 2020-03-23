<template>
    <div>
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>商品管理</el-breadcrumb-item>
        <el-breadcrumb-item>商品添加</el-breadcrumb-item>
      </el-breadcrumb>
      <el-card class="box-card">
        <el-alert title="消息提示的文案" type="info" show-icon center class="alert"></el-alert>
        <el-steps :active="activeIndex-0" align-center class="steps">
          <el-step title="基本信息"></el-step>
          <el-step title="商品参数"></el-step>
          <el-step title="商品属性"></el-step>
          <el-step title="商品图片"></el-step>
          <el-step title="商品内容"></el-step>
          <el-step title="完成"></el-step>
        </el-steps>
        <el-form :model="addForm" :rules="rules" ref="addForm" label-width="100px" class="demo-ruleForm" label-position="top">
          <el-tabs tab-position="left" calss="tabs" v-model="activeIndex" :before-leave="beforeLeave" @tab-click="getcatelist">
            <el-tab-pane label="基本信息" name="0">
              <el-form-item label="商品名称" prop="goods_name">
                <el-input v-model="addForm.goods_name"></el-input>
              </el-form-item>
              <el-form-item label="商品价格" prop="goods_price">
                <el-input v-model="addForm.goods_price" type="number"></el-input>
              </el-form-item>
              <el-form-item label="商品数量" prop="goods_number">
                <el-input v-model="addForm.goods_number" type="number"></el-input>
              </el-form-item>
              <el-form-item label="商品重量" prop="goods_weight">
                <el-input v-model="addForm.goods_weight" type="number"></el-input>
              </el-form-item>
              <el-form-item label="商品分类" prop="goods_cat">
                <el-cascader v-model="catekeys" :options="cateoptions" :props="cateprops" @change="handleChange" clearable blur></el-cascader>
              </el-form-item>
            </el-tab-pane>
            <el-tab-pane label="商品参数" name="1">
              <el-form-item :label="item.attr_name"  v-for="item in dynlist" :key="item.attr_id">
                <el-checkbox-group v-model="item.attr_vals">
                  <el-checkbox :label="item1" v-for="(item1,k) in item.attr_vals" :key="k" border class="checkbox"></el-checkbox>
                </el-checkbox-group>
              </el-form-item>
            </el-tab-pane>
            <el-tab-pane label="商品属性" name="2">
              <el-form-item :label="item.attr_name"  v-for="item in staticlist" :key="item.attr_id">
                <el-input v-model="item.attr_vals" ></el-input>
              </el-form-item>
            </el-tab-pane>
            <el-tab-pane label="商品图片" name="3">
              <el-upload class="upload-demo" :action="uploadURL" :on-preview="handlePreview" :on-remove="handleRemove" list-type="picture" :headers="headerObj" :on-success="success">
                <el-button size="small" type="primary">点击上传</el-button>
                <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
              </el-upload>
            </el-tab-pane>
            <el-tab-pane label="商品内容" name="4">
              <quill-editor v-model="addForm.goods_introduce"/>
              <el-button type="primary" @click="add">添加商品</el-button>
            </el-tab-pane>
          </el-tabs>

        </el-form>
      </el-card>
      <el-dialog title="提示" :visible.sync="dialogVisible" width="30%">
        <div >
        <img :src="Preview" alt="" width="100%">
        </div>
      </el-dialog>

    </div>
</template>

<script>
  import _ from 'lodash'
    export default {
      data(){
       return {
         //tabs name接受的是string类型  步骤条接受的是number类型 转换下
         activeIndex:'0',
         //添加表单项
         addForm:{
           goods_name:'',
           goods_price:0,
           goods_number:0,
           goods_weight:0,
           goods_cat:[],
           pics:[],
           goods_introduce:'',
           attrs:[],
         },
         //验证信息
         rules: {
           goods_name: [
             { required: true, message: '请输入商品名称', trigger: 'blur' },
             { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
           ],
           goods_price: [
             { required: true, message: '请输入商品价格', trigger: 'blur' },
           ],
           goods_number: [
             { required: true, message: '请输入商品数量', trigger: 'blur' },
           ],
           goods_weight: [
             { required: true, message: '请输入商品重量', trigger: 'blur' },
           ],
           goods_cat : [
             { type: 'array', required: true, message: '请选择商品分类', trigger: 'blur' }
           ]
         },
         //分类列表
         catekeys:[],
         cateoptions:[],
         cateprops:{
           value:'cat_id',
           label:'cat_name',
           children:'children',
           expandTrigger:'hover',
         },
         //动态属性
         dynlist:[],
         //静态属性
         staticlist:[],
         //上传图片地址
         uploadURL:'http://127.0.0.1:8888/api/private/v1/upload',
         headerObj: {
           Authorization: window.sessionStorage.getItem('token')
         },
         Preview:'',
         dialogVisible:false,
       }
      },
      created(){
        this.cateslist();
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
        handleChange(value){
          if(value.length!==3){
            this.addForm.goods_cat=[]
            return false
          }else{
            this.addForm.goods_cat=value
          }
        },
        //tabs阻断条件
        beforeLeave(activeName, oldActiveName){
          if(oldActiveName=='0'&&this.addForm.goods_cat.length!==3){
            this.$message.error('请选择分类');
            return false;
          }
        },
        async getcatelist(){
          //获取动态属性
          if(this.activeIndex=='1'){
            const result=await this.$http.get('categories/'+this.catId+'/attributes',{params:{sel:'many'}});
            if(result.data.meta.status==200){
              result.data.data.forEach(item=>{
                item.attr_vals=item.attr_vals.length==0?[]:item.attr_vals.split(',')
              })
              this.dynlist=result.data.data;
            }else{
              this.$message.error('失败')
            }
          }
          //获取静态属性
          if(this.activeIndex=='2'){
            const result=await this.$http.get('categories/'+this.catId+'/attributes',{params:{sel:'only'}});
            if(result.data.meta.status==200){
              this.staticlist=result.data.data;
            }
          }
        },
        //移除图片
        handleRemove(file, fileList) {
          var lspic=file.response.data.tmp_path;
          const i=this.addForm.pics.findIndex(x=> x.pic==lspic);
          this.addForm.pics.splice(i,1)
        },
        //预览图片
        handlePreview(file) {
          this.Preview=file.response.data.url;
          this.dialogVisible=true
        },
        //上传成功
        success(response){
          var picadd={
            pic:response.data.tmp_path
          }
          this.addForm.pics.push(picadd);
        },
        add(){
          this.$refs.addForm.validate(async(valid) => {
            if (valid) {
              //深拷贝lodash  cloneDeep(obj)
             const deep =_.cloneDeep(this.addForm);
              deep.goods_cat=deep.goods_cat.join(',');
              //处理动态数据
              this.dynlist.forEach(item => {
                const newInfo = {
                  attr_id: item.attr_id,
                  attr_value: item.attr_vals.join(' ')
                }
                deep.attrs.push(newInfo)
              })
              // 处理静态属性
              this.staticlist.forEach(item => {
                const newInfo = {
                  attr_id: item.attr_id,
                  attr_value: item.attr_vals
                }
                this.addForm.attrs.push(newInfo)
              })

              deep.attrs = this.addForm.attrs
              const result= await this.$http.post('goods', deep)

              if (result.data.meta.status == 201) {
                this.$message.success('添加商品成功！')
                this.$router.push('/goods')
              }else{
                return this.$message.error('添加商品失败！')
              }

            } else {
              this.$message.error('失败')
            }
          });
        }
      },
      computed:{
        catId(){
          if(this.addForm.goods_cat.length===3){
            return this.addForm.goods_cat[2]
          }
          return null
        }
      }
    }
</script>

<style scoped>
  .el-card{
    margin-top: 20px;
    height:100%
  }
  .alert{
    font-size: 15px;
    padding: 20px 0;
  }
  .steps{
    margin:20px 0 ;
  }
  .el-tab-pane{
    line-height: 40px;
  }
  .el-input{
    width: 30%;
  }
  .quill-editor{
    display: inline-block;
   height: 200px;
  }

</style>
