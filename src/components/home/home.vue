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
        title="退出"
        src="https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif?imageView2/1/w/80/h/80"
        alt
      />
    </el-header>
    <el-container>
      <!-- sidebar -->
      <el-aside class="home-side" :width="collapse?'64px':'200px'">
        <!-- 折叠菜单 -->
        <div class="toggle-bar" @click="collapse=!collapse">|||</div>
        <el-menu
          default-active="2"
          class="el-menu-vertical-demo"
          background-color="#304156"
          text-color="#fff"
          active-text-color="#ffd04b"
          :unique-opened="true"
          :collapse="collapse"
          :collapse-transition="false"
          :router ="true"
        >
          <el-submenu
            :index="items.id+''"
            v-for="(items,index) in menuList"
            :key="items.id"
            :style="collapse?'width:64px':'width:200px'"
          >
            <template slot="title">
              <i :class="icons[index]"></i>
              <span>{{items.authName}}</span>
            </template>
            <el-menu-item
              :index="'/'+item.path"
              v-for="item in items.children"
              :key="item.id"
            >{{item.authName}}</el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <!-- main -->
      <el-main class="home-main">
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  data () {
    return {
      menuList: [],
      // icon deal
      icons: ['el-icon-user', 'el-icon-lock', 'el-icon-s-goods', 'el-icon-s-order', 'el-icon-s-data'],
      collapse: false
    }
  },
  methods: {
    // logout method
    logout () {
      window.sessionStorage.clear()
      this.$router.push('/login')
    },
    async getMenuList () {
      const { data: res } = await this.$http.get('menus')
      if (res.meta.status !== 200) return this.$message.error('获取左侧菜单栏失败！')
      this.menuList = res.data
    }
  },
  created () {
    this.getMenuList()
  }
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
  .toggle-bar {
    line-height: 30px;
    text-align: center;
    color: white;
    user-select: none;
    cursor: pointer;
    letter-spacing: 0.1rem;
  }
}
</style>
