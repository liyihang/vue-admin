<template>
  <div>
    <!--breadcrumb -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>订单管理</el-breadcrumb-item>
      <el-breadcrumb-item>订单列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- el-card show order list -->
    <el-card>
      <!-- search button and input -->
      <el-row>
        <el-col :span="8">
          <el-input placeholder="请输入内容" v-model="keyWords" class="input-with-select">
            <el-button slot="append" icon="el-icon-search"></el-button>
          </el-input>
        </el-col>
      </el-row>
      <!-- order list table -->
      <el-table :data="orderList" border stripe>
        <el-table-column type="index"></el-table-column>
        <el-table-column label="订单编号" width="200px" prop="order_number"></el-table-column>
        <el-table-column label="订单价格" prop="order_price"></el-table-column>
        <el-table-column label="是否付款" prop="pay_status">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.pay_status===1">已付款</el-tag>
            <el-tag v-else type="danger">未付款</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="是否发货" prop="is_send"></el-table-column>
        <el-table-column label="下单时间" prop="create_time">
          <template slot-scope="scope">{{scope.row.create_time|dateFormat}}</template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button type="primary" icon="el-icon-edit" size="mini" title="修改订单信息"></el-button>
            <el-button
              type="success"
              icon="el-icon-location"
              size="mini"
              title="物流信息"
              @click="showLogisticsInfo"
            ></el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- pagination -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[5, 10, 15, 20]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </el-card>
    <!-- logistics info -->
    <el-dialog title="物流信息" :visible.sync="dialogVisible" width="30%">
      <el-steps direction="vertical" :active="1">
        <el-step
          v-for="(item, index) in logisticsInfo"
          :key="index"
          :title="item.context"
        >{{item.time}}</el-step>
      </el-steps>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
export default {
  data () {
    return {
      keyWords: '',
      //   query info
      queryInfo: {
        query: '',
        pagenum: 1,
        pagesize: 5
      },
      // order list
      orderList: [],
      // total num
      total: 0,
      //   dialog visiable
      dialogVisible: false,
      //   logistics info
      logisticsInfo: []
    }
  },
  created () {
    this.getOrderList()
  },
  methods: {
    async getOrderList () {
      const { data: res } = await this.$http.get('orders', { params: this.queryInfo })
      if (res.meta.status !== 200) {
        return this.$message.error('获取订单数据失败')
      }
      this.orderList = res.data.goods
      this.total = res.data.total
    },
    // page size
    handleSizeChange (newSize) {
      this.queryInfo.pagesize = newSize
      this.getOrderList()
    },
    // page change
    handleCurrentChange (newPage) {
      this.queryInfo.pagenum = newPage
      this.getOrderList()
    },
    async showLogisticsInfo () {
      const { data: res } = await this.$http.get('kuaidi/TT6600245820570')
      if (res.meta.status !== 200) {
        return this.$message.error('获取物流信息失败')
      }
      this.logisticsInfo = res.data
      this.dialogVisible = true
      console.log(res)
    }
  }
}
</script>
<style scoped>
</style>
