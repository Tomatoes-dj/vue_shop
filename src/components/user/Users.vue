<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图区域 -->
    <el-card>
      <!-- 搜索与添加区域 -->
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input
            placeholder="请输入内容"
            v-model="queryInfo.query"
            clearable
            @clear="getUsersList"
          >
            <el-button
              slot="append"
              icon="el-icon-search"
              @click="getUsersList"
            ></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button
            type="primary"
            @click="addDialogVisible=true"
          >添加用户</el-button>
        </el-col>
      </el-row>

      <!-- 用户列表区域 -->
      <el-table
        :data="userlist"
        border
        stripe
      >
        <!-- 只要加 type="index"  这列就会变成索引列 -->
        <el-table-column
          label="#"
          type="index"
        ></el-table-column>
        <el-table-column
          prop="username"
          label="姓名"
        ></el-table-column>
        <el-table-column
          prop="email"
          label="邮箱"
        ></el-table-column>
        <el-table-column
          prop="mobile"
          label="电话"
        ></el-table-column>
        <el-table-column
          prop="role_name"
          label="角色"
        ></el-table-column>
        <el-table-column label="状态">
          <!-- <template slot-scope="scope">
            {{scope.row}} //这个作用域插槽 scope.row 取的是table当前行的数据
          </template>-->
          <template slot-scope="scope">
            <!-- {{scope.row}} -->
            <el-switch
              v-model="scope.row.mg_state"
              @change="userStateChanged(scope.row)"
            ></el-switch>
            <!-- <el-switch v-model="value1"></el-switch> -->
          </template>
        </el-table-column>
        <el-table-column
          label="操作"
          width="180px"
        >
          <template slot-scope="scope">
            <!-- 修改按钮 -->
            <el-tooltip
              class="item"
              effect="dark"
              content="修改"
              placement="top"
              :enterable="false"
            >
              <el-button
                type="primary"
                icon="el-icon-edit"
                size="mini"
                @click="showEditDialog(scope.row.id)"
              ></el-button>
            </el-tooltip>
            <!-- 删除按钮 -->
            <el-tooltip
              class="item"
              effect="dark"
              content="删除"
              placement="top"
              :enterable="false"
            >
              <el-button
                type="danger"
                icon="el-icon-delete"
                size="mini"
                @click="removeUserById(scope.row.id)"
              ></el-button>
            </el-tooltip>
            <!-- 分配角色按钮 -->
            <el-tooltip
              class="item"
              effect="dark"
              content="分配角色"
              placement="top"
              :enterable="false"
            >
              <el-button
                type="warning"
                icon="el-icon-setting"
                size="mini"
                @click="showSetDialog(scope.row)"
              ></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[1, 2, 3, 6]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </el-card>

    <!-- 添加用户对话框 -->
    <el-dialog
      title="添加用户"
      :visible.sync="addDialogVisible"
      width="50%"
      @close="addDialogClosed"
    >
      <!-- 内容主体区域 -->
      <!-- ref引用对象 用ref结尾 rules 对象以rules结尾 -->
      <el-form
        :model="addForm"
        :rules="addFormRules"
        ref="addFormRef"
        label-width="70px"
      >
        <el-form-item
          label="用户名"
          prop="username"
        >
          <el-input
            v-model="addForm.username"
            placeholder="请输入用户名"
          ></el-input>
        </el-form-item>
        <el-form-item
          label="密码"
          prop="password"
        >
          <el-input
            v-model="addForm.password"
            placeholder="请输入密码"
            show-password
          ></el-input>
        </el-form-item>
        <el-form-item
          label="邮箱"
          prop="email"
        >
          <el-input
            v-model="addForm.email"
            placeholder="请输入邮箱"
          ></el-input>
        </el-form-item>
        <el-form-item
          label="手机"
          prop="mobile"
        >
          <el-input
            v-model="addForm.mobile"
            placeholder="请输入手机号"
          ></el-input>
        </el-form-item>
      </el-form>

      <!-- 底部区域 -->
      <span
        slot="footer"
        class="dialog-footer"
      >
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button
          type="primary"
          @click="addUser"
        >确 定</el-button>
      </span>
    </el-dialog>

    <!-- 修改用户的对话框 -->
    <el-dialog
      title="修改用户信息"
      :visible.sync="editDialogVisible"
      width="50%"
      @close="editDialogClosed"
    >
      <el-form
        :model="editForm"
        :rules="editFormRules"
        ref="editFormRef"
        label-width="70px"
      >
        <el-form-item label="用户名">
          <el-input
            v-model="editForm.username"
            disabled
          ></el-input>
        </el-form-item>
        <el-form-item
          label="邮箱"
          prop="email"
        >
          <el-input v-model="editForm.email"></el-input>
        </el-form-item>
        <el-form-item
          label="手机号"
          prop="mobile"
        >
          <el-input v-model="editForm.mobile"></el-input>
        </el-form-item>
      </el-form>

      <span
        slot="footer"
        class="dialog-footer"
      >
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button
          type="primary"
          @click="editUser"
        >确 定</el-button>
      </span>
    </el-dialog>

    <!-- 分配角色的对话框 -->
    <el-dialog
      title="分配角色"
      :visible.sync="setRolesDialogVisible"
      width="50%"
      @close="setRoleDialogClosed"
    >
      <div>
        <p>当前的用户：{{userInfo.username}}</p>
        <p>当前的角色：{{userInfo.role_name}}</p>
        <p>分配新角色：
          <el-select
            v-model="selectedRoleId"
            placeholder="请选择"
            @change="newRole"
          >
            <el-option
              v-for="item in rolesList"
              :key="item.id"
              :label="item.roleName"
              :value="item.id"
            >
            </el-option>
          </el-select>
        </p>
      </div>
      <span
        slot="footer"
        class="dialog-footer"
      >
        <el-button @click="setRolesDialogVisible = false">取 消</el-button>
        <el-button
          type="primary"
          @click="saveRoleInfo"
        >确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    // 验证邮箱的规则
    var checkEmail = (rule, value, callback) => {
      // 验证邮箱的正则表达式
      const regEmail = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])/
      if (regEmail.test(value)) {
        return callback()
      }
      callback(new Error('请输入合法的邮箱'))
    }
    // 验证手机号的规则
    var checkMobile = (rule, value, callback) => {
      // 验证手机号的正则表达式
      const regMobile = /^(0|86|17951)?(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/
      if (regMobile.test(value)) {
        return callback()
      }
      callback(new Error('请输入正确的手机号'))
    }

    return {
      // 获取用户列表的参数对象
      queryInfo: {
        query: '',
        // 当前的页数
        pagenum: 1,
        // 当前每页显示多少条数据
        pagesize: 2
      },
      userlist: [],
      total: 0,
      // 控制添加用户对话框的显示与隐藏
      addDialogVisible: false,
      // 控制修改用户信息对话框的显示与隐藏
      editDialogVisible: false,
      // 添加用户的表单数据
      addForm: {
        username: '',
        password: '',
        email: '',
        mobile: ''
      },
      // 添加表单的验证规则对象
      addFormRules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' }, // 必选项验证
          {
            min: 3,
            max: 10,
            message: '用户名的长度在3~10个字符之间',
            trigger: 'blur'
          } // 长度项验证
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' }, // 必选项验证
          {
            min: 6,
            max: 15,
            message: '用户名的长度在6~15个字符之间',
            trigger: 'blur'
          } // 长度项验证
        ],
        email: [
          {
            required: true,
            message: '请输入邮箱',
            trigger: 'blur'
          },
          {
            validator: checkEmail,
            trigger: 'blur'
          }
        ],
        mobile: [
          {
            required: true,
            message: '请输入手机号',
            trigger: 'blur'
          },
          {
            validator: checkMobile,
            trigger: 'blur'
          }
        ]
      },
      // 查询到的用户信息保存
      editForm: {},
      // 修改表单的验证规则对象
      editFormRules: {
        email: [
          {
            required: true,
            message: '请输入邮箱',
            trigger: 'blur'
          },
          {
            validator: checkEmail,
            trigger: 'blur'
          }
        ],
        mobile: [
          {
            required: true,
            message: '请输入手机号',
            trigger: 'blur'
          },
          {
            validator: checkMobile,
            trigger: 'blur'
          }
        ]
      },
      setRolesDialogVisible: false,
      // 需要分配角色的用户信息
      userInfo: {},
      // 所有角色的数据列表
      rolesList: [],
      // 已选中的角色ID值
      selectedRoleId: '',
      // 已选中的角色名
      newRoleLabel: ''
    }
  },
  created() {
    this.getUsersList()
  },
  methods: {
    async getUsersList() {
      // get请求会返回一个Promise对象，用async简化异步操作
      const { data: res } = await this.$http.get('users', {
        params: this.queryInfo
      })

      if (res.meta.status !== 200) {
        return this.$message.error('获取用户列表失败！')
      }
      this.userlist = res.data.users
      this.total = res.data.total
      console.log(res)
      console.log(this.userlist)
      console.log(this.total)
    },
    // 监听 pagesize 改变的事件
    handleSizeChange(newSize) {
      // console.log(newSize)
      this.queryInfo.pagesize = newSize
      this.getUsersList()
    },
    // 监听 页码值 改变的事件
    handleCurrentChange(val) {
      // console.log(val)
      this.queryInfo.pagenum = val
      this.getUsersList()
    },
    // 监听switch状态改变
    // 发送get请求修改，会返回这个操作的信息，如果操作失败就将switch状态改回去
    async userStateChanged(userinfo) {
      console.log(userinfo)
      const { data: res } = await this.$http.put(
        `users/${userinfo.id}/state/${userinfo.mg_state}`
      )
      console.log(res)
      if (res.meta.status !== 200) {
        userinfo.mg_state = !userinfo.mg_state
        return this.$message.error('更改用户状态失败！')
      }
      this.$message.success('更改用户状态成功')
    },
    // 监听添加用户对话框的关闭事件，在对话框关闭之后重置对话框里的表单和验证结果
    addDialogClosed() {
      this.$refs.addFormRef.resetFields()
    },
    // 点击确定按钮添加用户 进行一个预验证
    addUser() {
      this.$refs.addFormRef.validate(async valid => {
        // console.log(valid)
        if (!valid) return
        // 可以发起添加用户的网络请求
        const { data: res } = await this.$http.post('users', this.addForm)

        if (res.meta.status !== 201) {
          this.$message.error('添加用户失败！')
        }
        this.$message.success('添加用户成功！')
        // 隐藏添加用户对话框
        this.addDialogVisible = false
        // 刷新用户列表数据
        console.log('userlist:' + this.userlist)
        this.getUsersList()
      })
    },
    // 显示用户编辑的对话框
    async showEditDialog(id) {
      // console.log(id)
      const { data: res } = await this.$http.get('users/' + id)
      if (res.meta.status !== 200) {
        return this.$message.error('查询用户信息失败！')
      }
      this.editForm = res.data
      this.editDialogVisible = true
      console.log(this.editForm)
    },
    // 监听修改用户对话框的关闭事件，重置对话框里的表单和验证结果
    editDialogClosed() {
      this.$refs.editFormRef.resetFields()
    },
    // 点击确定按钮修改用户 进行一个预验证
    editUser() {
      this.$refs.editFormRef.validate(async valid => {
        if (!valid) return
        // 发起修改用户信息的数据请求
        const { data: res } = await this.$http.put(
          'users/' + this.editForm.id,
          {
            email: this.editForm.email,
            mobile: this.editForm.mobile
          }
        )
        if (res.meta.status !== 200) {
          return this.$message.error('修改用户信息失败！')
        }
        this.$message.success('修改用户信息成功！')
        // 隐藏添加用户对话框
        this.editDialogVisible = false
        // 刷新用户列表数据
        this.getUsersList()
      })
    },
    // 删除用户按钮
    removeUserById(id) {
      this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async () => {
          const { data: res } = await this.$http.delete('users/' + id)
          console.log(res.meta.status)
          if (res.meta.status !== 200) {
            return this.$message.error('删除用户失败！')
          }
          // const ps = this.queryInfo.pagesize
          // this.queryInfo.pagesize = ps
          // 删除用户后返回第一页
          this.queryInfo.pagenum = 1
          this.getUsersList()
          this.$message.success('删除用户成功！')
        })
        .catch(() => {
          this.$message.info('已取消删除！')
        })

      /* ----------------以下也可以实现----------------------------
      const confirmResult = await this.$confirm(
        '此操作将永久删除该用户, 是否继续?',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      )
      .catch(reason => reason)

      如果用户确认删除，则返回值为字符串 confirm
      如果用户取消了删除，则返回值为字符串 cancel
      console.log(confirmResult)

      if (confirmResult !== 'confirm') {
        return this.$message.info('已取消删除！')
      }
      const { data: res } = await this.$http.delete('users/' + id)
      if (res.meta.status !== 200) {
        return this.$message.error('删除用户失败！')
      }

      this.getUsersList()
      this.$message.success('删除用户成功！')
      --------------------------------------------------------- */
    },
    // 显示分配角色对话框
    async showSetDialog(userInfo) {
      this.userInfo = userInfo

      // 获取所有角色列表
      const { data: res } = await this.$http.get('roles')
      if (res.meta.status !== 200) {
        return this.$message.error('获取角色列表失败！')
      }

      this.rolesList = res.data
      this.setRolesDialogVisible = true
    },
    // 点击按钮分配角色
    async saveRoleInfo() {
      // console.log(this.userInfo);
      if (!this.selectedRoleId) {
        return this.$message.error('请选择要分配的角色！')
      } else if (this.userInfo.role_name === this.newRoleLabel) {
        // 判断新的角色名称是否和之前一样
        return this.$message.info('角色没有变化！')
      }
      // console.log(this.selectedRoleId)

      // --------------------------------------------
      const { data: res } = await this.$http.put(`users/${this.userInfo.id}/role`, {
        rid: this.selectedRoleId
      })

      if (res.meta.status !== 200) {
        return this.$message.error('分配角色失败！')
      }

      this.$message.success('分配角色成功！')
      // 刷新列表
      this.getUsersList()
      // 隐藏对话框
      this.setRolesDialogVisible = false
    },
    // 解决分配后还会显示分配的角色bug
    setRoleDialogClosed() {
      this.selectedRoleId = ''
      this.userInfo = ''
    },
    // 查找select选中的label值
    newRole() {
      const roleObj = this.rolesList.find(item => {
        return item.id === this.selectedRoleId
      })

      this.newRoleLabel = roleObj.roleName
    }
  }
}
</script>
<style lang='less' scoped>
</style>
