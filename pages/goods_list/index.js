/* 
1 用户上滑页面 滚动条触底 开始加载下一页数据
  1 微信小程序官方开发文档找到滚动条触底事件
  2 判断还有没有下一页数据
    1 获取到总页数  只有总条数
      总页数 = Math.ceil(总条数 / 页容量pagesize)
      总页数     = Math.ceil( 23 / 10 ) = 3
    2 获取到当前的页码  pagenum
    3 判断一下 当前的页码是否大于等于 总页数 
      表示 没有下一页数据

  3 假如没有下一页数据 弹出一个提示
  4 假如还有下一页数据 来加载下一页数据
    1 当前的页码 ++
    2 重新发送请求
    3 数据请求回来  要对data中的数组 进行 拼接 而不是全部替换

2 下拉刷新页面
  1 触发下拉刷新事件 需要在页面的json文件中开启一个配置项
    找到 触发下拉刷新的事件
  2 重置 数据 数组 
  3 重置页码 设置为1
  4 重新发送请求
  5 数据请求回来 需要手动的关闭 等待效果
 */
import { request } from "../../request/index"
import regeneratorRuntime from '../../lib/runtime/runtime'

Page({
  /**
   * 页面的初始数据
   */
  data: {
    tabs: [
      {
        id: 0,
        value: '综合',
        isActive: true
      },
      {
        id: 1,
        value: '销量',
        isActive: false
      },
      {
        id: 2,
        value: '价格',
        isActive: false
      }
    ],
    goodsList: []
  },
  // 接口要的参数
  queryParams: {
    query: '',
    cid: '',
    pagenum: 1,
    pagesize: 10
  },
  totalPages: 1,

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.queryParams.cid = options.cid
    this.getGoodsList()
  },
  // 获取商品列表数据
  async getGoodsList() {
    const res = await request({
      url: 'goods/search',
      data: this.queryParams
    })
    // 计算总页数
    this.totalPages = Math.ceil(res.total/this.queryParams.pagesize)
    this.setData({
      goodsList: [...this.data.goodsList, ...res.goods]
    })
    // 关闭下拉窗口
    wx.stopPullDownRefresh()
  },
  // 标题点击事件 从子组件传递过来
  handleTabsItemChange(e) {
    const {index} = e.detail
    let {tabs} = this.data
    tabs.forEach((item, i) => {
      if (i === index) {
        item.isActive = true
      } else {
        item.isActive = false
      }
    });
    this.setData({
      tabs
    })
  },
  // 页面上滑滚动条触底事件
  onReachBottom() {
    // 判断还有没有下一页数据
    if (this.queryParams.pagenum <= this.totalPages) {
      this.queryParams.pagenum++
      this.getGoodsList()
    } else {
      wx.showToast({title: '没有下一页数据了'})
    }
  },
  // 页面下拉刷新
  onPullDownRefresh() {
    console.log('下拉')
    // 重置数组
    this.setData({
      goodsList: []
    })
    // 重置页码
    this.queryParams.pagenum = 1
    // 重新获取数据
    this.getGoodsList()
  }
})