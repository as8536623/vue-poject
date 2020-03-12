<template>
  <div class="login">
    <div class="login-box">
      <div class="icon-box">
        <img src="../assets/logo.png">
      </div>
      <el-form label-width="0px" class="info-box" :model="loginForm" :rules="rules" ref="rulesform">
        <el-form-item prop="name">
          <el-input prefix-icon="iconfont icon-morentouxiang" v-model="loginForm.username" ></el-input>
        </el-form-item>
        <el-form-item prop="pwd">
          <el-input prefix-icon="iconfont icon-3702mima" v-model="loginForm.password" type="password"></el-input>
        </el-form-item>
        <el-form-item class="btn">
          <el-button type="primary" @click="submitForm">登录</el-button>
          <el-button type="info" @click="resetForm">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
  export default {
    data(){
      return{
        loginForm:{
          username:'admin',
          password:'123456'
        },
        rules: {
          username: [
            { required: true, message: '请输入用户名', trigger: 'blur' },
            { min: 2, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
          ],
          password: [
            { required: true, message: '请输入密码', trigger: 'blur' },
            { min: 3, max: 10, message: '长度在 3 到 5 个字符', trigger: 'blur' }
          ]
        }
      }
    },
    methods:{
      resetForm() {
        this.$refs.rulesform.resetFields();
      },
      submitForm() {
        this.$refs.rulesform.validate(async (valid) => {
          if (valid) {
            const result=await this.$http.post('login',this.loginForm);
            if(result.data.meta.status==200){
              this.$message.success('登录成功');
              window.sessionStorage.setItem('token',result.data.data.token);
              this.$router.push('/home')
            }else{
              this.$message.error('登陆失败');
            }
          }
        });
      },
    }


  }
</script>

<style scoped lang="less">
  .login{
    background-color: #0A246A;
    height:100%
  }
  .login-box{
    background-color: #ffffff;
    width: 450px;
    height: 300px;
    position: absolute;
    border-radius: 3px;
    left: 50%;
    top:50%;
    transform: translate(-50%,-50%);
    .icon-box{
      width: 130px;
      height: 130px;
      border:1px solid #eee;
      border-radius: 50%;
      position: absolute;
      box-shadow: 0 0 10px #eee;
      left: 50%;
      transform: translate(-50%,-50%);
      padding: 5px;
      background-color: #ffffff;
      img{
        width: 100%;
        height: 100%;
        border-radius: 50%;
        background-color: #eee;

      }
    }
    .info-box{
      position: absolute;
      width: 100%;
      bottom: 0;
      padding: 0 20px;
      box-sizing: border-box;
    }
    .btn{
      display: flex;
      justify-content: flex-end;
    }
  }


</style>
