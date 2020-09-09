<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图区域 -->
    <el-card>
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input
            placeholder="请输入内容"
            clearable
            v-model="queryInfo.query"
            @clear="getGoodsList"
          >
            <el-button
              slot="append"
              icon="el-icon-search"
              @click="getGoodsList"
            ></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button
            type="primary"
            @click="goAddPage"
          >添加商品</el-button>
        </el-col>
      </el-row>
      <!-- table 表格区域 -->
      <el-table
        :data="goodslist"
        stripe
        border
      >
        <el-table-column
          label="#"
          type="index"
        >
        </el-table-column>
        <el-table-column
          label="商品名称"
          prop="goods_name"
        ></el-table-column>
        <el-table-column
          label="商品价格(元)"
          prop="goods_price"
          width="95px"
        ></el-table-column>
        <el-table-column
          label="商品重量"
          prop="goods_weight"
          width="70px"
        ></el-table-column>
        <el-table-column
          label="创建时间"
          width="140px"
        >
          <template slot-scope="scope">
            {{scope.row.add_time | dateFormat}}
          </template>
        </el-table-column>
        <el-table-column
          label="操作"
          width="130px"
        >
          <template slot-scope="scope">
            <el-button
              type="primary"
              size="mini"
              icon="el-icon-edit"
              @click="showEditDialog(scope.row.goods_id)"
            ></el-button>
            <el-button
              type="danger"
              size="mini"
              icon="el-icon-delete"
              @click="removeById(scope.row.goods_id)"
            ></el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页区域 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenun"
        :page-sizes="[5, 10, 15, 20]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        background
      >
      </el-pagination>
    </el-card>
    <!-- 修改商品对话框 -->
    <el-dialog
      title="修改商品信息"
      :visible.sync="editDialogVisible"
      width="50%"
      @close="editDialogClosed"
    >
      <!-- 表单区域 -->
      <el-form
        :model="editForm"
        :rules="editFormRules"
        ref="editFormRef"
        label-width="100px"
      >
        <el-form-item
          label="商品名称"
          prop="goods_name"
        >
          <el-input v-model="editForm.goods_name"></el-input>
        </el-form-item>
        <el-form-item
          label="商品价格"
          prop="goods_price"
        >
          <el-input v-model="editForm.goods_price"></el-input>
        </el-form-item>
        <el-form-item
          label="商品数量"
          prop="goods_number"
        >
          <el-input v-model="editForm.goods_number"></el-input>
        </el-form-item>
        <el-form-item
          label="商品重量"
          prop="goods_weight"
        >
          <el-input v-model="editForm.goods_weight"></el-input>
        </el-form-item>
      </el-form>
      <span
        slot="footer"
        class="dialog-footer"
      >
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button
          type="primary"
          @click="editCate"
        >确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      // 查询参数对象
      queryInfo: {
        query: '',
        pagenum: 1,
        pagesize: 10
      },
      // 商品列表
      goodslist: [],
      // 总数据条数
      total: 0,
      // 控制修改对话框的显示与隐藏
      editDialogVisible: false,
      // 修改商品信息对象
      editForm: {},
      // 修改商品信息对象验证规则
      editFormRules: {
        goods_name: [
          {
            required: true, message: '请输入商品名称', trigger: 'blur'
          }
        ],
        goods_price: [
          {
            required: true, message: '请输入商品价格', trigger: 'blur'
          }
        ],
        goods_weight: [
          {
            required: true, message: '请输入商品重量', trigger: 'blur'
          }
        ],
        goods_number: [
          {
            required: true, message: '请输入商品数量', trigger: 'blur'
          }
        ]
      }
    }
  },
  created() {
    this.getGoodsList()
  },
  methods: {
    // 根据分页获取对应的商品列表
    async getGoodsList() {
      const { data: res } = await this.$http.get('goods', {
        params: this.queryInfo
      })
      if (res.meta.status !== 200) {
        return this.$message.error('获取商品列表失败！')
      }
      this.$message.success('获取商品列表成功！')
      console.log(res)
      this.goodslist = res.data.goods
      this.total = res.data.total
    },
    // 触发页码大小改变事件
    handleSizeChange(val) {
      console.log(`每页显示条数：${val}`);
      this.queryInfo.pagesize = val
      this.getGoodsList()
    },
    // 触发当前页变动事件
    handleCurrentChange(val) {
      console.log(`当前页：${val}`);
      this.queryInfo.pagenum = val
      this.getGoodsList()
    },
    // 根据Id删除商品
    removeById(Id) {
      this.$confirm('此操作将永久删除该分类, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        const { data: res } = await this.$http.delete(
          'goods/' + Id)
        console.log(res)
        if (res.meta.status !== 200) {
          return this.$message.error('删除分类失败！')
        }

        this.$message.success('删除成功！')
        this.getGoodsList()
      }).catch(() => {
        this.$message.info('已取消删除')
      });
    },
    // 跳转到添加商品页面
    goAddPage() {
      this.$router.push('/goods/add')
    },
    // 修改商品
    async showEditDialog(Id) {
      const { data: res } = await this.$http.get('goods/' + Id)
      // console.log(res);
      if (res.meta.status !== 200) {
        return this.$message.error('获取商品信息失败！')
      }
      this.editForm = res.data
      console.log(this.editForm);
      this.editDialogVisible = true
    },
    // 清空editForm
    editDialogClosed() {
      this.$refs.editFormRef.resetFields()
    },
    // 修改商品信息
    editCate() {
      // 预验证
      this.$refs.editFormRef.validate(async valid => {
        if (!valid) { return }

        const { data: res } = await this.$http.put('goods/' + this.editForm.goods_id, {
          goods_name: this.editForm.goods_name,
          goods_price: this.editForm.goods_price,
          goods_number: this.editForm.goods_number,
          goods_weight: this.editForm.goods_weight,
          goods_cat: this.cateId
        })
        console.log(this.editForm.goods_cat.split(',')[2]);
        if (res.meta.status !== 200) {
          this.$message.error('修改商品信息失败！')
        }
        // this.$message.success('修改商品信息成功！')
      })
      this.getGoodsList()
      this.editDialogVisible = false
    }
  },
  computed: {
    cateId() {
      const cate = this.editForm.goods_cat.split(',')[2]
      return cate
    }
  }
}
</script>
<!-- scoped 防止组件间的样式冲突 -->
<style lang='less' scoped>
</style>
