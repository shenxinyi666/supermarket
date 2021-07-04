<template>
  <div id="detail">
    <detail-nav-bar
      class="detail-nav"
      @titleClick="titleClick"
      ref="nav"></detail-nav-bar>
    <scroll class="content"
            ref="scroll"
            :probe-type="3"
            @scroll="contentScroll">
      <detail-swiper :top-images="topImages"></detail-swiper>
      <detail-base-info :goods="goods"></detail-base-info>
      <detail-shop-info :shop="shop"></detail-shop-info>
      <detail-goods-info :detail-info="detailInfo"
                         @imageLoad="imageLoad"></detail-goods-info>
      <detail-param-info ref="params"
                         :param-info="paramInfo"></detail-param-info>
      <detail-comment-info ref="comment"
                           :comment-info="commentInfo"></detail-comment-info>
      <goods-list ref="recommend"
                  :goods="recommends"></goods-list>
    </scroll>
    <detail-bottom-bar @addCart="addToCart"></detail-bottom-bar>
    <!--.native是在我们需要监听一个组件的原生事件时使用-->
    <back-top @click.native="backClick" v-show="isShowBackTop"></back-top>
    <!--<toast :message="message" :show="isShow"></toast>-->
  </div>
</template>

<script>
import DetailNavBar from "./childComps/DetailNavBar";
import DetailSwiper from "./childComps/DetailSwiper";
import DetailBaseInfo from "./childComps/DetailBaseInfo";
import DetailShopInfo from "./childComps/DetailShopInfo";
import DetailGoodsInfo from "./childComps/DetailGoodsInfo";
import DetailParamInfo from "./childComps/DetailParamInfo";
import DetailCommentInfo from "./childComps/DetailCommentInfo";
import DetailBottomBar from "./childComps/DetailBottomBar";

import Scroll from "components/common/scroll/Scroll";
import GoodsList from "components/content/goods/GoodsList";
import BackTop from "components/content/backTop/BackTop";

import {getDetail, Goods, Shop, GoodsParam, getRecommend} from "network/detail";
import {debounce} from "common/utils";
import {itemListenerMixin, backTopMixin} from "common/mixin";
import {mapActions} from 'vuex'

import Toast from "components/common/toast/Toast";

