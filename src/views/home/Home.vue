<template>
  <div id="home" class="wrapper">
    <nav-bar class="home-nav">
      <div slot="center">购物街</div>
    </nav-bar>
    <!--多复制一份TabControl组件对象，利用v-show来实现滚动到相应位置时的停留效果-->
    <tab-control :titles="['流行','新款','精选']"
                 @tabClick="tabClick"
                 ref="tabControl1"
                 class="tab-control"
                 v-show="isTabFixed"></tab-control>
    <scroll class="content"
            ref="scroll"
            :probe-type="3"
            @scroll="contentScroll"
            :pull-up-load="true"
            @pullingUp="loadMore">
      <home-swiper :banners="banners"
                   @swiperImageLoad="swiperImageLoad"></home-swiper>
      <recommend-view :recommends="recommends"></recommend-view>
      <feature-view></feature-view>
      <tab-control :titles="['流行','新款','精选']"
                   @tabClick="tabClick"
                   ref="tabControl2"></tab-control>
      <!--给tab-control动态绑定class行不通-->
      <!--:class="{fixed:isTabFixed}"-->
      <goods-list :goods="showGoods"></goods-list>
    </scroll>
    <!--.native是在我们需要监听一个组件的原生事件时使用-->
    <back-top @click.native="backClick" v-show="isShowBackTop"></back-top>
  </div>
</template>

<script>
import NavBar from "components/common/navbar/NavBar";
import TabControl from "components/content/tabControl/TabControl";
import GoodsList from "components/content/goods/GoodsList";

import HomeSwiper from "./childComps/HomeSwiper";
import RecommendView from "./childComps/RecommendView";
import FeatureView from "./childComps/FeatureView";
import Scroll from "components/common/scroll/Scroll";
import BackTop from "components/content/backTop/BackTop";

import {getHomeMultidata, getHomeGoods} from "network/home";
import {debounce} from "common/utils";
import {itemListenerMixin, backTopMixin} from "common/mixin";

