<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-row :gutter="20">
        <el-col :span="7">
          <el-input placeholder="请输入内容" v-model="queryInfo.query"  clearable @clear="userlist">
            <el-button slot="append" icon="el-icon-search" @click="userlist" ></el-button>
          </el-input>
        </el-col>
        <el-col :span="2">
          <el-button type="primary" @click="addFormVisible = true">添加用户</el-button>
          <el-dialog title="添加用户" :visible.sync="addFormVisible" @close="resetForm">
            <el-form :model="addform" :rules="userules" ref="addform">
              <el-form-item label="用户名" prop="username">
                <el-input v-model="addform.username"></el-input>
              </el-form-item>
              <el-form-item label="密码" prop="password">
                <el-input v-model="addform.password"></el-input>
              </el-form-item>
              <el-form-item label="邮箱" prop="email">
                <el-input v-model="addform.email"></el-input>
              </el-form-item>
              <el-form-item label="手机" prop="mobile">
                <el-input v-model="addform.mobile"></el-input>
              </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
              <el-button @click="addFormVisible = false">取 消</el-button>
              <el-button type="primary" @click="addUser" >确 定</el-button>
            </div>
          </el-dialog>
          <el-dialog title="修改用户" :visible.sync="editFormVisible" @close="editresetForm">
            <el-form :model="editform" :rules="editrules" ref="editform">
              <el-form-item label="用户名" prop="username">
                <el-input v-model="editform.username" disabled></el-input>
              </el-form-item>
              <el-form-item label="邮箱" prop="email">
                <el-input v-model="editform.email"></el-input>
              </el-form-item>
              <el-form-item label="手机" prop="mobile">
                <el-input v-model="editform.mobile"></el-input>
              </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
              <el-button @click="editFormVisible = false">取 消</el-button>
              <el-button type="primary" @click="editInfo(editform.id)">确 定</el-button>
            </div>
          </el-dialog>
          <el-dialog title="权限分配用户" :visible.sync="powerFormVisible">
            <el-form>
              <p>当前用户：{{poweruser.username}}</p>
              <p>当前角色：{{poweruser.role_name}}</p>
              <el-form-item label="选择角色：">
                <el-select v-model="value" placeholder="请选择">
                  <el-option v-for="item in roles" :key="item.id" :label="item.roleName" :value="item.id">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
              <el-button @click="powerk">取 消</el-button>
              <el-button type="primary" @click="powerUser">确 定</el-button>
            </div>
          </el-dialog>
        </el-col>
      </el-row>
      <el-table :data="list" border stripe>
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column prop="username" label="姓名" width="120"></el-table-column>
        <el-table-column prop="mobile" label="手机" width="120"></el-table-column>
        <el-table-column prop="email" label="邮箱" width="120"></el-table-column>
        <el-table-column prop="role_name" label="权限" width="120"></el-table-column>
        <el-table-column prop="mg_state" label="状态" width="120">
          <template slot-scope="scope">
            <el-switch v-model="scope.row.mg_state" @change="statueChange(scope.row)" active-color="#13ce66" inactive-color="#ff4949"></el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-tooltip class="item" effect="dark" content="修改用户信息" placement="top-start" :enterable="false">
              <el-button type="primary" icon="el-icon-edit" @click="editUser(scope.row.id)"></el-button>
            </el-tooltip>
            <el-tooltip class="item" effect="dark" content="分配权限" placement="top-start" :enterable="false">
              <el-button type="success" icon="el-icon-setting" @click="powerInfo(scope.row)" ></el-button>
            </el-tooltip>
            <el-tooltip class="item" effect="dark" content="删除用户" placement="top-start" :enterable="false">
              <el-button type="danger" icon="el-icon-delete" @click="open(scope.row)" ></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[1, 2, 3, 5]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total">
      </el-pagination>
    </el-card>
  </div>

</template>

