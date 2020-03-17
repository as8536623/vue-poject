<template>
    <div>
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>权限管理</el-breadcrumb-item>
        <el-breadcrumb-item>角色列表</el-breadcrumb-item>
      </el-breadcrumb>
      <el-card>
        <el-col :span="2">
          <el-button type="primary" @click="addFormVisible = true">添加角色</el-button>
          <el-dialog title="添加角色" :visible.sync="addFormVisible" @close="resetForm">
            <el-form :model="addform"  ref="addform" :rules="rules">
              <el-form-item label="用户名" prop="roleName">
                <el-input v-model="addform.roleName"></el-input>
              </el-form-item>
              <el-form-item label="描述" prop="roleDesc">
                <el-input v-model="addform.roleDesc"></el-input>
              </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
              <el-button @click="addFormVisible = false">取 消</el-button>
              <el-button type="primary" @click="addrole">确 定</el-button>
            </div>
          </el-dialog>
          <el-dialog title="修改用户" :visible.sync="editFormVisible">
            <el-form :model="editform" :rules="editrules" ref="editform">
              <el-form-item label="角色名" prop="roleName">
                <el-input v-model="editform.roleName"></el-input>
              </el-form-item>
              <el-form-item label="角色描述" prop="roleDesc">
                <el-input v-model="editform.roleDesc"></el-input>
              </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
              <el-button type="primary" @click="editInfo(editform.id)">确 定</el-button>
            </div>
          </el-dialog >
          <el-dialog title="分配权限" :visible.sync="powerFormVisible" @close="powerresetForm">
            <el-tree :data="poweright" :props="treeprops" show-checkbox node-key="id" default-expand-all	:default-checked-keys="keys" ref="trees"></el-tree>
            <div slot="footer" class="dialog-footer">
              <el-button @click="powerFormVisible = false">取 消</el-button>
              <el-button type="primary" @click="getpower">确 定</el-button>
            </div>
          </el-dialog>
        </el-col>
        <el-table :data="list" border stripe>
          <el-table-column type="expand">
            <template slot-scope="scope">
              <el-row v-for="(item1,index1) in scope.row.children" :key="index1.id" :class="['bdbottom', index1 === 0 ? 'bdtop' : '', 'vcenter']">
                <el-col :span="4">
                  <el-tag closable @close="delectPower(scope.row.id,item1.id)">
                    {{item1.authName}}
                  </el-tag>
                  <i :class="[item1.children.length == 0 ? 'hidden' : 'el-icon-caret-right']"></i>
                </el-col>
                <el-col :span="19">
                  <el-row v-for="(item2, index2) in item1.children" :key="index2.id" :class="[index2 === 0 ? '' : 'bdtop', 'vcenter']">
                    <el-col :span="6">
                      <el-tag type="success" closable @close="delectPower(scope.row.id,item2.id)">{{item2.authName}}</el-tag>
                      <i :class="[item2.children.length == 0 ? 'hidden' : 'el-icon-caret-right']"></i>
                    </el-col>
                    <el-col :span="18">
                      <el-tag type="warning" v-for="(item3, index3) in item2.children" :key="index3.id" closable @close="delectPower(scope.row.id,item3.id)">{{item3.authName}}</el-tag>
                    </el-col>
                  </el-row>
                </el-col>
              </el-row>
            </template>
          </el-table-column>
          <el-table-column type="index" label="#"></el-table-column>
          <el-table-column prop="roleName" label="角色名称" width="500px"></el-table-column>
          <el-table-column prop="roleDesc" label="角色描述" width="500px"></el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-tooltip class="item" effect="dark" content="修改角色信息" placement="top-start" :enterable="false">
                <el-button type="primary" icon="el-icon-edit" @click="editrole(scope.row)"></el-button>
              </el-tooltip>
              <el-tooltip class="item" effect="dark" content="分配权限" placement="top-start" :enterable="false">
                <el-button type="success" icon="el-icon-setting" @click="poweRole(scope.row)"></el-button>
              </el-tooltip>
              <el-tooltip class="item" effect="dark" content="删除用户" placement="top-start" :enterable="false">
                <el-button type="danger" icon="el-icon-delete" @click="deleterole(scope.row.id)"></el-button>
              </el-tooltip>
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
          item1:[],
          rolepowerlist:[],
          addFormVisible: false,
          editFormVisible:false,
          powerFormVisible:false,
          addform: {
            roleName: '',
            roleDesc:'',
          },
          editform: [],
          rules: {
            roleName: [
              { required: true, message: '请输入角色名', trigger: 'blur' },
              { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
            ],
            roleDesc:[
              { required: true, message: '请输入角色描述', trigger: 'blur' },
              { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
            ]
          },
          editrules: {
            roleName: [
              { required: true, message: '请输入角色名', trigger: 'blur' },
              { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
            ],
            roleDesc:[
              { required: true, message: '请输入角色描述', trigger: 'blur' },
              { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
            ]
          },
          powerole:'',
          poweright:[],
          powerid:'',
          treeprops: {
            label: 'authName',
            children: 'children'
          },
          keys:[]
        }
      },
      created(){
        //加载角色列表
        this.getList();
      },
      methods:{
        //获取角色列表
        async getList(){
          const result=await this.$http.get('roles');
          if (result.data.meta.status== 200) {
            this.list=result.data.data;
          }else{
            this.$message.error('获取失败');
          }
        },
        //取消按钮 清空数据
        resetForm() {
          this.$refs.addform.resetFields();
        },
        //下拉删除权限
        delectPower(pid,id) {
          this.$confirm('此操作将永久删除该权限, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(async() => {
            const result=await this.$http.delete(`roles/${pid}/rights/${id}`);
            if (result.data.meta.status== 200) {
              this.rolepowerlist=result.data.data;
              this.$message.success('删除成功');
              this.getList();
            }
          }).catch(() => {
            this.$message.error('删除失败');
          });
        },
        //添加角色
       async addrole(){
         const result=await this.$http.post('roles',this.addform);
         if (result.data.meta.status== 201) {
           this.$message.success('添加成功');
           this.addFormVisible=false;
           this.getList();
         }else{
           this.$message.error('添加失败');
         }
        },
        //获取修改角色信息
        editrole(roles){
          this.editform=roles;
          this.editFormVisible=true
        },
        //修改角色信息
        async editInfo(id){
          const result=await this.$http.put('roles/'+id,this.editform);
          if (result.data.meta.status== 200) {
            this.$message.success('修改成功');
            this.editFormVisible=false;
            this.getList();
          }else{
            this.$message.error('修改失败');
          }
        },
        //删除角色
        deleterole(id) {
          this.$confirm('此操作将永久删除该角色, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(async() => {
            const result=await this.$http.delete('roles/'+id);
            if (result.data.meta.status== 200) {
              this.$message.success('删除成功');
              this.getList();
            }
          }).catch(() => {
            this.$message.error('删除失败');
          });
        },
        //查询角色拥有的权限
       async poweRole(roles){
         this.powerid=roles.id;
         const list=await this.$http.get(`rights/tree`);
         if (list.data.meta.status !== 200) {
           return this.$message.error('获取权限失败！')
         }
         this.poweright=list.data.data;
         this.getdekeys(roles,this.keys);
         this.powerFormVisible=true
        },
        getdekeys(node,arr){
          if(!node.children){
            return arr.push(node.id)
          }
          node.children.forEach(item=>{
            this.getdekeys(item,arr)
          })
        },
        powerresetForm() {
          this.keys=[];
        },
        async getpower(){
          const a=this.$refs.trees.getCheckedKeys();
          const b=this.$refs.trees.getHalfCheckedKeys()
          const c=a.concat(b);
          const keyStr=c.toString();
          const result=await this.$http.post(`roles/${this.powerid}/rights`,{rids:keyStr});
          if(result.data.meta.status==200){
            this.$message.success('更新权限成功！')
          }else{
            this.$message.error('更新权限失败！')
          }
          this.getList();
          this.powerFormVisible=false;
        }
      }
    }
</script>

<style scoped>
  .el-col-2{
    margin-bottom: 10px;
  }
  .el-card{
    margin-top: 20px;
    line-height: 20px;

  }

  .el-table{
    margin-top: 20px;
  }
  .el-tag {
    margin: 7px;
  }

  .bdtop {
    border-top: 1px solid #eee;
  }

  .bdbottom {
    border-bottom: 1px solid #eee;
  }

  .vcenter {
    display: flex;
    align-items: center;
  }
  .hidden{
    display: none;
  }
</style>
