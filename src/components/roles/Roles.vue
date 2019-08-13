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
            <el-tooltip effect="light" content="设置角色" placement="top">
              <el-button type="warning" icon="el-icon-setting" size="mini"></el-button>
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
  </div>
</template>

<script>
export default {
  data () {
    return {
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
    }
  },
}
</script>

<style lang="less" scoped>
</style>
