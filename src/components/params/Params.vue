<template>
  <div>
    <!-- breadcrumb -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>参数列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- card -->
    <el-card>
      <!-- notice area -->
      <el-alert type="warning" title="请务必选择三级分类！" :closable="false"></el-alert>
      <!-- cascader area -->
      <el-row>
        <el-col :span="24">
          <span>
            选择分类：
            <el-cascader
              expand-trigger="hover"
              v-model="cateValue"
              :options="cateList"
              :props="cateProps"
              @change="handleChange"
            ></el-cascader>
          </span>
        </el-col>
      </el-row>
      <!-- tab area -->
      <el-tabs v-model="activeName" @tab-click="handleChangeParam">
        <el-tab-pane label="动态参数" name="many">
          <el-button
            type="primary"
            size="mini"
            :disabled="isDisabled"
            @click="addDialogVisible=true"
          >添加参数</el-button>
          <el-table :data="manyData" border stripe>
            <el-table-column type="expand">
              <!-- expand column -->
              <template slot-scope="scope">
                <el-tag
                  :key="tag"
                  v-for="(tag,i) in scope.row.attr_vals"
                  closable
                  :disable-transitions="false"
                  @close="handleClose(scope.row,i)"
                >{{tag}}</el-tag>
                <el-input
                  class="input-new-tag"
                  v-if="inputVisible"
                  v-model="inputValue"
                  ref="saveTagInput"
                  size="small"
                  @keyup.enter.native="handleInputConfirm(scope.row)"
                  @blur="handleInputConfirm(scope.row)"
                ></el-input>
                <el-button v-else class="button-new-tag" size="small" @click="showInput">+ New Tag</el-button>
              </template>
            </el-table-column>
            <el-table-column type="index"></el-table-column>
            <el-table-column label="参数名称" prop="attr_name"></el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button type="primary" size="mini" @click="editDialog(scope.row)">
                  <i class="el-icon-edit"></i>
                </el-button>
                <el-button type="danger" size="mini" @click="removeParam(scope.row.attr_id)">
                  <i class="el-icon-delete"></i>
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="静态参数" name="only">
          <el-button
            type="primary"
            size="mini"
            :disabled="isDisabled"
            @click="addDialogVisible=true"
          >添加属性</el-button>
          <el-table :data="onlyData" border stripe>
            <el-table-column type="expand">
              <!-- expand column -->
              <template slot-scope="scope">
                <el-tag
                  :key="tag"
                  v-for="(tag,i) in scope.row.attr_vals"
                  closable
                  :disable-transitions="false"
                  @close="handleClose(scope.row,i)"
                >{{tag}}</el-tag>
                <el-input
                  class="input-new-tag"
                  v-if="inputVisible"
                  v-model="inputValue"
                  ref="saveTagInput"
                  size="small"
                  @keyup.enter.native="handleInputConfirm(scope.row)"
                  @blur="handleInputConfirm(scope.row)"
                ></el-input>
                <el-button v-else class="button-new-tag" size="small" @click="showInput">+ New Tag</el-button>
              </template>
            </el-table-column>
            <el-table-column type="index"></el-table-column>
            <el-table-column label="参数名称" prop="attr_name"></el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button type="primary" size="mini" @click="editDialog(scope.row)">
                  <i class="el-icon-edit"></i>
                </el-button>
                <el-button type="danger" size="mini" @click="removeParam(scope.row.attr_id)">
                  <i class="el-icon-delete"></i>
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </el-card>
    <!-- stable and dynamic dialog -->
    <el-dialog
      :title="activeName==='many'?'添加动态参数':'添加静态参数'"
      :visible.sync="addDialogVisible"
      width="50%"
      @close="closeDialog"
    >
      <el-form
        :model="addForm"
        :rules="addrules"
        ref="addFormRef"
        label-width="100px"
        class="demo-ruleForm"
      >
        <el-form-item :label="activeName==='many'?'动态参数':'静态参数'" prop="attr_name">
          <el-input v-model="addForm.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveParam">确 定</el-button>
      </span>
    </el-dialog>
    <!-- edit dialog -->
    <el-dialog
      :title="activeName==='many'?'编辑动态参数':'编辑静态参数'"
      :visible.sync="editDialogVisiable"
      width="50%"
      @close="closeEditDialog"
    >
      <el-form
        :model="editForm"
        :rules="editRules"
        ref="editFormRef"
        label-width="100px"
        class="demo-ruleForm"
      >
        <el-form-item :label="activeName==='many'?'动态参数':'静态参数'" prop="attr_name">
          <el-input v-model="editForm.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisiable = false">取 消</el-button>
        <el-button type="primary" @click="saveEditParam">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data () {
    return {
      cateList: [],
      cateValue: [],
      cateProps: {
        value: 'cat_id',
        label: 'cat_name',
        children: 'children'
      },
      activeName: 'many',
      // static data
      onlyData: [],
      // dynamic data
      manyData: [],
      // dialog show or not
      addDialogVisible: false,
      // addform
      addForm: {
        // add params name
        attr_name: ''
      },
      addrules: {
        attr_name: [{ required: true, message: '请添加参数名称', triggle: 'blur' }]
      },
      // edit dialog
      editDialogVisiable: false,
      editForm: {
        // attr_name:''
      },
      editRules: {
        attr_name: [{ required: true, message: '请添加参数名称', triggle: 'blur' }]
      },
      // expand column tags input show or not
      inputVisible: '',
      // input value
      inputValue: ''
    }
  },
  created () {
    this.getCateList()
  },
  methods: {
    // get cate List
    async getCateList () {
      const { data: res } = await this.$http.get('categories', { params: { type: 3 } })
      if (res.meta.status !== 200) {
        return this.$message.error('获取分类失败')
      }
      this.cateList = res.data
    },
    handleChange () {
      if (this.cateValue.length !== 3) {
        this.cateValue = []
        this.manyData = []
        this.onlyData = []
      } else {
        this.getAttributes()
      }
    },
    async getAttributes () {
      const { data: res } = await this.$http.get(`categories/${this.cateId}/attributes`, { params: { sel: this.activeName } })
      if (res.meta.status !== 200) {
        this.$message.error('获取数据失败')
      }
      res.data.forEach(item => {
        const arr = item.attr_vals.split(' ')
        item.attr_vals = arr
      });
      if (this.activeName === 'many') {
        this.manyData = res.data
      } else {
        this.onlyData = res.data
      }
    },
    // tab change
    handleChangeParam () {
      if (!this.cateId) return
      this.getAttributes()
    },
    // shutdown the dialog
    closeDialog () {
      this.$refs.addFormRef.resetFields()
    },
    // save params
    saveParam () {
      this.$refs.addFormRef.validate(async valid => {
        if (!valid) return false
        const { data: res } = await this.$http.post(`categories/${this.cateId}/attributes`, {
          attr_name: this.addForm.attr_name,
          attr_sel: this.activeName
        })
        if (res.meta.status !== 201) {
          return this.$message.error('添加参数失败')
        }
        this.$message.success('参数添加成功')
        this.getAttributes()
        this.addDialogVisible = false
      })
    },
    // close edit dialog
    closeEditDialog () {
      this.$refs.editFormRef.resetFields()
    },
    // params edit
    editDialog (row) {
      this.editDialogVisiable = true
      this.editForm = row
      // console.log(this.editForm)
    },
    // save edit pram
    saveEditParam () {
      this.$refs.editFormRef.validate(async valid => {
        if (!valid) return false
        const { data: res } = await this.$http.put(`categories/${this.cateId}/attributes/${this.editForm.attr_id}`, {
          attr_name: this.editForm.attr_name,
          attr_sel: this.activeName
        })
        if (res.meta.status !== 200) {
          return this.$message.error('更新失败')
        }
        this.$message.success('更新成功')
        this.getAttributes()
        this.editDialogVisiable = false
      })
    },
    // delete params
    async removeParam (id) {
      const confirmRes = await this.$confirm('是否删除此属性参数？, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)
      if (confirmRes !== 'confirm') {
        return this.$message.warning('已取消删除！')
      }
      const { data: res } = await this.$http.delete(`categories/${this.cateId}/attributes/${id}`)
      if (res.meta.status !== 200) {
        this.$message.error('删除失败')
      }
      this.$message.success('删除成功')
      this.getAttributes()
    },
    async handleInputConfirm (row) {
      // if the empty data return
      if (this.inputValue.trim().length === 0) return
      // push new tag to row
      if (this.inputValue.trim().length > 0) {
        row.attr_vals.push(this.inputValue.trim())
        // input hidden and clean the value
        this.inputValue = ''
      }
      this.inputVisible = false
      const { data: res } = await this.$http.put(`categories/${row.cat_id}/attributes/${row.attr_id}`, {
        attr_name: row.attr_name,
        attr_sel: row.attr_sel,
        attr_vals: row.attr_vals.join(' ')
      })
      if (res.meta.status !== 200) {
        return this.$message.error('添加标签失败！')
      }
    },
    // show input
    showInput () {
      this.inputVisible = true
      this.$nextTick(_ => {
        this.$refs.saveTagInput.$refs.input.focus()
      })
    },
    async handleClose (tag, i) {
      console.log(tag)
      tag.attr_vals.splice(i, 1)
      const { data: res } = await this.$http.delete(`categories/${tag.cat_id}/attributes/${tag.attr_id}`)
      if (res.meta.status !== 200) {
        return this.$message.error("删除标签失败")
      }
      this.$message.success('删除成功')
    }
  },
  computed: {
    //   button is disabled or not
    isDisabled: function () {
      if (this.cateValue.length === 3) {
        return false
      }
      return true
    },
    // get cateID
    cateId: function () {
      if (this.cateValue.length === 3) {
        return this.cateValue[2]
      }
      return null
    }
  }
}
</script>

<style scoped>
.el-alert {
  margin-bottom: 15px;
}
.el-tag {
  margin: 10px 5px;
}
.input-new-tag {
  width: 100px;
}
</style>
