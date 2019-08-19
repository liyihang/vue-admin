<template>
  <div>
    <!-- user roles breadcrumb -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>角色管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-button type="primary" @click="showRolesDialog">添加角色</el-button>
      <el-table :data="rolesList" border stripe>
        <el-table-column type="expand">
          <template slot-scope="scope">
            <!-- 循环一级权限 -->
            <el-row
              v-for="item in scope.row.children"
              :key="item.id"
              style="border-bottom: 1px solid lightblue"
            >
              <el-col :span="5">
                <el-tag closable @close="removeRight(scope.row,item.id)">{{item.authName}}</el-tag>
              </el-col>
              <el-col :span="19">
                <el-row v-for="itemSon in item.children" :key="itemSon.id">
                  <el-col :span="5">
                    <el-tag
                      @close="removeRight(scope.row,itemSon.id)"
                      type="success"
                      closable
                    >{{itemSon.authName}}</el-tag>
                  </el-col>
                  <el-col :span="19">
                    <el-tag
                      type="info"
                      v-for="itemgrandson in itemSon.children"
                      :key="itemgrandson.id"
                      closable
                      @close="removeRight(scope.row,itemgrandson.id)"
                    >{{itemgrandson.authName}}</el-tag>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <el-table-column type="index"></el-table-column>
        <el-table-column label="角色名称" prop="roleName"></el-table-column>
        <el-table-column label="角色描述" prop="roleDesc"></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
              @click="showEdit(scope.row.id)"
            ></el-button>
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
              @click="removeRole(scope.row.id)"
            ></el-button>
            <el-tooltip effect="light" content="设置角色权限" placement="top">
              <el-button
                type="warning"
                icon="el-icon-setting"
                size="mini"
                @click="getPrivateList(scope.row)"
              ></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <!-- role add dialog -->
    <el-dialog title="添加角色" :visible.sync="AddRolesdialogVisible" width="30%" @close="closeDialog">
      <el-form
        :model="AddRolesForm"
        :rules="Rolesrules"
        ref="RolesFormRef"
        label-width="80px"
        class="demo-ruleForm"
      >
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="AddRolesForm.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input v-model="AddRolesForm.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="AddRolesdialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="AddRoles">确 定</el-button>
      </span>
    </el-dialog>
    <!-- role edit dialog -->
    <el-dialog title="添加角色" :visible.sync="editolesdialogVisible" width="30%">
      <el-form
        :model="editRolesForm"
        :rules="editRolesrules"
        ref="editRolesFormRef"
        label-width="80px"
        class="demo-ruleForm"
      >
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="editRolesForm.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input v-model="editRolesForm.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editolesdialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveRoles">确 定</el-button>
      </span>
    </el-dialog>
    <!-- assign role privilige dialog -->
    <el-dialog title="提示" :visible.sync="privateDialogVisible" width="40%">
      <el-tree
        ref="tree"
        :data="privateTree"
        :props="priData"
        show-checkbox
        default-expand-all
        node-key="id"
        :default-checked-keys="defaultCheckedItem"
      ></el-tree>
      <span slot="footer" class="dialog-footer">
        <el-button @click="privateDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveRight">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data () {
    return {
      // role privilege assign data
      privateDialogVisible: false,
      privateTree: [],
      priData: {
        label: 'authName',
        children: 'children'
      },
      defaultCheckedItem: [],
      roleId: '',
      // edit
      editolesdialogVisible: false,
      editRolesForm: {
        roleName: '',
        roleDesc: ''
      },
      editRolesrules: {
        roleName: [
          { required: true, message: '请输入角色名称', trigger: 'blur' }
        ],
        roleDesc: [
          { required: true, message: '请输入角色描述', trigger: 'blur' }
        ]

      },
      // roles list
      rolesList: [],
      //   show dialog or not
      AddRolesdialogVisible: false,
      //   roles form
      AddRolesForm: {
        roleName: '',
        roleDesc: ''
      },
      // validate rules
      Rolesrules: {
        roleName: [
          { required: true, message: '请输入角色名称', trigger: 'blur' }
        ],
        roleDesc: [
          { required: true, message: '请输入角色描述', trigger: 'blur' }
        ]
      }
    }
  },
  created () {
    this.getRolesList()
  },
  methods: {
    // get roles list
    async getRolesList () {
      const { data: res } = await this.$http.get('roles')
      if (res.meta.status !== 200) {
        return this.$message.error('获取角色列表失败！')
      }
      this.rolesList = res.data
    },
    // show dialog
    showRolesDialog () {
      this.AddRolesdialogVisible = true
    },
    // close dialog
    closeDialog () {
      this.$refs.RolesFormRef.resetFields()
    },
    // add roles
    AddRoles () {
      this.$refs.RolesFormRef.validate(async valid => {
        if (!valid) return
        const { data: res } = await this.$http.post('roles', this.AddRolesForm)
        if (res.meta.status !== 201) {
          this.$message.error('添加角色失败！')
        }
        this.$message.success('添加角色成功！')
        this.AddRolesdialogVisible = false
        this.getRolesList()
      })
    },
    // edit role
    async showEdit (id) {
      this.editolesdialogVisible = true
      const { data: res } = await this.$http.get('roles/' + id)
      this.editRolesForm = res.data
    },
    // save roles infomation
    saveRoles () {
      this.$refs.editRolesFormRef.validate(async valid => {
        if (!valid) return
        const { data: res } = await this.$http.put('roles/' + this.editRolesForm.roleId, this.editRolesForm)
        if (res.meta.status !== 200) {
          return this.$message.error('修改失败')
        }
        this.$message.success('修改成功！')
        this.getRolesList()
        this.editolesdialogVisible = false
      })
    },
    // remove roles
    async removeRole (id) {
      const confirmRes = await this.$confirm('确认删除角色？', '提示', {
        confirmButtonText: 'confirm',
        cancelButtonText: 'cancel',
        type: 'warning'
      }).catch((err) => { return err })
      if (confirmRes !== 'confirm') {
        return this.$message({
          type: 'warning',
          message: '取消删除'
        })
      }
      const { data: res } = await this.$http.delete('roles/' + id)
      if (res.meta.status !== 200) {
        return this.$message.error('删除失败！')
      }
      this.$message.success('删除成功！')
      this.getRolesList()
    },
    // remove right
    async removeRight (role, id) {
      const confirmRes = await this.$confirm('确认删除该权限？, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)
      if (confirmRes !== 'confirm') {
        return this.$message.error('已经取消删除')
      }
      const { data: res } = await this.$http.delete(`roles/${role.id}/rights/${id}`)
      console.log(res)

      if (res.meta.status !== 200) {
        return this.$message.error('获取数据失败')
      }
      this.$message.success('删除成功！')
      role.children = res.data
    },
    async getPrivateList (role) {
      this.roleId = role.id
      const { data: res } = await this.$http.get('rights/tree')
      if (res.meta.status !== 200) {
        return this.$message.error('获取所有权限失败')
      }
      this.privateTree = res.data
      // console.log(res)
      const keys = []
      // console.log(role)
      this.getLeafId(role, keys)
      this.defaultCheckedItem = keys
      console.log(this.defaultCheckedItem);
      this.privateDialogVisible = true

    },
    //recursive to get all three leave id
    getLeafId (node, keyArr) {
      if (!node.children) {
        return keyArr.push(node.id)
      }
      node.children.forEach(item => this.getLeafId(item, keyArr))
    },
    // save rights
    async saveRight () {
      // get full checked checkbox
      const full = this.$refs.tree.getCheckedKeys()
      // get half checked checkbox
      const half = this.$refs.tree.getHalfCheckedKeys()
      // join two arrays
      const ids = [...full, ...half].join(',')
      const { data: res } = await this.$http.post(`roles/${this.roleId}/rights`, { rids: ids })
      if (res.meta.status !== 200) {
        return this.$message.error('分配权限失败')
      }
      this.$message.success('分配权限成功！')
      this.privateDialogVisible = false
    }
  }
}
</script>

<style scoped>
.el-tag {
  margin: 5px;
}
</style>
