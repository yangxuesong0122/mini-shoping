import { request } from "../../request/index"
Page({
  data: {
    swiperList: [],
    catesList: []
  },
  // 页面开始加载触发
  onLoad: function(options) {
    // 获取轮播图数据
    this.getSwiperList()
    // 获取分类导航数据
    this.getCatesList()
  },
  // 获取轮播图数据
  getSwiperList() {
    request({
      url: 'home/swiperdata',
    }).then(data => {
      this.setData({
        swiperList: data
      })
    })
  },
  // 获取分类导航数据
  getCatesList() {
    request({
      url: 'home/catitems',
    }).then(data => {
      this.setData({
        catesList: data
      })
    })
  },
});