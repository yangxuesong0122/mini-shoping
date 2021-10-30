/* 
1 发送请求获取数据 
2 点击轮播图 预览大图
  1 给轮播图绑定点击事件
  2 调用小程序的api  previewImage 
3 点击 加入购物车
  1 先绑定点击事件
  2 获取缓存中的购物车数据(数组格式)
  3 先判断当前的商品是否已经存在于购物车
  4 已经存在,修改商品数据  执行购物车数量++ 重新把购物车数组 填充回缓存中
  5 不存在于购物车的数组中 直接给购物车数组添加一个新元素 新元素 带上 购买数量属性 num  重新把购物车数组 填充回缓存中
  6 弹出提示
4 商品收藏
  1 页面onShow的时候  加载缓存中的商品收藏的数据
  2 判断当前商品是不是被收藏 
    1 是 改变页面的图标
    2 不是 。。
  3 点击商品收藏按钮 
    1 判断该商品是否存在于缓存数组中
    2 已经存在 把该商品删除
    3 没有存在 把商品添加到收藏数组中 存入到缓存中即可
 */
import { request } from "../../request/index"
import regeneratorRuntime from '../../lib/runtime/runtime'
Page({
  /**
   * 页面的初始数据
   */
  data: {
    goodsObj: {}
  },
  goodsInfo: {},

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 获取商品详情
    this.getGoodsDetail(options.goods_id)
  },
  // 获取商品详情
  async getGoodsDetail(goods_id) {
    let goodsObj = await request({
      url: 'goods/detail',
      data: {goods_id}
    })
    this.goodsInfo = goodsObj
    this.setData({
      goodsObj: {
        pics: goodsObj.pics,
        goods_price: goodsObj.goods_price,
        goods_name: goodsObj.goods_name,
        // 部分iphone手机不识别webp图片格式，最好让后台修改，临时自己改
        // 要确保后台存在 1.webp => 1.jpg
        goods_introduce: goodsObj.goods_introduce.replace(/\.webp/g, '.jpg')
      }
    })
  },
  // 点击轮播图放大预览
  handleImageTap(e) {
    // 构造要预览的图片数组
    const urls = this.goodsInfo.pics.map(v => v.pics_mid)
    wx.previewImage({
      urls,
      current: e.currentTarget.dataset.url
    })
  },
  // 加入购物车
  handleCartAdd() {
    // 获取缓存中的购物车数据
    let cart = wx.getStorageSync('cart') || []
    // 判断当前的商品是否已经存在于购物车
    let index = cart.findIndex(v => v.goods_id === this.goodsInfo.goods_id)
    if (index === -1) {
      // 不存在，证明是第一次添加
      this.goodsInfo.num = 1
      this.goodsInfo.checked = true
      cart.push(this.goodsInfo)
    } else {
      // 已经存在购物车数据 执行 数量++
      cart[index].num++
    }
    // 重新把购物车数组 填充回缓存中
    wx.setStorageSync('cart', cart)
    wx.showToast({
      title: '加入购物车成功',
      icon: 'success',
      mask: true
    }) 
  }
})