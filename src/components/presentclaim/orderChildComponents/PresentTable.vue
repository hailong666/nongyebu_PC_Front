<template>
  <div>
    <el-table :data="orderList" border stripe>
      <el-table-column type="index"></el-table-column>
      <el-table-column label="申领单编号" prop="order_id"></el-table-column>
      <el-table-column label="申领单价格" prop="total" width="80px"></el-table-column>
      <!-- <el-table-column label="是否审批" prop="order_pay" width="80px">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.pay_status === '1'" type="success">已付款</el-tag>
          <el-tag v-else type="danger">未付款</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="申领单状态" prop="is_send" width="80px"></el-table-column> -->
      <el-table-column label="创建时间" prop="create_time">
        <template slot-scope="scope">
          {{scope.row.create_time}}
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button type="primary">下载</el-button>
          <el-button>详情</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>

  import OrderEdit from "./PresentEdit";
  import OrderProgress from "./PresentProgress";
  import axios from 'axios'
  export default {
    name: "OrderTable",
    components: {
      OrderEdit,
      OrderProgress
    },
    props: {
      orderList: {
        type: Array,
        default() {
          return []
        }
      }
    },
    created() {

    this.getOrderList();
    },
    methods:{
      updateOrderList() {
        this.$emit('order-list');
      },
      getOrderList() {
        axios({
          url:"http://49.233.249.9:8000/v1/weixinpay/orderFind"
        }).then(res=>{
          console.log(res.data.data)
          this.orderList = res.data.data
          return this.alertMessage('获取订单列表成功', 'success');
        }).catch(err=>{
          //  return this.alertMessage('获取订单列表失败', 'error');
        })      

      }
    }
  }
</script>

<style scoped>

</style>
