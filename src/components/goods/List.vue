<template>
  <div>
    <!-- 顶部面包屑导航 -->
    <breadcrumb-nav>
      <template v-slot:firstMenu>礼品管理</template>
      <template v-slot:secondMenu>礼品列表</template>
    </breadcrumb-nav>

    <!-- 卡片视图 -->
    <el-card>
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input placeholder="请输入内容" v-model="queryInfo.query" clearable @clear="getGoodsList">
            <el-button slot="append" icon="el-icon-search" @click="getGoodsList"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="goAddPage">添加礼品</el-button>
        </el-col>
      </el-row>

      <!-- table表格区域 -->
      <el-table :data="goodsList" border stripe>
        <el-table-column type="index"></el-table-column>
        <el-table-column label="礼品名称" prop="goods_name"></el-table-column>
        <el-table-column label="礼品价格（元）" prop="goods_price" width="90px"></el-table-column>
        <el-table-column label="入库时间" prop="add_time" width="170px">
          <template slot-scope="scope">
            {{scope.row.add_time | dateFormat}}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="200px">
          <template slot-scope="scope">
            <el-button type="primary" icon="el-icon-edit" size="mini" @click="dialogFormVisible = true; id = scope.row.goods_id" >编辑</el-button>
            <el-button type="danger" icon="el-icon-delete" size="mini" @click="removeGoods(scope.row.goods_id)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <el-dialog title="修改礼品" :visible.sync="dialogFormVisible">
      <el-form :v-model="form">
        <el-form-item label="礼品名称" >
          <el-input v-model="form.name" autocomplete="off"  placeholder="输入新名称"></el-input>
        </el-form-item>
        <el-form-item label="礼品价格" >
          <el-input v-model="form.price" autocomplete="off"  placeholder="输入新价格"></el-input>
        </el-form-item>
        <el-form-item label="礼品库存" >
          <el-input v-model="form.number" autocomplete="off"  placeholder="输入新库存"></el-input>
        </el-form-item>
        <!-- <el-form-item label="活动区域" >
          <el-select v-model="form.region" placeholder="请选择活动区域">
            <el-option label="区域一" value="shanghai"></el-option>
            <el-option label="区域二" value="beijing"></el-option>
          </el-select>
        </el-form-item> -->
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="changeGoods()">确 定</el-button>
      </div>
    </el-dialog>
    <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="queryInfo.pagenum"
            :page-sizes="[10, 15, 20, 30]"
            :page-size="queryInfo.pagesize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total">
    </el-pagination>
  </div>
</template>

<script>
  import BreadcrumbNav from "../common/BreadcrumbNav";
  import axios from 'axios'
  import {
    getGoodsListRequest,
    removeGoodsByIdRequest,
    changeGoodsByIdRequest
  } from "network/goods";

  export default {
    name: "List",
    components: {
      BreadcrumbNav
    },
    data() {
      return {
        queryInfo: {
          query: "",
          pagenum: 1,
          pagesize: 10
        },
        form:{},
        dialogFormVisible: false,
        goodsList: [],
        total: 0,
        id : -1
      }
    },
    created() {
      this.getGoodsList();
    },
    methods: {
      getGoodsList() {
        getGoodsListRequest(this.queryInfo).then(res => {
          let result = res.data;
          if (result.meta.status !== 200) {
            return this.alertMessage('获取礼品数据失败', 'error');
          }
          this.goodsList = result.data.goods;
          this.total = result.data.total;
        });
      },

      // 每页显示的数据条数发送变化
      handleSizeChange(newSize) {
        this.queryInfo.pagesize = newSize;
        this.getGoodsList();
      },

      // 当前页码发生变化
      handleCurrentChange(newPage) {
        this.queryInfo.pagenum = newPage;
        this.getGoodsList();
      },

      // 删除礼品
      removeGoods(id) {
        console.log(id)
        this.$confirm('此操作将永久删除, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          removeGoodsByIdRequest(id).then(res => {
            let result = res.data;

            if (result.meta.status !== 200) {
              return this.alertMessage('删除失败', 'error');
            }

            this.alertMessage('删除成功', 'success');

            // this.$emit('param-list');
            this.getGoodsList();
          });
        }).catch(() => {
          this.alertMessage('已取消删除', 'info');
        });
      },
      // 修改礼品
      changeGoods() {
        this.dialogFormVisible = false
        console.log(this.id)
        console.log("http://49.233.249.9:8000/v1/weixinpay/updategood/" + this.id)
          axios.get("http://49.233.249.9:8000/v1/weixinpay/updategood/" + this.id,{
          params:{
            name : this.form.name,
            number: this.form.number,
            price : this.form.price
          }
        }).then(res=>{
          console.log(res.data.data)
          this.orderList = res.data.data
          return this.alertMessage('更新礼品成功', 'success');
        }).catch(err=>{
          return this.alertMessage('更新礼品失败', 'error');
        })  
        // this.$confirm('此操作将修改礼品, 是否继续?', '提示', {
        //   confirmButtonText: '确定',
        //   cancelButtonText: '取消',
        //   type: 'warning'
        // }).then(() => {

        //   // changeGoodsByIdRequest(this.id).then(res => {
        //   //   let result = res.data;

        //   //   if (result.meta.status !== 200) {
        //   //     return this.alertMessage('删除失败', 'error');
        //   //   }

        //   //   this.alertMessage('删除成功', 'success');

        //   //   // this.$emit('param-list');
        //   //   this.getGoodsList();
        //   // });
        // }).catch(() => {
        //   this.alertMessage('更新礼品失败！','info');
        // });
      },
      // 跳转到添加礼品的界面
      goAddPage() {
        this.$router.push('/add');
      }
    }
  }
</script>

<style scoped>

</style>
