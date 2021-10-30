/* 
1 页面加载的时候
  1 从缓存中获取购物车数据 渲染到页面中
    这些数据  checked=true 
2 微信支付
  1 哪些人 哪些帐号 可以实现微信支付
    1 企业帐号 
    2 企业帐号的小程序后台中必须给开发者添加上白名单 
      1 一个 appid 可以同时绑定多个开发者
      2 这些开发者就可以公用这个appid 和 它的开发权限  
3 支付按钮
  1 先判断缓存中有没有token
  2 没有 跳转到授权页面 进行获取token 
  3 有token 。。。
  4 创建订单 获取订单编号
  5 已经完成了微信支付
  6 手动删除缓存中 已经被选中了的商品 
  7 删除后的购物车数据 填充回缓存
  8 再跳转页面 
 */
import { requestPayment, showToast } from "../../utils/asyncWx"
import { request } from "../../request/index"
// 勾选开发者工具里面的增强编译即可
// import regeneratorRuntime from '../../lib/runtime/runtime'

Page({
  /**
   * 页面的初始数据
   */
  data: {
    address: {},
    cart: [],
    totalPrice: 0,
    totalNum: 0
  },
  onShow() {
    // 获取本地存储中的地址数据
    const address = wx.getStorageSync('address')
    // 获取缓存中的购物车数据
    let cart = wx.getStorageSync("cart") || []
    // 获取到checkbox为true的商品
    cart = cart.filter(v => v.checked)
    // 计算总价格
    let totalPrice = 0
    let totalNum = 0
    cart.forEach(item => {
      totalPrice += item.num * item.goods_price
      totalNum += item.num
    })
    this.setData({
      cart,
      totalPrice,
      totalNum
    })
    this.setData({
      address
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },
  // 支付
  async handlePay() {
    try {
      // 判断缓存中有没有token
      const token = wx.getStorageSync('token')
      if (!token) {
        wx.navigateTo({
          url: '/pages/auth/index'
        })
        return
      }
      // 创建订单
      // 请求头参数
      // const header = {Authorization: token}
      // 请求体参数
      const order_price = this.data.totalPrice
      const consignee_addr = this.data.address.all
      let goods = this.data.cart.map(item => {
        return {
          goods_id: item.goods_id,
          goods_number: item.num,
          goods_price: item.goods_price
        }
      })
      let params = {
        order_price,
        consignee_addr,
        goods
      }
      // 创建订单
      let {order_number} = await request({
        url: 'my/orders/create',
        method: 'post',
        data: params
      })
      // 发起预支付接口
      const {pay} = await request({
        url: 'my/orders/req_unifiedorder',
        method: 'post',
        data: {order_number}
      })
      // // 发起微信支付
      // const res = requestPayment(pay)
      // // 这一步支付不成功，因为没有企业账号
      // // 查询后台订单状态
      // const res1 = request({
      //   url: 'my/orders/chkOrder',
      //   method: 'post',
      //   data: {order_number}
      // })
      await showToast('支付成功')
      // 删除缓存中被选中的商品，然后重新填充到缓存
      let newCart = wx.getStorageSync("cart") || []
      newCart = newCart.filter(v => !v.checked)
      wx.setStorageSync('cart', newCart)
      // 跳转到订单页面
      wx.navigateTo({
        url: '/pages/order/index'
      })
    } catch (error) {
      await showToast('支付失败')
    }
  }
})