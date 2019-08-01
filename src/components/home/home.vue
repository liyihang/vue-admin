<template>
  <el-container class="home-container">
    <!-- header -->
    <el-header class="home-header">
      <div class="home-logo">
        <img src="../../assets/logo.png" alt />
        <span class="home-title">通用后台管理系统</span>
      </div>
      <img
        class="home-logout"
        @click="logout"
        src="https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif?imageView2/1/w/80/h/80"
        alt
      />
    </el-header>
    <el-container>
      <!-- sidebar -->
      <el-aside class="home-side" width="200px">Aside</el-aside>
      <!-- main -->
      <el-main class="home-main">Main</el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {

  methods: {
    // logout method
    logout () {
      window.sessionStorage.clear()
      this.$router.push('/login')
    }
  },
}
</script>

<style lang="less" scoped>
.home-container {
  height: 100%;
  .home-header {
    height: 60px;
    background-color: #021124;
    display: flex;
    justify-content: space-between;
    padding: 0;
    align-items: center;
    img {
      height: 50px;
      width: 50px;
      margin-right: 10px;
    }
    .home-logo {
      display: flex;
      align-items: center;
      color: #fff;
      font-size: 20px;
    }
    .home-logout {
      margin-right: 50px;
    }
  }
  .home-side {
    background-color: #304156;
    color: #bfcbd9;
  }
  .home-main {
    background-color: #eee;
  }
}
</style>
