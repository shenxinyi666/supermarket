import {debounce} from "./utils";
import BackTop from "components/content/backTop/BackTop";

export const itemListenerMixin = {
  data() {
    return {
      itemImgListener: null,
      refresh: null
    }
  },
  mounted() {
    //1.监听图片加载完成
    this.refresh = debounce(this.$refs.scroll.refresh, 50)
    //2.对监听的事件进行保存
    this.itemImgListener = () => {
      this.refresh()
    }
    this.$bus.$on('itemImgLoad', this.itemImgListener)
    //console.log('我是混入中的内容');
  }
}

export const backTopMixin = {
  data() {
    return {
      isShowBackTop: false
    }
  },
  components: {
    BackTop
  },
  methods: {
    backClick() {
      //console.log('backClick');
      //this.$refs.scroll.scroll.scrollTo(0,0,500)
      this.$refs.scroll.scrollTo(0, 0)
    },
    listenShowBackTop(position) {
      this.isShowBackTop = (-position.y) > 1000
    }
  }
}
