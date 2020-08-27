<template>
  <el-container class="home-container">
    <!-- 头部区域 -->
    <el-header>
      <div>
        <img src="../assets/heima.png" />
        <span>电商后台管理系统</span>
      </div>
      <el-button
        type="info"
        @click="Exit"
      >退出</el-button>
    </el-header>
    <!-- 页面主体 -->
    <el-container>
      <!-- 侧边栏 -->
      <el-aside :width="isCollapse ? '64px' : '200px'">
        <!-- 侧边栏菜单区域 -->
        <!-- :unique-opened="true"  不加冒号 则true则为字符串，加冒号则为boolean /或者只写unique-opened，表示将它设置为true-->
        <div
          class="toggle-button"
          @click="toggleCollapse"
        >|||</div>
        <el-menu
          background-color="#333744"
          text-color="#fff"
          active-text-color="#409bff"
          :unique-opened="true"
          :collapse="isCollapse"
          :collapse-transition="false"
          :router="true"
          :default-active="activePath"
        >
          <!-- 一级菜单 -->
          <!-- index="item.id"  index 如果一样的话会造成点击一个全部展开 -->
          <el-submenu
            :index="item.id + ''"
            v-for="item in menulist"
            :key="item.id"
          >
            <!-- 一级菜单模版 -->
            <template slot="title">
              <!-- 图标 -->
              <i :class="iconsObj[item.id]"></i>
              <!-- 文本 -->
              <!-- {{}} 是用来绑定数据的 -->
              <span>{{item.authName}}</span>
            </template>

            <!-- 二级菜单 -->
            <el-menu-item
              :index=" '/'+ items.path + ''"
              v-for="items in item.children"
              :key="items.id"
              @click="saveNavState('/'+ items.path + '')"
            >
              <template slot="title">
                <!-- 图标 -->
                <i class="el-icon-menu"></i>
                <!-- 文本 -->
                <span>{{items.authName}}</span>
              </template>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <!-- 右侧内容主体 -->
      <el-main>
        <!-- 路由占位符 -->
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  data() {
    return {
      // 左侧菜单数据
      menulist: [],
      iconsObj: {
        125: 'iconfont icon-user',
        103: 'iconfont icon-tijikongjian',
        101: 'iconfont icon-shangpin',
        102: 'iconfont icon-danju',
        145: 'iconfont icon-baobiao'
      },
      // 是否折叠
      isCollapse: false,
      // 被激活的链接地址
      activePath: ''
    }
  },
  created() {
    this.getMenuList()
    // window.sessionStorage.setItem('activePath', this.activePath)
    this.activePath = window.sessionStorage.getItem('activePath')
  },

  methods: {
    Exit() {
      // window.sessionStorage.removeItem('token')
      window.sessionStorage.clear()
      this.$router.push('/login')
      // this.$message.success('成功退出！')
    },
    // 获取所有的请求
    async getMenuList() {
      const { data: res } = await this.$http.get('menus') // 因为返回值是一个promise 所以使用async简化操作
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.menulist = res.data
      // console.log(res)
      // console.log(this.iconsObj)
      // window.sessionStorage.setItem('activePath', '/users')
      // console.log(this.activePath)
    },
    // 点击按钮 切换菜单的折叠与展开
    toggleCollapse() {
      // if (this.isCollapse === false) {
      //   this.isCollapse = true
      // } else {
      //   this.isCollapse = false
      // }
      this.isCollapse = !this.isCollapse
    },
    // 保存链接的激活状态
    saveNavState(activePath) {
      window.sessionStorage.setItem('activePath', activePath)
      this.activePath = activePath
    }
  }
}
</script>

<style lang="less" scoped>
.home-container {
  // margin-bottom: 40px;
  height: 100%;
}
.el-header {
  background-color: #373d41;
  color: #fff;
  display: flex;
  justify-content: space-between;
  padding-left: 0;
  align-items: center;
  font-size: 20px;
  > div {
    display: flex;
    align-items: center;
    span {
      margin-left: 15px;
    }
  }
}

.el-aside {
  background-color: #333744;
  color: #fff;
  .el-menu {
    border-right: none;
  }
}

.el-main {
  background-color: #eaedf1;
  color: #333;
}
.iconfont {
  margin-right: 10px;
}
.toggle-button {
  background-color: #4a5064;
  font-size: 10px;
  line-height: 24px;
  color: #fff;
  text-align: center;
  letter-spacing: 0.2em;
  cursor: pointer;
}
</style>
