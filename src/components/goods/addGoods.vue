<template>
  <div>
    <!-- breadcrumb -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品添加</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- el-card -->
    <el-card>
      <!-- alert message -->
      <el-alert title="请添加商品信息" type="info" show-icon center :closable="false"></el-alert>
      <!-- steps -->
      <el-steps :space="200" :active="1" align-center finish-status="success">
        <el-step title="基本信息"></el-step>
        <el-step title="商品参数"></el-step>
        <el-step title="商品属性"></el-step>
        <el-step title="商品图片"></el-step>
        <el-step title="商品内容"></el-step>
        <el-step title="完成"></el-step>
      </el-steps>
      <!-- tab pane -->
      <el-form :model="addForm" :rules="addRules" ref="addRef" label-position="top">
        <el-tabs
          v-model="activeName"
          tab-position="left"
          :before-leave="beforeTabLeave"
          @tab-click="tabClick"
        >
          <el-tab-pane label="基本信息" name="0">
            <el-form-item label="商品名称" prop="goods_name">
              <el-input v-model="addForm.goods_name"></el-input>
            </el-form-item>
            <el-form-item label="商品价格" prop="goods_price">
              <el-input v-model="addForm.goods_price" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品重量" prop="goods_weight">
              <el-input v-model="addForm.goods_weight" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品数量" prop="goods_num">
              <el-input v-model="addForm.goods_num" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品分类" prop="goods_cat">
              <el-cascader
                v-model="addForm.goods_cat"
                :options="cateList"
                :props="cascaderProp"
                @change="handleChange"
              ></el-cascader>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品参数" name="1">
           <el-form-item :label="item.attr_name" v-for="(item, index) in manyData" :key="index">
              <el-checkbox-group v-model="item.attr_vals">
              <el-checkbox border  :label="val" v-for="(val, index) in item.attr_vals" :key="index"></el-checkbox>
            </el-checkbox-group>
           </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品属性" name="2">角色管理</el-tab-pane>
          <el-tab-pane label="商品图片" name="3">定时任务补偿</el-tab-pane>
          <el-tab-pane label="商品内容" name="4">定时任务补偿</el-tab-pane>
        </el-tabs>
      </el-form>
    </el-card>
  </div>
</template>

<script>
export default {
  data () {
    return {
      // active pane name
      activeName: '0',
      // addForm data object
      addForm: {
        goods_name: '',
        goods_cat: [],
        goods_price: '',
        goods_number: '',
        goods_weight: '',
        goods_introduce: '',
        pics: [],
        atrrs: [],
      },
      cascaderProp: {
        value: 'cat_id',
        label: 'cat_name',
        children: 'children'
      },
      // addRules
      addRules: {
        goods_name: [
          { required: true, message: '请输入商品名称', trigger: 'blur' }
        ],
        goods_price: [
          { required: true, message: '请输入商品价格', trigger: 'blur' }
        ],
        goods_weight: [
          { required: true, message: '请输入商品重量', trigger: 'blur' }
        ],
        goods_num: [
          { required: true, message: '请输入商品数量', trigger: 'blur' }
        ],
        goods_cat: [
          { required: true, message: '请输入商品分类', trigger: 'blur' }
        ]
      },
      cateList: [],
      manyData:[]
    }
  },
  created () {
    this.getCateList()
  },
  methods: {
    async getCateList () {
      const { data: res } = await this.$http.get('categories', { params: { type: 3 } })
      if (res.meta.status !== 200) {
        return this.$message.error('获取分类失败！')
      }
      this.cateList = res.data
    },
    handleChange () {
      console.log(this.addForm.goods_cat)
      if (this.addForm.goods_cat.length === 3) {

      } else {
        this.addForm.goods_cat = []
      }
    },
    beforeTabLeave (activeName, oldActiveName) {
      if (oldActiveName === '0' && this.catId === null) {
        this.$message.error('请选择三级分类')
        return false
      }
    },
    async tabClick () {
      if(this.activeName ==='1'){
        const {data:res} = await this.$http.get(`categories/${this.catId}/attributes`,{params:{sel:'many'}})
        if(res.meta.status!==200){
          return this.$message.error('获取动态属性失败')
        }
        res.data.forEach(item=>{
          item.attr_vals = item.attr_vals.split('  ')
        })
        this.manyData = res.data
        console.log(res)
      }
    }
  },
  computed: {
    catId: function () {
      if (this.addForm.goods_cat.length === 3) {
        return this.addForm.goods_cat[2]
      }
      return null
    }
  },
}
</script>

<style scoped>
.el-step {
  margin: 15px;
}
</style>