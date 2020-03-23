<template>
    <div>
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>商品管理</el-breadcrumb-item>
        <el-breadcrumb-item>商品编辑</el-breadcrumb-item>
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
        <el-form :model="editForm" :rules="rules" ref="editForm" label-width="100px" class="demo-ruleForm" label-position="top">
          <el-tabs tab-position="left" calss="tabs" v-model="activeIndex"  @tab-click="getcatelist">
            <el-tab-pane label="基本信息" name="0">
              <el-form-item label="商品名称" prop="goods_name">
                <el-input v-model="editForm.goods_name"></el-input>
              </el-form-item>
              <el-form-item label="商品价格" prop="goods_price">
                <el-input v-model="editForm.goods_price" type="number"></el-input>
              </el-form-item>
              <el-form-item label="商品数量" prop="goods_number">
                <el-input v-model="editForm.goods_number" type="number"></el-input>
              </el-form-item>
              <el-form-item label="商品重量" prop="goods_weight">
                <el-input v-model="editForm.goods_weight" type="number"></el-input>
              </el-form-item>
            </el-tab-pane>
            <el-tab-pane label="商品参数" name="1">
              <el-form-item :label="item.attr_name"  v-for="(item,i) in dynlist" :key="i">
                <el-checkbox-group v-model="item.attr_vals">
                  <el-checkbox :label="item1" v-for="(item1,k) in item.attr_vals" :key="k" border class="checkbox"></el-checkbox>
                </el-checkbox-group>
              </el-form-item>
            </el-tab-pane>
            <el-tab-pane label="商品属性" name="2">
              <el-form-item :label="item.attr_name"  v-for="(item,m) in staticlist" :key="m">
                <el-input v-model="item.attr_vals" ></el-input>
              </el-form-item>
            </el-tab-pane>
            <el-tab-pane label="商品图片" name="3">
              <el-upload class="upload-demo" :action="uploadURL" :on-preview="handlePreview" :on-remove="handleRemove" list-type="picture" :headers="headerObj"  :on-success="success"  :file-list="filelist">
                <el-button size="small" type="primary">点击上传</el-button>
                <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
              </el-upload>
            </el-tab-pane>
            <el-tab-pane label="商品内容" name="4">
              <quill-editor v-model="editForm.goods_introduce"/>
              <el-button type="primary" @click="add">编辑商品</el-button>
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
         editForm:{
           goods_name:'',
           goods_price:0,
           goods_number:0,
           goods_weight:0,
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
           ]
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
         filelist: [
           {
             name: 'food.jpeg',
             url: 'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100'},
           {
             name: 'food2.jpeg',
             url: 'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100'}
         ]
       }
      },
      created(){
        this.goodslist();
      },
      methods:{
        //查询数据
        async goodslist(){
          const result=await this.$http.get('goods/'+this.catId);
          if(result.data.meta.status==200){
            this.editForm=result.data.data;
          }else{
            this.$message.error('获取失败,请先选择商品');
            this.$router.push('/goods')
          }
        },

        async getcatelist(){
          //获取动态属性
          if(this.activeIndex=='1'){
            const result=await this.$http.get('goods/'+this.catId);
            if(result.data.meta.status==200){
              const sub=result.data.data.attrs.filter(item=>{
                return item.attr_sel==='many'
              })
              sub.forEach(item=>{
                item.attr_vals=item.attr_vals.length==0?[]:item.attr_vals.split(',')
              })
              this.dynlist=sub;
            }else{
              this.$message.error('失败')
            }
          }
          //获取静态属性
          if(this.activeIndex=='2'){
            const result=await this.$http.get('goods/'+this.catId);
            if(result.data.meta.status==200){
              const sub=result.data.data.attrs.filter(item=>{
                return item.attr_sel==='only'
              })
              this.staticlist=sub;
            }else{
              this.$message.error('失败')
            }
          }

          if(this.activeIndex=='3'){
            const pics=await this.$http.put(`goods/${this.catId}/pics`);
            console.log(pics)
          }

        },

        //移除图片
        handleRemove(file, filelist) {
          var lspic=file.response.data.tmp_path;
          const i=this.editForm.pics.findIndex(x=> x.pic==lspic);
          this.editForm.pics.splice(i,1)
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
          this.editForm.pics.push(picadd);
          console.log(this.editForm.pics)
        },
        add(){
          this.$refs.editForm.validate(async(valid) => {
            if (valid) {
              //深拷贝lodash  cloneDeep(obj)
             const deep =_.cloneDeep(this.editForm);
              this.dynlist.forEach(item=>{
                const dynobj={
                  attr_id:item.attr_id,
                  attr_value:item.attr_vals.join(' ')
                }
                deep.attrs.push(dynobj)
              })

              this.staticlist.forEach(item=>{
                const staticobj={
                  attr_id:item.attr_id,
                  attr_value:item.attr_vals
                }
                deep.attrs.push(staticobj)
              });

              deep.attrs = this.editForm.attrs

              const result=await this.$http.put('goods/'+this.catId,deep);
              if(result.data.meta.status==200){
                this.$message.success('成功');
                this.$router.push('/goods')
              }else{
                this.$message.error('失败1')
              }
            } else {
              this.$message.error('失败2')
            }
          });
        }
      },
      computed:{
        catId(){
          return this.$route.params.goodid
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
