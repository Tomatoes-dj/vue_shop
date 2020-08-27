<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图 -->
    <el-card>
      <!-- 添加角色按钮区域 -->
      <el-row>
        <el-col>
          <el-button
            type="primary"
            @click="addDialogVisible = true"
          >添加角色</el-button>
        </el-col>
      </el-row>
      <!-- 角色列表区域 -->
      <el-table
        :data="rolelist"
        border
        stripe
      >
        <!-- 展开列 -->
        <el-table-column type="expand">
          <template slot-scope="scope">
            <el-row
              :class="['bdbottom', i1 === 0 ? 'bdtop' : '','vcenter']"
              v-for="(item1, i1) in scope.row.children"
              :key="item1.id"
            >
              <!-- 用栅格布局来实现 -->
              <!-- 渲染一级权限 -->
              <el-col :span="5">
                <el-tag
                  closable
                  @close="removeRightById(scope.row,item1.id)"
                >{{ item1.authName }}</el-tag>
                <i class="el-icon-caret-right"></i>
              </el-col>
              <!-- 渲染二级权限 -->
              <el-col :span="19">
                <!-- 通过for循环嵌套渲染二级权限 -->
                <el-row
                  :class="[i2 === 0 ? '' : 'bdtop','vcenter']"
                  v-for="(item2, i2) in item1.children"
                  :key="item2.id"
                >
                  <el-col :span="6">
                    <el-tag
                      type="success"
                      closable
                      @close="removeRightById(scope.row,item2.id)"
                    >{{ item2.authName }}</el-tag>
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                  <el-col :span="18">
                    <!-- 通过for循环嵌套渲染三级权限 -->
                    <el-tag
                      type="warning"
                      :class="[i3 === 0 ? '':'']"
                      v-for="(item3, i3) in item2.children"
                      :key="item3.id"
                      closable
                      @close="removeRightById(scope.row,item3.id)"
                    >{{ item3.authName }}</el-tag>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
            <!-- <pre>{{ scope.row }}</pre> -->
          </template>
        </el-table-column>
        <!-- 索引列 -->
        <el-table-column
          type="index"
          label="#"
        ></el-table-column>
        <el-table-column
          label="角色名称"
          prop="roleName"
        ></el-table-column>
        <el-table-column
          label="角色描述"
          prop="roleDesc"
        ></el-table-column>
        <el-table-column
          label="操作"
          width="300"
        >
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="primary"
              icon="el-icon-edit"
              @click="showEditDialog(scope.row.id)"
            >编辑</el-button>
            <el-button
              size="mini"
              type="danger"
              icon="el-icon-delete"
              @click="removeRole(scope.row.id)"
            >删除</el-button>
            <el-button
              size="mini"
              type="warning"
              icon="el-icon-setting"
              @click="showSetRightDialog(scope.row)"
            >分配权限</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 添加角色对话框 -->
    <el-dialog
      title="添加角色"
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
        label-width="80px"
      >
        <el-form-item
          label="角色名称"
          prop="roleName"
        >
          <el-input
            v-model="addForm.roleName"
            placeholder="请输入角色名称"
          ></el-input>
        </el-form-item>
        <el-form-item
          label="角色描述"
          prop="roleDesc"
        >
          <el-input
            v-model="addForm.roleDesc"
            placeholder="请输入角色描述"
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
          @click="addRole"
        >确 定</el-button>
      </span>
    </el-dialog>

    <!-- 修改角色的对话框 -->
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
        label-width="80px"
      >
        <el-form-item
          label="角色名称"
          prop="roleName"
        >
          <el-input v-model="editForm.roleName"></el-input>
        </el-form-item>
        <el-form-item
          label="角色描述"
          prop="roleDesc"
        >
          <el-input v-model="editForm.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <span
        slot="footer"
        class="dialog-footer"
      >
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button
          type="primary"
          @click="editRole"
        >确 定</el-button>
      </span>
    </el-dialog>

    <!--  分配权限的对话框 -->
    <el-dialog
      title="提示"
      :visible.sync="setRightDialogVisible"
      width="50%"
      @close="resetDefKeys"
    >
      <!-- 树形控件 -->
      <!-- node-key="id" 通过 key 来获取或设置，则必须设置node-key。  -->
      <el-tree
        show-checkbox
        :data="rightsList"
        :props="treeProps"
        node-key="id"
        default-expand-all
        :default-checked-keys="defKeys"
        ref="treeRef"
      ></el-tree>
      <span
        slot="footer"
        class="dialog-footer"
      >
        <el-button @click="setRightDialogVisible = false">取 消</el-button>
        <el-button
          type="primary"
          @click="allotRights"
        >确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      // 所有角色列表数据
      rolelist: [],
      addDialogVisible: false,
      // 角色对象
      addForm: {
        roleName: '',
        roleDesc: ''
      },
      // 角色验证规则对象
      addFormRules: {
        roleDesc: [
          {
            required: true,
            message: '请输入角色名称',
            trigger: 'blur'
          }
        ],
        roleName: [
          {
            required: true,
            message: '请输入角色描述',
            trigger: 'blur'
          }
        ]
      },
      editDialogVisible: false,
      // 修改角色对象
      editForm: {
        roleName: '',
        roleDesc: ''
      },
      // 角色验证规则对象
      editFormRules: {
        roleDesc: [
          {
            required: true,
            message: '请输入角色名称',
            trigger: 'blur'
          }
        ],
        roleName: [
          {
            required: true,
            message: '请输入角色描述',
            trigger: 'blur'
          }
        ]
      },
      setRightDialogVisible: false,
      rightsList: [],
      treeProps: {
        label: 'authName',
        children: 'children'
      },
      // 默认选中的节点的ID值数组
      defKeys: [],
      // 接下来即将分配权限的id
      roleId: ''
    }
  },
  created() {
    this.getRolesList()
  },
  methods: {
    // 获取所有角色的列表
    async getRolesList() {
      const { data: res } = await this.$http.get('roles')

      if (res.meta.status !== 200) {
        return this.$message.error('获取角色列表失败！')
      }

      this.rolelist = res.data
      // console.log(this.rolelist)
    },
    // 监听添加角色对话框的关闭事件，重置对话框里的表单和验证结果
    addDialogClosed() {
      this.$refs.addFormRef.resetFields()
    },
    // 点击确定按钮添加角色 进行一个预验证
    addRole() {
      this.$refs.addFormRef.validate(async valid => {
        console.log(valid)
        if (!valid) return

        // 可以发送请求
        const { data: res } = await this.$http.post('roles', this.addForm)

        if (res.meta.status !== 201) {
          return this.$message.error('添加角色失败！')
        }

        this.$message.success('添加角色成功!')
        // 隐藏添加用户对话框
        this.addDialogVisible = false
        // 刷新用户列表数据
        this.getRolesList()
      })
    },
    // 监听修改角色对话框的关闭事件，重置对话框里的表单和验证结果
    editDialogClosed() {
      this.$refs.editFormRef.resetFields()
    },
    // 修改角色信息，先进行一个预验证
    editRole() {
      this.$refs.editFormRef.validate(async valid => {
        if (!valid) return
        // 发起修改角色信息的数据请求
        const { data: res } = await this.$http.put(
          'roles/' + this.editForm.roleId,
          {
            roleName: this.editForm.roleName,
            roleDesc: this.editForm.roleDesc
          }
        )
        console.log(res)
        if (res.meta.status !== 200) {
          return this.$message.error('修改角色信息失败！')
        }
        this.$message.success('修改角色信息成功！')
        // 隐藏添加角色对话框
        this.editDialogVisible = false
        // 刷新角色列表数据
        this.getRolesList()
      })
    },
    // 显示修改角色对话框
    async showEditDialog(id) {
      const { data: res } = await this.$http.get('roles/' + id)
      if (res.meta.status !== 200) {
        return this.$message.error('查询角色信息失败！')
      }
      this.editForm = res.data
      this.editDialogVisible = true
      console.log(this.editForm)
    },
    // 删除角色
    removeRole(id) {
      this.$confirm('此操作将永久删除该角色, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async () => {
          const { data: res } = await this.$http.delete('roles/' + id)
          if (res.meta.status !== 200) {
            return this.$message({
              type: 'error',
              message: '删除失败！'
            })
          }
          this.getRolesList()
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    },
    // 删除权限
    removeRightById(role, rightId) {
      // 弹框提示用户是否要删除
      this.$confirm('此操作将永久删除该权限, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        const { data: res } = await this.$http.delete(
          `roles/${role.id}/rights/${rightId}`
        )
        if (res.meta.status !== 200) {
          return this.$message.error('删除权限失败！')
        }
        this.$message({
          type: 'success',
          message: '删除权限成功!'
        });

        // this.getRolesList()
        role.children = res.data
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
      });
    },
    // 展示分配权限对话框
    async showSetRightDialog(role) {
      this.roleId = role.id
      // 获取所有权限的数据 树形结构
      const { data: res } = await this.$http.get('rights/tree')
      if (res.meta.status !== 200) {
        return this.$message.error('获取权限数据失败！')
      }
      // 将所有权限数据 接受到 rightsList
      this.rightsList = res.data

      // 递归获取所有三级节点的ID
      this.getLeafKeys(role, this.defKeys)
      this.setRightDialogVisible = true
    },
    // 已有权限的默认勾选功能
    // 在展开时将所有三级权限的ID加载到defKeys数组中，这样打开每个角色的分配权限按钮时，会将这个角色的三级权限勾选中
    // 通过递归的形式，获取角色下所有三级权限的id，并保存到defKeys数组中
    getLeafKeys(node, arr) {
      // 如果当前 node 节点不包括 children 属性，则是三级节点
      if (!node.children) {
        return arr.push(node.id)
      }

      node.children.forEach(item => {
        this.getLeafKeys(item, arr)
      })
    },
    // 监听分配权限对话框的关闭，重置 defKeys 数组的值
    resetDefKeys() {
      this.defKeys = []
    },
    // 点击为角色分配权限 ...为展开运算符,将一个数组转为用逗号分隔的参数序列
    async allotRights() {
      const keys = [
        ...this.$refs.treeRef.getCheckedKeys(),
        ...this.$refs.treeRef.getHalfCheckedKeys()
      ]
      const idStr = keys.join(',')

      const { data: res } = await this.$http.post(
        `roles/${this.roleId}/rights`,
        { rids: idStr }
      )

      if (res.meta.status !== 200) {
        return this.$message.error('分配权限失败！')
      }

      this.$message.success('分配权限成功！')
      this.getRolesList()
      this.setRightDialogVisible = false
    }
  }
}
</script>

<style lang="less" scoped>
.el-tag {
  margin: 7px;
}
.bdtop {
  border-top: 1px solid #eee;
}
.bdbottom {
  border-bottom: 1px solid #eee;
}
// 给角色列表每个row居中
.vcenter {
  display: flex;
  align-items: center;
}
</style>
