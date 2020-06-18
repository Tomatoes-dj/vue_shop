<template>
  <div>
    <el-button type="info" @click="Exit">退出</el-button>
  </div>
</template>

<script>
export default {
  data() {
    return {}
  },
  methods: {
    Exit() {
      // window.sessionStorage.removeItem('token')
      window.sessionStorage.clear()
      this.$router.push('/login')
      // this.$message.success('成功退出！')
    }
  }
}
</script>

<style lang="less" scoped></style>
