<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>参数列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片区域 -->
    <el-card>
      <!-- 警告区域！ -->
      <el-alert
        title="注意：只允许为第三级分类设置相关参数！"
        type="warning"
        :closable='false'
        show-icon
      >
      </el-alert>
      <!-- 选择商品分类区域 -->
      <el-row class="cat_opt">
        <el-col>
          <span>选择商品分类：</span>
          <!-- 选择商品分类的级联选择框 -->
          <!-- options 用来指定数据源 -->
          <!-- props 用来指定配置对象 -->
          <el-cascader
            v-model="selectedKeys"
            :options="cateList"
            :props="cascaderProps"
            @change="handleChange"
            clearable
            filterable
          ></el-cascader>
        </el-col>
      </el-row>
      <!--  Tab 标签页 -->
      <el-tabs
        v-model="activeName"
        @tab-click="handleClick"
      >
        <!-- 添加动态参数的面板 -->
        <el-tab-pane
          label="动态参数"
          name="many"
        >
          <!-- 添加参数的按钮 -->

          <el-button
            type="primary"
            size="mini"
            :disabled="isBtnDisabled"
            @click="addDialogVisible =true"
          >添加参数</el-button>
          <!-- 动态参数表格 -->
          <el-table
            :data="manyTableData"
            border
            stripe
          >
            <!-- 展开行 -->
            <el-table-column type="expand">
              <template slot-scope="scope">
                <!-- 循环渲染Tag标签 -->
                <el-tag
                  v-for="(item,index) in scope.row.attr_vals"
                  :key="index"
                  closable
                  @close="handleColse(index,scope.row)"
                >{{item}}</el-tag>
                <!-- 输入的文本框 -->
                <el-input
                  class="input-new-tag"
                  v-if="scope.row.inputVisible"
                  v-model="scope.row.inputValue"
                  ref="saveTagInput"
                  size="small"
                  @keyup.enter.native="handleInputConfirm(scope.row)"
                  @blur="handleInputConfirm(scope.row)"
                >
                </el-input>
                <!-- 添加按钮 -->
                <el-button
                  v-else
                  class="button-new-tag"
                  size="small"
                  @click="showInput(scope.row)"
                >+ New Tag</el-button>
              </template>
            </el-table-column>
            <!-- 索引列 -->
            <el-table-column
              type="index"
              label="#"
            >
            </el-table-column>
            <el-table-column
              prop="attr_name"
              label="参数名称"
            >
            </el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button
                  type="primary"
                  class="el-icon-edit"
                  size="mini"
                  @click="showEditDialog(scope.row.attr_id)"
                >修改</el-button>
                <el-button
                  type="danger"
                  class="el-icon-delete"
                  size="mini"
                  @click="removeParams(scope.row.attr_id)"
                >删除</el-button>
              </template>
            </el-table-column>

          </el-table>
        </el-tab-pane>

        <!-- 添加静态属性的面板 -->
        <el-tab-pane
          label="静态属性"
          name="only"
        >
          <!-- 添加属性的按钮 -->
          <el-button
            type="primary"
            size="mini"
            :disabled="isBtnDisabled"
            @click="addDialogVisible =true"
          >添加属性</el-button>
          <!-- 静态属性表格 -->
          <el-table
            :data="onlyTableData"
            border
            stripe
          >
            <!-- 展开行 -->
            <el-table-column type="expand">
              <template slot-scope="scope">
                <!-- 循环渲染Tag标签 -->
                <el-tag
                  v-for="(item,index) in scope.row.attr_vals"
                  :key="index"
                  closable
                  @close="handleColse(index,scope.row)"
                >{{item}}</el-tag>
                <!-- 输入的文本框 -->
                <el-input
                  class="input-new-tag"
                  v-if="scope.row.inputVisible"
                  v-model="scope.row.inputValue"
                  ref="saveTagInput"
                  size="small"
                  @keyup.enter.native="handleInputConfirm(scope.row)"
                  @blur="handleInputConfirm(scope.row)"
                >
                </el-input>
                <!-- 添加按钮 -->
                <el-button
                  v-else
                  class="button-new-tag"
                  size="small"
                  @click="showInput(scope.row)"
                >+ New Tag</el-button>
              </template>
            </el-table-column>
            <!-- 索引列 -->
            <el-table-column
              type="index"
              label="#"
            >
            </el-table-column>
            <el-table-column
              prop="attr_name"
              label="属性名称"
            >
            </el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button
                  type="primary"
                  class="el-icon-edit"
                  size="mini"
                  @click="showEditDialog(scope.row.attr_id)"
                >修改</el-button>
                <el-button
                  type="danger"
                  class="el-icon-delete"
                  size="mini"
                  @click="removeParams(scope.row.attr_id)"
                >删除</el-button>
              </template>
            </el-table-column>

          </el-table>
        </el-tab-pane>

      </el-tabs>
    </el-card>

    <!-- 添加参数的对话框 -->
    <el-dialog
      :title="'添加'+titleText"
      :visible.sync="addDialogVisible"
      width="50%"
      @close="addDialogClosed"
    >
      <el-form
        :model="addForm"
        :rules="addFormRules"
        ref="addFormRef"
        label-width="100px"
      >
        <el-form-item
          :label="titleText"
          prop="attr_name"
        >
          <el-input v-model="addForm.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span
        slot="footer"
        class="dialog-footer"
      >
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button
          type="primary"
          @click="addParams"
        >确 定</el-button>
      </span>
    </el-dialog>
    <!-- 修改参数的对话框 -->
    <el-dialog
      :title="'修改'+titleText"
      :visible.sync="editDialogVisible"
      width="50%"
      @close="editDialogClosed"
    >
      <el-form
        :model="editForm"
        :rules="editFormRules"
        ref="editFormRef"
        label-width="100px"
      >
        <el-form-item
          :label="titleText"
          prop="attr_name"
        >
          <el-input v-model="editForm.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span
        slot="footer"
        class="dialog-footer"
      >
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button
          type="primary"
          @click="editParams"
        >确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      // 所有数据列表
      cateList: [],
      // 级联选择器配置对象
      cascaderProps: {
        expandTrigger: 'hover',
        value: 'cat_id',
        label: 'cat_name',
        children: 'children'
      },
      // 被选中的ID数组
      selectedKeys: [],
      // 激活的tabs标签页
      activeName: 'many',
      // 动态参数数据
      manyTableData: [],
      // 静态属性数据
      onlyTableData: [],
      // 添加属性对话框的显示与隐藏
      addDialogVisible: false,
      // 添加参数的表单数据对象
      addForm: {
        attr_name: ''
      },
      // 添加参数表单的验证规则
      addFormRules: {
        attr_name: [
          {
            required: true, message: '请输入参数名称', trigger: 'blur'
          }

        ]
      },
      // 修改属性对话框的显示与隐藏
      editDialogVisible: false,
      // 修改参数的表单数据对象
      editForm: {

      },
      // 修改参数表单的验证规则
      editFormRules: {
        attr_name: [
          {
            required: true, message: '请输入参数名称', trigger: 'blur'
          }
        ]
      }
      // // 控制按钮与文本框的按钮显示
      // inputVisible: false,
      // // 文本框中输入的内容
      // inputValue: ''

    }
  },
  created() {
    // 获取商品分类信息
    this.getCateList()
  },
  methods: {
    async getCateList() {
      const { data: res } = await this.$http.get('categories')
      if (res.meta.status !== 200) {
        return this.$message.error('获取商品分类失败！')
      }

      this.cateList = res.data
      // console.log(this.cateList);
    },
    // 级联选择器选中框变化，会触发这个事件
    handleChange() {
      this.getParamsData()
    },
    // tab页签的点击事件
    handleClick(tab) {
      this.getParamsData()
      // console.group('打印Tab标签页名')
      console.log(tab.name);
    },
    // 获取参数的列表数据
    async getParamsData() {
      // console.log(this.selectedKeys);
      // 判断是不是三级分类
      // 将many和only数组清空 解决不是三级分类却还显示的bug
      if (this.selectedKeys.length !== 3) {
        this.selectedKeys = []
        this.manyTableData = []
        this.onlyTableData = []
        return
      }

      // 证明选中的是三级分类
      console.log(this.selectedKeys);

      // 根据所选分类的Id，和当前所处的面板，获取对应的参数
      const { data: res } = await this.$http.get(
        `categories/${this.cateId}/attributes`, {
        params: {
          sel: this.activeName
        }
      }
      )
      if (res.meta.status !== 200) {
        return this.$message.error('获取参数列表失败！')
      }

      // 将 vals 切割成数组，先判断是否为空
      res.data.forEach(item => {
        item.attr_vals = item.attr_vals
          ? item.attr_vals.split(' ') : []

        // 添加两个属性，解决点击一个+ New Tag，都显示输入框的bug
        // bug原因为每个input都用了同一个inputVisible 与 inputValue
        // 控制文本框的现显示与隐藏
        item.inputVisible = false
        // 文本框中输入的值
        item.inputValue = ''
        // 就可以将data中 inputVisible 与 inputValue 删掉
      })

      console.log(res.data);
      if (this.activeName === 'many') {
        this.manyTableData = res.data
      } else {
        this.onlyTableData = res.data
      }
    },
    // 监听添加对话框的关闭事件
    addDialogClosed() {
      // this.$refs.addFormRef.resetFields()
      this.$refs.addFormRef.resetFields()
    },
    // 点击按钮，添加参数
    addParams() {
      this.$refs.addFormRef.validate(async valid => {
        if (!valid) return
        const { data: res } = await this.$http.post(
          `categories/${this.cateId}/attributes`, {
          attr_name: this.addForm.attr_name,
          attr_sel: this.activeName
        }
        )
        if (res.meta.status !== 201) {
          return this.$message.error('添加参数失败！')
        }
        this.$message.success('添加参数成功！')
        this.addDialogVisible = false
        this.getParamsData()
      })
    },
    // 点击按钮显示修改对话框
    async  showEditDialog(Id) {
      // 查询当前Id的信息
      const { data: res } = await this.$http.get(
        `categories/${this.cateId}/attributes/${Id}`,
        { attr_sel: this.activeName }

      )
      console.log(res.data);
      if (res.meta.status !== 200) {
        return this.$message.error('获取参数信息失败！')
      }
      this.editForm = res.data
      this.editDialogVisible = true
    },
    /// 监听修改对话框的关闭事件
    editDialogClosed() {
      this.$refs.editFormRef.resetFields()
    },
    // 点击按钮，修改参数
    editParams() {
      // 预验证
      this.$refs.editFormRef.validate(async valid => {
        if (!valid) return
        const { data: res } = await this.$http.put(
          `categories/${this.cateId}/attributes/${this.editForm.attr_id}`,
          {
            attr_name: this.editForm.attr_name,
            attr_sel: this.activeName
          }
        )
        if (res.meta.status !== 200) {
          return this.$message.error('修改参数失败！')
        }

        this.$message.success('修改参数成功！')
        this.getParamsData()
        this.editDialogVisible = false
      })
    },
    // 删除参数
    removeParams(Id) {
      this.$confirm('此操作将永久删除该参数, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        const { data: res } = await this.$http.delete(
          `categories/${this.cateId}/attributes/${Id}`
        )
        if (res.meta.status !== 200) {
          return this.$message.error('删除参数失败！')
        }
        this.$message({
          type: 'success',
          message: '删除成功!'
        });
        this.getParamsData()
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
      });
    },
    // 当输入框失去焦点,或按下回车键都会触发
    async handleInputConfirm(val) {
      if (val.inputValue.trim().length === 0) {
        val.inputValue = ''
        val.inputVisible = false
        return
      }

      // 如果没有return ，则证明输入的内容，需要做后续处理
      val.attr_vals.push(val.inputValue.trim())
      val.inputValue = ''
      val.inputVisible = false

      // 提交请求，需要将attr_vals数组再转化为字符串
      // var valString = val.attr_vals.join(' ')
      // console.log(valString);
      // 发起请求，提交到数据库中
      const { data: res } = await this.$http.put(
        `categories/${this.cateId}/attributes/${val.attr_id}`,
        {
          attr_name: val.attr_name,
          attr_sel: this.activeName,
          attr_vals: val.attr_vals.join(' ')
        }
      )
      console.log(res);
      if (res.meta.status !== 200) {
        return this.$message.error('修改参数项失败！')
      }
      this.$message.success('修改参数成功！')

      // this.saveAttrVals(val)
    },
    // 点击按钮显示文本框
    showInput(val) {
      val.inputVisible = true
      // 让文本框自动获得焦点
      // $nextTick 作用：当页面上元素被重新渲染之后，才会执行回调函数中的代码
      this.$nextTick(_ => {
        this.$refs.saveTagInput.$refs.input
          .focus();
      });
    },
    // Tag标签删除事件
    handleColse(i, val) {
      val.attr_vals.splice(i, 1)
      this.saveAttrVals(val)
    },
    // 删除参数的HTTP请求
    async saveAttrVals(val) {
      // 发起请求，提交到数据库中
      const { data: res } = await this.$http.put(
        `categories/${this.cateId}/attributes/${val.attr_id}`,
        {
          attr_name: val.attr_name,
          attr_sel: this.activeName,
          attr_vals: val.attr_vals.join(' ')
        }
      )

      if (res.meta.status !== 200) {
        return this.$message.error('删除Tag标签失败！')
      }
      this.$message.success('删除Tag标签成功！')
    }
  },
  // 计算属性
  computed: {
    // 如果需要被禁用，返回true,否则返回false
    isBtnDisabled() {
      if (this.selectedKeys.length !== 3) {
        return true
      }
      return false
    },
    // 当前选中的三级分类的ID
    cateId() {
      if (this.selectedKeys.length !== 3) {
        return null
      }
      return this.selectedKeys[2]
    },
    // 动态计算标题的文本
    titleText() {
      if (this.activeName === 'many') {
        return '动态参数'
      } else {
        return '静态属性'
      }
    }
  }
}
</script>

<style lang='less' scoped>
.cat_opt {
  margin: 15px 0;
}
.el-tag {
  margin: 10px;
}
.input-new-tag {
  width: 110px;
}
</style>
