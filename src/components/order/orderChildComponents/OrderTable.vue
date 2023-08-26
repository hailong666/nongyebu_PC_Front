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

          <el-button type="primary" @click="ifokfunction(scope.row.id)">审 批</el-button>
          <!-- <el-button>取 消</el-button> -->
          <el-button @click="dialogFormVisible = true; id = scope.row.goods_id; getItems(scope.row)" >详 情</el-button>
        </template>

      </el-table-column>
    </el-table>
    <el-dialog title="礼 品 详 情" :visible.sync="dialogFormVisible" center>
      <!-- <el-form :v-model="form">
        <el-form-item label="礼品名称" >
          <el-input v-model="form.name" autocomplete="off"  placeholder="输入新名称"></el-input>
        </el-form-item>
        <el-form-item label="礼品价格" >
          <el-input v-model="form.price" autocomplete="off"  placeholder="输入新价格"></el-input>
        </el-form-item>
        <el-form-item label="礼品库存" >
          <el-input v-model="form.number" autocomplete="off"  placeholder="输入新库存"></el-input>
        </el-form-item> -->

      <el-table :data="gridData" style="width: 100%" :row-class-name="tableRowClassName" border>
        <el-table-column width="200" property="goodsName" label="礼品名称"></el-table-column>
        <el-table-column width="200" property="goodsPrice" label="礼品单价"></el-table-column>
        <el-table-column width="200" property="quantity" label="礼品数量"></el-table-column>
        <el-table-column width="203" property="goodsNumber" label="礼品库存"></el-table-column>
        </el-table>
        <!-- <el-form-item label="活动区域" >
          <el-select v-model="form.region" placeholder="请选择活动区域">
            <el-option label="区域一" value="shanghai"></el-option>
            <el-option label="区域二" value="beijing"></el-option>
          </el-select>
        </el-form-item> -->
      <!-- </el-form> -->
    </el-dialog>
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
    data() {
      return {
        queryInfo: {
          query: "",
          pagenum: 1,
          pagesize: 10
        },
        form:{},
        gridData:[],
        dialogFormVisible: false,
        goodsList: [],
        total: 0,
        id : -1
      }
    },
    created() {

      this.getOrderList();
    },
    methods:{
      getItems(row) {
        this.gridData = []
        let items = JSON.parse(row.item)
        

        for( let item in items){
          let gridDatajson = {}
          console.log(items[item])
          gridDatajson['goodsName'] = items[item].product.goods_name
          gridDatajson['goodsPrice'] = items[item].product.goods_price
          gridDatajson['quantity'] = items[item].quantity
          gridDatajson['goodsNumber'] = items[item].product.goods_number
          
          this.gridData.push(gridDatajson)
          console.log(this.gridData)
        }
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
      },
      tableRowClassName({row, rowIndex}) {
        if (rowIndex === 1) {
          return 'warning-row';
        } else if (rowIndex === 3) {
          return 'success-row';
        }
        return '';
      }
    }
  }
</script>

<style >
  /* 设置表格状态 */
  .el-table .warning-row {
    background: oldlace;
  }

  .el-table .success-row {
    background: #7c9414;
  }
</style>