export default {
  name: "Detail",
  components: {
    DetailNavBar,
    DetailSwiper,
    DetailBaseInfo,
    DetailShopInfo,
    DetailGoodsInfo,
    DetailParamInfo,
    DetailCommentInfo,
    DetailBottomBar,
    Scroll,
    GoodsList,
    //在mixin注册
    //BackTop,
    //Toast
  },
  //混入封装的
  mixins: [itemListenerMixin, backTopMixin],
  data() {
    return {
      iid: null,
      topImages: [],
      goods: {},
      shop: {},
      detailInfo: {},
      paramInfo: {},
      commentInfo: {},
      recommends: [],
      //方法一：
      detailImgListener: null,
      //方法二：
      //在mixin.js定义
      //itemImgListener: null
      //DetailNavBar中title对应的Y值
      themeTopYs: [],
      getThemeTopYs: null,
      //在mixin.js定义
      //isShowBackTop: false
      //message:'',
      //isShow:false
    }
  },
  created() {
    //1.保存传入的iid
    this.iid = this.$route.params.iid

    //2.根据iid请求详情数据
    getDetail(this.iid).then(res => {
      //console.log(res);
      //1.获取数据
      const data = res.result
      //2.获取顶部的图片轮播数据
      this.topImages = data.itemInfo.topImages
      //3.获取商品信息
      this.goods = new Goods(data.itemInfo, data.columns, data.shopInfo.services)
      //4.创建店铺信息的对象
      this.shop = new Shop(data.shopInfo)
      //5.保存商品的详细数据
      this.detailInfo = data.detailInfo
      //6.获取参数的信息
      this.paramInfo = new GoodsParam(data.itemParams.info, data.itemParams.rule)
      //7.获取评论信息
      if (data.rate.cRate !== 0) {
        this.commentInfo = data.rate.list[0]
      }
    })

    //3.请求推荐数据
    getRecommend().then(res => {
      //console.log(res);
      this.recommends = res.data.list
    })

    //4.给getThemeTopYs赋值(对给this.getThemeTopYs赋值的操作进行防抖)
    this.getThemeTopYs = debounce(() => {
      //获取DetailNavBar中title对应的Y值
      this.themeTopYs = []
      this.themeTopYs.push(0)
      this.themeTopYs.push(this.$refs.params.$el.offsetTop)
      this.themeTopYs.push(this.$refs.comment.$el.offsetTop)
      this.themeTopYs.push(this.$refs.recommend.$el.offsetTop)
      //方法二中获取页面最大值
      this.themeTopYs.push(Number.MAX_VALUE)
      //console.log(this.themeTopYs);
    }, 50)

    //1.第一次获取值不对：this.$refs.params.$el压根没有渲染
    /*this.themeTopYs = []
    this.themeTopYs.push(0)
    this.themeTopYs.push(this.$refs.params.$el.offsetTop)
    this.themeTopYs.push(this.$refs.comment.$el.offsetTop)
    this.themeTopYs.push(this.$refs.recommend.$el.offsetTop)
    console.log(this.themeTopYs);*/

    //获取DetailNavBar中title对应的Y值
    /*this.$nextTick(() => {
      //2.第二次获取值不对：图片可能没有加载完，导致offsetTop值不对
      this.themeTopYs = []
      this.themeTopYs.push(0)
      this.themeTopYs.push(this.$refs.params.$el.offsetTop)
      this.themeTopYs.push(this.$refs.comment.$el.offsetTop)
      this.themeTopYs.push(this.$refs.recommend.$el.offsetTop)
      console.log(this.themeTopYs);
    })*/
  },
  mounted() {
    //方法一：
    //1.监听detail中图片加载完成
    /*const refresh = debounce(this.$refs.scroll.refresh, 50)
    this.$bus.$on('detailItemImageLoad', () => {
      refresh()
      //console.log('---');
      //this.$refs.scroll.refresh()
    })*/

    //方法二：
    //1.监听detail中图片加载完成
    /*const refresh = debounce(this.$refs.scroll.refresh, 50)
    //2.对监听的事件进行保存
    this.itemImgListener=()=>{
      refresh()
    }
    this.$bus.$on('itemImgLoad',this.itemImgListener)*/

    //方法三：
    //用mixins混入封装方法二中与Home相同的代码到common/mixin.js
  },
  /*updated() {
    //获取DetailNavBar中title对应的Y值
    //3.第三次获取值不对：图片可能没有加载完，导致offsetTop值不对
    this.themeTopYs = []
    this.themeTopYs.push(0)
    this.themeTopYs.push(this.$refs.params.$el.offsetTop)
    this.themeTopYs.push(this.$refs.comment.$el.offsetTop)
    this.themeTopYs.push(this.$refs.recommend.$el.offsetTop)
    console.log(this.themeTopYs);
  },*/
  methods: {
    //方法一：
    //监听详细页商品展示的图片
    /*imageLoad() {
      this.$refs.scroll.refresh()
    }*/

    //方法二：
    imageLoad() {
      //这里的refresh已经在mixin.js的data中定义，因此可以共用
      this.refresh()
      this.getThemeTopYs()
    },
    titleClick(index) {
      //console.log(index);
      //注意：滚动的y值都是’-‘
      this.$refs.scroll.scrollTo(0, -this.themeTopYs[index], 50)
    },
    contentScroll(position) {
      //console.log(position);
      //方法一：
      /*//1.获取Y值
      const positionY = -position.y
      //2.positionY和主题中值进行对比
      //[0,a,b,c]
      //positionY在[0,a)，index=0
      //positionY在[a,b)，index=1
      //positionY在[b,c)，index=2
      //positionY[c,+∞)，index=3
      let length = this.themeTopYs.length
      for (let i = 0; i < length; i++) {
        /!*this.currentIndex !== i:防止赋值的过程过于频繁*!/
        if (this.currentIndex !== i && ((i < length - 1 && positionY >= this.themeTopYs[i] && positionY < this.themeTopYs[i + 1]) ||
          (i === length - 1 && positionY >= this.themeTopYs[i]))) {
          //console.log(i);
          this.currentIndex = i;
          console.log(this.currentIndex);
          this.$refs.nav.currentIndex=this.currentIndex
        }
      }*/

      //方法二：
      //1.获取Y值
      const positionY = -position.y
      //2.positionY和主题中值进行对比
      //[0,a,b,c,Number.MAX_VALUE]
      //console.log(Number.MAX_VALUE);
      //positionY在[0,a)，index=0
      //positionY在[a,b)，index=1
      //positionY在[b,c)，index=2
      //positionY[c,Number.MAX_VALUE)，index=3
      let length = this.themeTopYs.length
      /*注意：这种方法下面i < length-1,防止数组[i+1]越界*/
      for (let i = 0; i < length - 1; i++) {
        /*this.currentIndex !== i:防止赋值的过程过于频繁*/
        if (this.currentIndex !== i && (positionY >= this.themeTopYs[i] && positionY < this.themeTopYs[i + 1])) {
          //console.log(i);
          this.currentIndex = i;
          //console.log(this.currentIndex);
          this.$refs.nav.currentIndex = this.currentIndex
        }
      }

      //3.是否显示回到顶部
      //重新写一个方法是为了在mixin封装，因为mixin中不能抽取相同方法的部分代码
      this.listenShowBackTop(position)
      //this.isShowBackTop = (-position.y) > 1000
    },
    ...mapActions(['addCart']),
    addToCart() {
      //console.log('addCart');
      //1.获取购物车需要展示的信息
      const product = {}
      product.image = this.topImages[0]
      product.title = this.goods.title
      product.des = this.goods.desc
      product.price = this.goods.realPrice
      product.iid = this.iid
      //2.将商品添加到购物车
      //this.$store.cartList.push(product)
      //mutations
      //this.$store.commit('addCart',product)
      //actions
      /*this.$store.dispatch('addCart',product).then(res=>{
        console.log(res);
      })*/
      //通过mapActions映射
      this.addCart(product).then(res=>{
        //console.log(res);
        /*this.isShow=true;
        this.message=res;
        setTimeout(()=>{
          this.isShow=false;
          this.message='';
        },2000)*/
        this.$toast.show(res,2000)
      })
    }
    //mixin混入封装
    /*backClick() {
      //console.log('backClick');
      //this.$refs.scroll.scroll.scrollTo(0,0,500)
      this.$refs.scroll.scrollTo(0, 0)
    }*/
  },
  //将此方法在mixin封装
  /*listenShowBackTop(position){
    this.isShowBackTop = (-position.y) > 1000
  },*/
  //错误代码：这里不能在deactivated取消，
  // 因为keep-alive用来缓存组件,避免多次加载相应的组件,减少性能消耗
  //Detail组件中没有使用keep-alive,所以的deactivated不能调用
  //注意：activated()和deactivated()只有在<keep-alive></keep-alive>包裹的时候才有效；
  /*deactivated() {
    //2.取消全局事件的监听(GoodsListItem中方法二)
    this.$bus.$off('itemImgLoad',this.detailImgListener)
  },*/
  //因此把取消全局事件的监听放在destroyed()
  destroyed() {
    //2.取消全局事件的监听(GoodsListItem中方法二)
    this.$bus.$off('itemImgLoad', this.detailImgListener)
  }
}
</script>

<style scoped>
#detail {
  position: relative;
  z-index: 9;
  background-color: #fff;
  height: 100vh;
}

.content {
  height: calc(100% - 44px - 60px);
}

.detail-nav {
  position: relative;
  z-index: 9;
  background-color: #fff;
}
</style>
