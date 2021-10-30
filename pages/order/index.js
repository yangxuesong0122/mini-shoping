/* 
1 页面被打开的时候 onShow 
  0 onShow 不同于onLoad 无法在形参上接收 options参数 
  0.5 判断缓存中有没有token 
    1 没有 直接跳转到授权页面
    2 有 直接往下进行 
  1 获取url上的参数type
  2 根据type来决定页面标题的数组元素 哪个被激活选中 
  2 根据type 去发送请求获取订单数据
  3 渲染页面
2 点击不同的标题 重新发送请求来获取和渲染数据 
 */
import { request } from "../../request/index"
Page({
  /**
   * 页面的初始数据
   */
  data: {
    orders: [],
    tabs: [
      {
        id: 0,
        value: '全部',
        isActive: true
      },
      {
        id: 1,
        value: '待付款',
        isActive: false
      },
      {
        id: 2,
        value: '待发货',
        isActive: false
      },
      {
        id: 2,
        value: '退款/退货',
        isActive: false
      }
    ],
  },
  onShow() {
    const token = wx.getStorageSync('token');
    if (!token) {
      wx.navigateTo({
        url: '/pages/auth/index'
      })
      return
    }
    // 获取当前小程序的页面栈 长度最大是10个页面
    let pages = getCurrentPages()
    // 数组中索引最大的就是当前页面
    let currentPage = pages[pages.length - 1]
    let {type} = currentPage.options
    // 激活选中页面标题
    this.changeTitleByIndex(type - 1)
    this.getOrderList(type)
  },
  // tabs点击事件
  handleTabsItemChange(e) {
    const {index} = e.detail
    this.changeTitleByIndex(index)
    // 重新发送请求
    this.getOrderList(index + 1)
  },
  // 根据标题索引来激活选中标题数组
  changeTitleByIndex(index) {
    let {tabs} = this.data
    tabs.forEach((item, i) => {
      if (i === index) {
        item.isActive = true
      } else {
        item.isActive = false
      }
    })
    this.setData({
      tabs
    })
  },
  // 获取订单列表
  async getOrderList(type) {
    const res = await request({
      url: 'my/orders/all',
      data: {type}
    })
    this.setData({
      orders: res.orders.map(v => ({...v, create_time_cn: (new Date(v.create_time * 1000).toLocaleString())}))
    })
  }
})