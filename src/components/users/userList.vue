<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>
        <a href="/">用户管理</a>
      </el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- el-card区域 -->
    <el-card>
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input
            placeholder="请输入内容"
            class="input-with-select"
            v-model="queryInfo.query"
            clearable
            @clear="getUserList"
          >
            <el-button slot="append" icon="el-icon-search" @click="getUserList"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="addDialogVisible=true">添加用户</el-button>
        </el-col>
      </el-row>

      <!-- table area -->
      <el-table :data="userList" border stripe>
        <el-table-column type="index"></el-table-column>
        <el-table-column label="姓名" prop="username"></el-table-column>
        <el-table-column label="邮箱" prop="email"></el-table-column>
        <el-table-column label="电话" prop="mobile"></el-table-column>
        <el-table-column label="角色" prop="role_name"></el-table-column>
        <el-table-column label="状态">
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.mg_state"
              @change="stateChange(scope.row.id,scope.row.mg_state)"
            ></el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="200px">
          <template slot-scope="scope">
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
              @click="userEdit(scope.row.id)"
            ></el-button>
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
              @click="userDel(scope.row.id)"
            ></el-button>
            <el-tooltip effect="dark" content="分配权限" placement="top" :enterable="false">
              <el-button
                type="warning"
                icon="el-icon-setting"
                size="mini"
                @click="showRolesAssignDialog(scope.row)"
              ></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <!-- pagination -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[1, 5, 10, 20]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </el-card>
    <!-- dialog -->
    <el-dialog title="添加用户" :visible.sync="addDialogVisible" width="40%" @close="closeDialog">
      <!-- add user  form -->
      <el-form
        :model="addForm"
        :rules="addRules"
        ref="addRuleForm"
        label-width="100px"
        class="demo-ruleForm"
      >
        <el-form-item label="用户名" prop="username">
          <el-input v-model="addForm.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="addForm.password"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="addForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="mobile">
          <el-input v-model="addForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addUser">确 定</el-button>
      </span>
    </el-dialog>
    <!-- user edit dialog -->
    <el-dialog title="用户编辑" :visible.sync="EditUserDialogVisible" width="30%">
      <!-- userEdit form -->
      <el-form
        :model="EditForm"
        :rules="editRules"
        ref="editUserRef"
        label-width="100px"
        class="demo-ruleForm"
      >
        <el-form-item label="用户名" prop="username">
          <el-input v-model="EditForm.username" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="EditForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="mobile">
          <el-input v-model="EditForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="EditUserDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveUserInfo">确 定</el-button>
      </span>
    </el-dialog>
    <!-- privilege  assignment dialog-->
    <el-dialog title="分配角色" :visible.sync="RolesAssignDialogVisible" width="40%">
      <p>当前用户名：{{RolesInfo.username}}</p>
      <p>当前角色：{{RolesInfo.role_name}}</p>
      <p>
        分配新角色：
        <el-select v-model="newRoleId" placeholder="请选择">
          <el-option
            v-for="item in RolesList"
            :key="item.id"
            :label="item.roleName"
            :value="item.id"
          ></el-option>
        </el-select>
      </p>
      <span slot="footer" class="dialog-footer">
        <el-button @click="RolesAssignDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveRoleAssignInfo">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data () {
    // user define validate rule for email
    const checkMail = (rule, value, callback) => {
      if (!value.trim()) {
        return callback(new Error('请添加邮箱！'))
      }
      if (/^[A-Za-z0-9\u4e00-\u9fa5]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/.test(value)) {
        callback()
      } else {
        callback(new Error('邮箱格式不正确'))
      }
    }

    return {
      // roles assignment private
      RolesAssignDialogVisible: false,
      // user info
      RolesInfo: {},
      // all roles list
      RolesList: [],
      // assign new role id
      newRoleId: '',
      // edit form rules
      editRules: {
        email: [
          { validator: checkMail, trigger: 'blur' },
          { required: true, message: '请输入邮箱', trigger: 'blur' }],
        mobile: [{ required: true, message: '请输入手机号码', trigger: 'blur' }]
      },
      // edit form
      EditForm: {
        username: '',
        email: '',
        mobile: ''
      },
      // edit dialog form
      EditUserDialogVisible: false,
      // dialog  form
      addDialogVisible: false,
      userList: [],
      // query info
      queryInfo: {
        // query info
        query: '',
        // pagenum
        pagenum: 1,
        // pagesize
        pagesize: 2
      },
      total: 0,
      //   add user form
      addForm: {
        username: '',
        password: '',
        email: '',
        mobile: ''
      },
      // add user form validate
      addRules: {
        username: [{ required: true, message: '用户名不能为空', trigger: 'blur' }],
        password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
        email: [
          { validator: checkMail, trigger: 'blur' },
          { required: true, message: '请输入邮箱', trigger: 'blur' }],
        mobile: [{ required: true, message: '请输入手机号码', trigger: 'blur' }]
      }
    }
  },
  created () {
    this.getUserList()
  },
  methods: {
    // get userlist
    async getUserList () {
      const { data: res } = await this.$http.get('users', { params: this.queryInfo })
      if (res.meta.status !== 200) {
        return this.$message.error('查询用户列表失败！')
      }
      this.userList = res.data.users
      this.total = res.data.total
      // console.log(res)
    },
    // handle pagesize change
    handleSizeChange (newSize) {
      this.queryInfo.pagesize = newSize
      this.getUserList()
    },
    // handle page num change
    handleCurrentChange (newPage) {
      this.queryInfo.pagenum = newPage
      this.getUserList()
    },
    // user state change
    async stateChange (id, state) {
      const { data: res } = await this.$http.put(`users/${id}/state/${state}`)
      if (res.meta.status !== 200) {
        return this.$message.error('状态修改失败！')
      }
    },
    closeDialog () {
      this.$refs.addRuleForm.resetFields()
    },
    // add user
    addUser () {
      this.$refs.addRuleForm.validate(async valid => {
        if (!valid) return
        const { data: res } = await this.$http.post('users', this.addForm)
        if (res.meta.status !== 201) return this.$message('添加用户失败')
        this.$message.success('添加成功！')
        this.addDialogVisible = false
        this.getUserList()
      })
    },
    // user delete
    async userDel (id) {
      const confirmRes = await this.$confirm('是否删除该用户, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(error => error)
      if (confirmRes !== 'confirm') {
        return this.$message({
          type: 'info',
          message: '已取消删除'
        })
      }
      const { data: res } = await this.$http.delete('users/' + id)
      if (res.meta.status !== 200) {
        return this.$message({
          type: 'danger',
          message: '删除失败'
        })
      }
      this.$message({
        type: 'success',
        message: '删除成功'
      })
      this.getUserList()
    },
    // user eidt
    async userEdit (id) {
      // get Data before edit
      const { data: res } = await this.$http.get('users/' + id)
      if (res.meta.status !== 200) {
        return this.$message.error('获取用户信息失败！')
      }
      this.EditForm = res.data
      this.EditUserDialogVisible = true
    },
    // sava user infomation
    saveUserInfo () {
      this.$refs.editUserRef.validate(async valid => {
        if (!valid) {
          return
        }
        const { data: res } = await this.$http.put('users/' + this.EditForm.id, this.EditForm)
        if (res.meta.status !== 200) {
          return this.$message.error('更新用户信息失败！')
        }
        this.$message.success('更新用户信息成功！')
        this.getUserList()
        this.EditUserDialogVisible = false
      })
    },
    // show roles assignment dialog
    async showRolesAssignDialog (roleInfo) {
      this.RolesAssignDialogVisible = true
      this.RolesInfo = roleInfo
      const {data:res} = await this.$http.get('roles')
      if(res.meta.status !==200){
        return this.$message.error('获取角色类别失败！')
      }
      this.RolesList = res.data
      console.log(this.RolesInfo);
    },
    // save Role Assign Info
    async saveRoleAssignInfo () {
      if(!this.newRoleId){
        return this.$message.warning('请选择新角色！')
      }
      const {data:res}=await this.$http.put('users/'+this.RolesInfo.id+'/role',{rid:this.newRoleId})
      if(res.meta.status!==200){
        return this.$message.error('分配角色失败！')
      }
      this.$message.success('分配角色成功！')
      this.RolesAssignDialogVisible = false
      this.getUserList()
    }
  }
}
</script>
<style lang="less" scoped>
</style>
