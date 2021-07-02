import {debounce} from "./utils";

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
