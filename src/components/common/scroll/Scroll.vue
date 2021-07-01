<template>
  <!--ref/children-->
  <div class="wrapper" ref="wrapper">
    <div class="content">
      <slot></slot>
    </div>
  </div>
</template>

<script>
import BScroll from 'better-scroll';

export default {
  name: "Scroll",
  props: {
    probeType: {
      type: Number,
      default: 0
    },
    pullUpLoad: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      scroll: null
    }
  },

  mounted() {
    //1.创建BScroll对象
    this.scroll = new BScroll(this.$refs.wrapper, {
      click: true,
      //probeType:3,
      probeType: this.probeType,
      //pullUpLoad: true
      pullUpLoad: this.pullUpLoad
    })
    //2.监听滚动的位置
    if (this.probeType === 2 || this.probeType === 3) {
      this.scroll.on('scroll', (position) => {
        //console.log(position);
        this.$emit('scroll', position)
      })
    }
    //console.log(this.scroll);
    //刷新scroll中的scrollerHeight属性
    //this.scroll.refresh()

    //3.监听scroll滚到顶部
    if (this.pullUpLoad) {
      //监听上拉事件
      this.scroll.on('pullingUp', () => {
        //console.log('上拉加载更多');
        this.$emit('pullingUp')
      })
    }
  },
  methods: {
    scrollTo(x, y, time = 500) {
      this.scroll && this.scroll.scrollTo(x, y, time)
    },
    finishPullUp() {
      this.scroll && this.scroll.finishPullUp()
    },
    refresh() {
      //console.log('---');
      this.scroll && this.scroll.refresh()
    },
    getScrollY(){
      return this.scroll?this.scroll.y:0
    }
  }
}
</script>

<style scoped>

</style>
