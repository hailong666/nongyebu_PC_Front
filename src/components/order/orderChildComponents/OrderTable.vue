<template>
  <div>
    <el-table :data="orderList" border stripe>
      <el-table-column type="index"></el-table-column>
      <el-table-column label="订单编号" prop="order_id"></el-table-column>
      <el-table-column label="礼单价格" prop="total" width="80px"></el-table-column>
      <el-table-column label="是否审批" prop="is_send" width="80px">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.isok === 1" type="success">已审批</el-tag>
          <el-tag v-else type="danger">未审批</el-tag>
        </template>
      </el-table-column>
      <!-- <el-table-column label="是否审批" prop="isok" width="80px"></el-table-column> -->
      <el-table-column label="下单时间" prop="create_time">
        <template slot-scope="scope">
          {{scope.row.create_time}}
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <!-- <template slot-scope="scope">
          <order-edit :order-id="scope.row.order_id" @order-list="updateOrderList"/>
          <order-progress/> -->
        <!-- </template> -->
        <!-- <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="changeGoods()">确 定</el-button> -->
        <template slot-scope="scope">
          <el-button type="primary" @click="ifokfunction(scope.row.id)">审批</el-button>
          <!-- <el-button>取 消</el-button> -->
          <el-button type="danger" icon="el-icon-delete" size="mini" @click="removeGoods(scope.row.goods_id)">删除</el-button>
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
          url:"http://49.233.249.9:8000/v1/weixinpay/orderFind"
        }).then(res=>{
          console.log(res.data.data)
          this.orderList = res.data.data
          return this.alertMessage('获取订单列表成功', 'success');
        }).catch(err=>{
          //  return this.alertMessage('获取订单列表失败', 'error');
        })      

      },      
      ifokfunction(id){
        console.log(id)

        axios({
          url:"http://49.233.249.9:8000/v1/weixinpay/okOrder/" + id
        }).then(res=>{

          return this.alertMessage('审批成功', 'success');

        }).catch(err=>{
          
        })        
      },


      removeGoods(id) {
        console.log(id)
        this.$confirm('此操作将永久删除, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
         
        }).catch(() => {
          this.alertMessage('已取消删除', 'info');
        });
      },



      updateOrderList() {
        this.$emit('order-list');
      }
    }
  }
</script>

<style scoped>

</style>
