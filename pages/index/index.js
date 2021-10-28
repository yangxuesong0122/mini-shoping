import { request } from "../../request/index"
Page({
  data: {
    swiperList: [], // 轮播图数据
    catesList: [], // 分类导航数据
    floorList: [] // 楼层数据
  },
  // 页面开始加载触发
  onLoad: function(options) {
    // 获取轮播图数据
    this.getSwiperList()
    // 获取分类导航数据
    this.getCatesList()
    // 获取楼层数据
    this.getFloorList()
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
  // 获取楼层数据
  getFloorList() {
    request({
      url: 'home/floordata',
    }).then(data => {
      this.setData({
        floorList: data
      })
    })
  },
});