<template>
  <div>
    <el-table :data="orderList" border stripe>
      <el-table-column type="index"></el-table-column>
      <el-table-column label="礼单编号" prop="order_id"></el-table-column>
      <el-table-column label="礼单价格" prop="total" width="80px"></el-table-column>
      <el-table-column label="礼单商品" prop="item" width="80px">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.pay_status === '1'" type="success">已付款</el-tag>
          <el-tag v-else type="danger">未付款</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="是否审批" prop="is_send" width="80px"></el-table-column>
      <el-table-column label="下单时间" prop="create_time">
        <template slot-scope="scope">
          {{scope.row.create_time | dateFormat}}
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <!-- 修改按钮组件 -->
          <order-edit :order-id="scope.row.order_id" @order-list="updateOrderList"/>

          <!-- 查询物流进度 -->
          <order-progress/>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>

  import OrderEdit from "./OrderEdit";
  import OrderProgress from "./OrderProgress";
  import {getOrderListRequest} from "network/order"
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
      getOrderList() {
        axios({
          url:"https://libin.easygoing.com.cn/v1/weixinpay/orderFind"
        }).then(res=>{
          console.log(res.data.data)
          this.onOrderList = res.data.data
          return this.alertMessage('获取订单列表成功', 'success');
        }).catch(err=>{
          //  return this.alertMessage('获取订单列表失败', 'error');
        })      
        // getOrderListRequest(this.queryInfo).then(res => {
        //   let result = res.data;
        //   if (result.meta.status !== 200) {
        //     return this.alertMessage('获取订单列表失败', 'error');
        //   }
        //   this.orderList = result.data.goods;
        //   this.total = result.data.total;
        // })
      },      
      updateOrderList() {
        this.$emit('order-list');
      }
    }
  }
</script>

<style scoped>

</style>
