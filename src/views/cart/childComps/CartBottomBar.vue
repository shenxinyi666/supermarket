<template xmlns="http://www.w3.org/1999/html">
  <div class="bottom-bar">
    <div class="check-content">
      <check-button :is-checked="isSelectAll"
                    class="check-button"
                    @click.native="checkClick"></check-button>&nbsp;
      <span><strong>全选</strong></span>
    </div>
    <div class="price">
      <strong>合计：{{ totalPrice }}</strong>
    </div>
    <div class="calculate" @click="calcClick">
      <strong>去计算：({{ checkLength }})</strong>
    </div>
  </div>
</template>

<script>
import CheckButton from 'components/content/checkButton/CheckButton'
import {mapGetters} from 'vuex'

export default {
  name: "CartBottomBar",
  components: {
    CheckButton
  },
  computed: {
    ...mapGetters(['cartList']),
    //计算总价格
    totalPrice() {
      return '￥' + this.cartList.filter(item => {
        return item.checked
      }).reduce((preValue, item) => {
        return preValue + item.price * item.count
      }, 0).toFixed(2)
    },
    //去计算个数
    checkLength() {
      return this.cartList.filter(item => item.checked).length
    },
    //判断是否有一个不选中，全选就是不选中
    isSelectAll() {
      //方法一：
      //if(this.cartList.length===0) return false
      //return !(this.cartList.filter(item=>!item.checked).length)

      //方法二：
      //if(this.cartList.length===0) return false
      //return !this.cartList.find(item=>!item.checked)

      //方法三：
      if (this.cartList.length === 0) return false
      for (let item of this.cartList) {
        if (!item.checked) {
          return false
        }
      }
      return true
    }
  },
  methods: {
    checkClick() {
      //console.log('---');
      if (this.isSelectAll) {
        //如果原来都是选中，点击一次->全部不选中
        this.cartList.forEach(item => item.checked = false)
      } else {
        //如果原来是都是不选中（某些不选中）->全部选中
        this.cartList.forEach(item => item.checked = true)
      }
    },
    calcClick(){
      if(!this.isSelectAll){
        this.$toast.show('您的购物车为空',2000)
      }
    }
  }
}
</script>

<style scoped>
.bottom-bar {
  position: relative;
  display: flex;
  height: 40px;
  line-height: 36px;
  background-color: orange;
  font-size: 15px;
}

.check-content {
  display: flex;
  align-items: center;
  margin-left: 5px;
  margin-bottom: 5px;
  width: 60px;
}

.check-button {
  width: 20px;
  height: 20px;
  line-height: 10px;
}

.price {
  margin-left: 20px;
  flex: 1;
}

.calculate {
  width: 100px;
  background-color: red;
  color: #fff;
  text-align: center;
}
</style>