<script>
    export default {
      data(){
        var checkPhone = (rule, value, callback) => {
          const phoneReg = /^1[3|4|5|6|7|8][0-9]{9}$/
          if (!value) {
            return callback(new Error('电话号码不能为空'))
          }
          setTimeout(() => {
            if (!Number.isInteger(+value)) {
              callback(new Error('请输入数字值'))
            } else {
              if (phoneReg.test(value)) {
                callback()
              } else {
                callback(new Error('电话号码格式不正确'))
              }
            }
          }, 100)
        };
        return{
          list:[],
          queryInfo:{
            query:'',
            pagenum:1,
            pagesize:2
          },
          total:0,
          addFormVisible: false,
          editFormVisible: false,
          powerFormVisible:false,
          addform: {
            username: '',
            password:'',
            mobile: '',
            email: '',

          },
          editform: {},
          power:[{
            powername:'超级管理员',
            rid:1
          },{
            powername:'中级管理员',
            rid:2
            },{
            powername:'低级管理员',
            rid:3
          }],
          radio:1,
          poweruser:'',
          roles:'',
          value:'',
          editrules: {
            username: [
              { required: true, message: '请输入用户名', trigger: 'blur' },
              { min: 2, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
            ],
            email:[
              { required: true, message: '请输入邮箱地址', trigger: 'blur' },
              { type: 'email', message: '请输入正确的邮箱地址', trigger: ['blur', 'change'] }
            ],
            mobile:[
              {required: true, validator: checkPhone, trigger: 'blur' }
            ]
          },
          userules: {
            username: [
              { required: true, message: '请输入用户名', trigger: 'blur' },
              { min: 2, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
            ],
            password: [
              { required: true, message: '请输入密码', trigger: 'blur' },
              { min: 3, max: 10, message: '长度在 3 到 5 个字符', trigger: 'blur' }
            ],
            email:[
              { required: true, message: '请输入邮箱地址', trigger: 'blur' },
              { type: 'email', message: '请输入正确的邮箱地址', trigger: ['blur', 'change'] }
            ],
            mobile:[
              {required: true, validator: checkPhone, trigger: 'blur' }
            ]
          }
        }
      },
      created() {
        this.userlist();
      },
      methods: {
        async userlist() {
          const users = await this.$http.get('users', {params: this.queryInfo});
          if (users.data.meta.status !== 200) return this.$message.error('数据获取失败')
          this.list = users.data.data.users;
          this.total = users.data.data.total

        },
        handleSizeChange(val) {
          this.queryInfo.pagesize = val;
          this.userlist()
        },
        handleCurrentChange(val) {
          this.queryInfo.pagenum = val;
          this.userlist()
        },
        async statueChange(userInfo) {
          const data = await this.$http.put(`users/${userInfo.id}/state/${userInfo.mg_state}`);
          if (data.data.meta.status !== 200) {
            userInfo.mg_state != userInfo.mg_state;
            this.$message.error('更新用户身份失败')
          } else {
            userInfo.mg_state = userInfo.mg_state;
            this.$message.success('更新用户身份成功')
          }
        },
        editresetForm() {
          this.$refs.editform.resetFields();
        },
        resetForm() {
          this.$refs.addform.resetFields();
        },
        addUser() {
          this.$refs.addform.validate(async (valid) => {
            if (valid) {
              const result = await this.$http.post('users', this.addform);
              if (result.data.meta.status == 201) {
                this.$message.success('添加用户成功');
                this.addFormVisible = false;
                this.userlist();
              } else {
                this.$message.error('添加用户失败');
              }
            }
          });
        },
        open(scope) {
          this.$confirm('此操作将永久删除用户, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(async () => {
            const result = await this.$http.delete(`users/${scope.id}`);
            if (result.data.meta.status == 200) {
              this.$message.success('成功');
              this.userlist();
            } else {
              this.$message.error('失败');
            }
          }).catch(() => {
            this.$message({
              type: 'info',
              message: '已取消删除'
            });
          });
        },
        async editUser(id) {
          const result = await this.$http.get('users/' + id)
          if (result.data.meta.status == 200) {
            this.userlist();
          } else {
            this.$message.error('查询失败');
          }
          this.editform = result.data.data;
          this.editFormVisible = true;
        },
        editInfo(id) {
          this.$refs.editform.validate(async (valid) => {
            if (valid) {
              const result = await this.$http.put('users/' + id, this.editform);
              if (result.data.meta.status == 200) {
                this.$message.success('用户信息修改成功');
                this.editFormVisible = false;
                this.userlist();
              } else {
                this.$message.error('用户信息修改失败');
              }
            }
          });
        },
        async powerInfo(poweruser){
          this.powerFormVisible = true;
          this.poweruser=poweruser;
          const result = await this.$http.get('roles');
          if (result.data.meta.status == 200) {
            this.roles=result.data.data
          }else{
            return false
          }
        },
        async powerUser(){
          const result = await this.$http.put(`users/${this.poweruser.id}/role`,{rid:this.value} );
          console.log(result)
          if (result.data.meta.status== 200 && this.value!='') {
            this.$message.success('分配成功');
            this.powerFormVisible = false;
            this.userlist();
          } else if(this.poweruser.id== 500){
            this.$message.error('不能修改系统用户');
          }else{
            this.$message.error('分配失败');
          }
        },
        powerk(){
          this.powerFormVisible = false;
          this.value='';
        }
      }
    }
</script>

<style scoped lang="less">
  .el-form{
    width:35%;

  }
.el-card{
  margin-top: 20px;
  line-height: 0;

}
.el-table{
  margin-top: 20px;
}
  p{
    width: 100%;
   float: left;
    text-align: left;
    padding-bottom: 20px;
    font-size:15px
  }
</style>