export default {
  name: "Home",
  components: {
    NavBar,
    TabControl,
    GoodsList,
    HomeSwiper,
    RecommendView,
    FeatureView,
    Scroll
    //在mixin注册
    //BackTop
  },
  //混入封装的
  mixins: [itemListenerMixin,backTopMixin],
  //存储请求过来的数据到result变量
  data() {
    return {
      //result: null
      banners: [],
      recommends: [],
      goods: {
        'pop': {page: 0, list: []},
        'new': {page: 0, list: []},
        'sell': {page: 0, list: []}
      },
      currentType: 'pop',
      //在mixin.js定义
      //isShowBackTop: false,
      tabOffsetTop: 0,
      isTabFixed: false,
      saveY: 0,
      //方法一：
      homeImgListener: null,
      //方法二：
      //在mixin.js定义
      //itemImgListener: null
    }
  },
  computed: {
    showGoods() {
      return this.goods[this.currentType].list
    }
  },
  created() {
    //1.请求多个数据(异步操作)
    this.getHomeMultidata()

    //2.请求商品数据
    this.getHomeGoods('pop')
    this.getHomeGoods('new')
    this.getHomeGoods('sell')
  },
  mounted() {
    //方法一：
    //1.监听home中图片加载完成
    /*const refresh = debounce(this.$refs.scroll.refresh, 50)
    this.$bus.$on('homeItemImageLoad', () => {
      refresh()
      //console.log('---');
      //this.$refs.scroll.refresh()
    })*/

    //方法二：
    //1.监听home中图片加载完成
    /*const refresh = debounce(this.$refs.scroll.refresh, 50)
    //2.对监听的事件进行保存
    this.itemImgListener=()=>{
      refresh()
    }
    this.$bus.$on('itemImgLoad',this.itemImgListener )*/

    //方法三：
    //用mixins混入封装方法二中与Detail相同的代码到common/mixin.js
  },
  destroyed() {
    //console.log('home destroyed');
  },
  activated() {
    //console.log('activated');
    this.$refs.scroll.scrollTo(0, this.saveY, 0)
    //解决多次切换出现bug问题
    //this.$refs.scroll.refresh()
  },
  deactivated() {
    //console.log('deactivated');
    //1.保存Y值
    this.saveY = this.$refs.scroll.getScrollY()
    //console.log(this.saveY);
    //2.取消全局事件的监听(GoodsListItem中方法二)
    this.$bus.$off('itemImgLoad', this.homeImgListener)
  },
  methods: {
    /*事件监听相关的方法*/
    tabClick(index) {
      //console.log(index);
      switch (index) {
        case 0:
          this.currentType = 'pop'
          break
        case 1:
          this.currentType = 'new'
          break
        case 2:
          this.currentType = 'sell'
          break
      }
      //必须两个tabControl都赋值，这样不管点那个都可以保持一致
      this.$refs.tabControl1.currentIndex = index
      this.$refs.tabControl2.currentIndex = index
    },
    //mixin混入封装
    /*backClick() {
      //console.log('backClick');
      //this.$refs.scroll.scroll.scrollTo(0,0,500)
      this.$refs.scroll.scrollTo(0, 0)
    },*/
    contentScroll(position) {
      //console.log(position);
      //1.判断BackTop是否显示
      //重新写一个方法是为了在mixin封装，因为mixin中不能抽取相同方法的部分代码
      this.listenShowBackTop(position)
      //this.isShowBackTop = (-position.y) > 1000
      //2.决定tabControl是否吸顶(position:fixed)
      this.isTabFixed = (-position.y) > this.tabOffsetTop
    },
    //将此方法在mixin封装
    /*listenShowBackTop(position){
      this.isShowBackTop = (-position.y) > 1000
    },*/
    loadMore() {
      //console.log('上拉加载更多');
      this.getHomeGoods(this.currentType)
      //修复图片加载不能下拉的bug
      //this.$refs.scroll.scroll.refresh()
    },
    swiperImageLoad() {
      //2.获取tabControl的offsetTop
      //所有的组件都有一个属性$el:用于获取组件中的元素
      this.tabOffsetTop = this.$refs.tabControl2.$el.offsetTop
      //console.log(this.$refs.tabControl.$el.offsetTop);
    },

    /*网络请求相关的方法*/
    getHomeMultidata() {
      getHomeMultidata().then(res => {
        //console.log(res);
        //this.result = res
        this.banners = res.data.banner.list
        this.recommends = res.data.recommend.list
      })
    },
    getHomeGoods(type) {
      const page = this.goods[type].page + 1
      getHomeGoods(type, page).then(res => {
        //console.log(res);
        this.goods[type].list.push(...res.data.list)
        this.goods[type].page += 1
        //完成上拉加载更多
        this.$refs.scroll.finishPullUp()
      })
    }
  }
}
</script>

<style scoped>
#home {
  /*padding-top: 44px;*/
  /*vh:视口高度*/
  height: 100vh;
  overflow: hidden;
  position: relative;
}

.home-nav {
  background-color: var(--color-tint);
  color: #fff;
  /*在使用浏览器原生滚动时，为了让导航不跟随一起滚动*/
  /*position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 9;*/
}

/*BScroll这样设置不起效果*/
/*.tab-control {
  position: sticky;
  top: 44px;
  z-index: 9;
}*/

.content {
  /*height: 300px;*/
  overflow: hidden;
  position: absolute;
  top: 44px;
  bottom: 49px;
  left: 0;
  right: 0;
}

.tab-control {
  position: relative;
  z-index: 9;
}

/*.fixed {
  position: fixed;
  left: 0;
  right: 0;
  top: 44px;
}*/

/*.content{
 height: calc(100% - 93px);
  margin-top: 44px;
 !* height: 300px;*!
 !*overflow: hidden;*!
}*/
</style>
