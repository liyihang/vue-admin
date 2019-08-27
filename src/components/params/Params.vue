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
      <el-tabs v-model="activeName" @tab-click="handleChange">
        <el-tab-pane label="动态参数" name="many">
          <el-button type="primary" size="mini" :disabled="isDisabled">添加参数</el-button>
          <el-table :data="manyData" border stripe>
            <el-table-column type="expand"></el-table-column>
            <el-table-column type="index"></el-table-column>
            <el-table-column label="参数名称" prop="attr_name"></el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button type="primary" size="mini">
                  <i class="el-icon-edit"></i>
                </el-button>
                <el-button type="danger" size="mini">
                  <i class="el-icon-delete"></i>
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="静态参数" name="only">
          <el-table :data="onlyData" border stripe>
            <el-table-column type="expand"></el-table-column>
            <el-table-column type="index"></el-table-column>
            <el-table-column label="参数名称" prop="attr_name"></el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button type="primary" size="mini">
                  <i class="el-icon-edit"></i>
                </el-button>
                <el-button type="danger" size="mini">
                  <i class="el-icon-delete"></i>
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </el-card>
    
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
      //   静态数据
      onlyData: [],
      //   动态数据
      manyData: []
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
      if (this.activeName === 'many') {
        this.manyData = res.data
      } else {
        this.onlyData = res.data
      }
    },
    // tab change
    handleChange () {
      if (!this.cateId) return
      this.getAttributes()
    }
  },
  computed: {
    //   button is disabled
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
  },
}
</script>

<style scoped>
.el-alert {
  margin-bottom: 15px;
}
</style>
