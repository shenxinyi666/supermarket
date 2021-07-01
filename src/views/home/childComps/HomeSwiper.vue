<template>
  <swiper>
    <swiper-item v-for="item in banners">
      <a :href="item.link">
        <img :src="item.image" alt="" @load="imageload">
      </a>
    </swiper-item>
  </swiper>
</template>

<script>
//import Swiper from "components/common/swiper/Swiper";
//import SwiperItem from "components/common/swiper/SwiperItem";
import {Swiper, SwiperItem} from "components/common/swiper";

export default {
  name: "HomeSwiper",
  props: {
    banners: {
      type: Array,
      default() {
        return []
      }
    }
  },
  data() {
    return {
      isLoad: false
    }
  },
  components: {
    Swiper, SwiperItem
  },
  methods: {
    imageload() {
      if (!this.isLoad) {
        //console.log('imageload');
        this.$emit('swiperImageLoad')
        this.isLoad = true
      }
    }
  }
}
</script>

<style scoped>

</style>
