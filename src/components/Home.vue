<template>
  <div>
    <el-button @click="singout">退出</el-button>
  </div>
</template>

<script>
  export default {
    methods:{
      singout(){
        window.sessionStorage.clear();
        this.$router.push('/login')
      }
    }
  }
</script>

<style scoped lang="less">
  .button{
    width:50px;
    height: 50px;
    background-color: #00a0d2;
  }
</style>
