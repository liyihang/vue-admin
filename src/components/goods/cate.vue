<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-button type="primary" @click="showAddDialog">添加分类</el-button>
      <tree-table
        style="margin-top:15px"
        :data="cateList"
        :selection-type="false"
        :expand-type="false"
        :columns="columns"
        border
        show-index
        index-text="#"
      >
        <template slot="iseffective" slot-scope="scope">
          <i class="el-icon-circle-check" style="color:green" v-if="scope.row.cat_deleted==false"></i>
          <i class="el-icon-circle-close" style="color:red" v-else></i>
        </template>
        <!-- sort leave-->
        <template slot="sort" slot-scope="scope">
          <el-tag size="mini" v-if="scope.row.cat_level===0">一级</el-tag>
          <el-tag size="mini" type="warning" v-else-if="scope.row.cat_level===1">二级</el-tag>
          <el-tag size="mini" type="success" v-else>三级</el-tag>
        </template>
        <!-- operation -->
        <template slot="opt" slot-scope="scope">
          <el-button type="primary" size="mini" @click="showEditDialog(scope.row.cat_id)">
            <i class="el-icon-edit"></i>
          </el-button>
          <el-button type="danger" size="mini" @click="remove(scope.row.cat_id)">
            <i class="el-icon-delete"></i>
          </el-button>
        </template>
      </tree-table>
      <!-- pagination -->
      <el-pagination
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-size="queryInfo.pagesize"
        layout="total, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </el-card>
    <!-- dialog -->
    <el-dialog title="添加分类" :visible.sync="addCateDialogVisible" width="40%" @close="dialogClosed">
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px">
        <el-form-item label="分类名称" prop="cat_name">
          <el-input v-model="ruleForm.cat_name"></el-input>
        </el-form-item>
        <el-form-item label="父级分类" prop="name">
          <el-cascader
            v-model="selectedCate"
            :options="categoryList"
            expand-trigger="hover"
            :props="cascaderPro"
            @change="cateChange"
            clearable
          ></el-cascader>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addCateDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addCate">确 定</el-button>
      </span>
    </el-dialog>
    <!-- edit dialog -->
    <el-dialog title="编辑分类" :visible.sync="editdialogVisible" width="50%" @close="closeEditDialog">
      <el-form :model="editRuleForm" :rules="editRules" ref="editFormRef" label-width="100px">
        <el-form-item label="分类名称" prop="cat_name">
          <el-input v-model="editRuleForm.cat_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editdialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveCategory">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import { async } from 'q';
import { log } from 'util';
export default {
  data () {
    return {
      // query info
      queryInfo: {
        type: 3,
        pagenum: 1,
        pagesize: 5
      },
      //   category list
      cateList: [],
      //   total data
      total: 0,
      //   tree data component
      columns: [
        {
          label: '分类名称',
          prop: 'cat_name'
        },
        {
          label: '是否有效',
          prop: 'cat_deleted',
          type: 'template',
          template: 'iseffective'
        },
        {
          label: '排序',
          prop: 'cat_level',
          type: 'template',
          template: 'sort'
        },
        {
          label: '操作',
          type: 'template',
          template: 'opt'
        }
      ],
      // control the dialog show or not
      addCateDialogVisible: false,
      // category info
      ruleForm: {
        cat_id: 0,
        cat_name: '',
        cat_level: ''

      },
      rules: {
        cat_name: [{ required: true, message: '请输入分类名称', trigger: 'blur' }]
      },
      // cate list
      categoryList: [],
      // cascader config
      cascaderPro: {
        value: 'cat_id',
        label: 'cat_name',
        children: 'children'
      },
      selectedCate: [],
      // edit category
      editdialogVisible: false,
      editRuleForm: {
        cat_name: ''
      },
      editRules: {
        cat_name: [{ required: true, message: '请输入分类名称', trigger: 'blur' }]
      }
    }
  },
  created () {
    this.getCateList()
  },
  methods: {
    //   get category list
    async getCateList () {
      const { data: res } = await this.$http.get('categories', { params: this.queryInfo })
      if (res.meta.status !== 200) {
        return this.$message.error('获取分类失败！')
      }
      this.cateList = res.data.result
      this.total = res.data.total
    },
    handleCurrentChange (newPage) {
      this.queryInfo.pagenum = newPage
      this.getCateList()
    },
    // show dialog
    async showAddDialog () {
      const { data: res } = await this.$http.get('categories', { params: { type: 2 } })
      if (res.meta.status !== 200) {
        return this.$message.error('获取分类失败！')
      }
      this.categoryList = res.data
      this.addCateDialogVisible = true
    },
    cateChange () {
      console.log(this.selectedCate);
      if (this.selectedCate.length === 0) {
        this.ruleForm.cat_pid = 0
        this.ruleForm.cat_level = 0
      } else {
        this.ruleForm.cat_pid = this.selectedCate[this.selectedCate.length - 1]
        this.ruleForm.cat_level = this.selectedCate.length
        console.log(this.ruleForm);

      }
    },

    // close dialog and reset form
    dialogClosed () {
      // reset form
      this.$refs.ruleForm.resetFields()
      // reset selected item
      this.selectedCate = []
      // reset pid
      this.ruleForm.cat_pid = 0
      this.ruleForm.cat_level = 0
    },
    addCate () {
      this.$refs.ruleForm.validate(async valid => {
        if (!valid) return
        const { data: res } = await this.$http.post('categories', this.ruleForm)
        if (res.meta.status !== 201) {
          return this.$message.error('添加分类失败！！')
        }
        this.$message.success('添加分类成功')
        this.addCateDialogVisible = false
        this.getCateList()
      })
    },
    async showEditDialog (id) {
      const { data: res } = await this.$http.get('categories/' + id)
      if (res.meta.status !== 200) {
        return this.$message.error('获取数据失败！')
      }
      this.editRuleForm = res.data
      this.editdialogVisible = true
    },
    // close dialog
    closeEditDialog () {
      this.closeEditDialog = false
    },
    // save category
    saveCategory () {
      this.$refs.editFormRef.validate(async valid => {
        if (!valid) return
        const { data: res } = await this.$http.put('categories/' + this.editRuleForm.cat_id, { cat_name: this.editRuleForm.cat_name })
        if (res.meta.status !== 200) {
          return this.$message.error('更新失败')
        }
        this.$message.success('更新成功')
        this.editdialogVisible = false
        this.getCateList()
      })
    },
    async remove (id) {
      const confirmRes = await this.$confirm('是否删除该分类, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)
      if (confirmRes !== 'confirm') {
        return this.$message({
          type: 'info',
          message: '已取消删除'
        })
      }
      const {data:res} = await this.$http.delete('categories/'+id)
      if(res.meta.status !== 200){
        return this.$message.error('删除失败')
      }
      this.$message.success('删除成功')
      this.getCateList()
    }
  }
}
</script>

<style scoped>
</style>
