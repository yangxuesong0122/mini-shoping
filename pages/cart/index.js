/*1 获取用户的收货地址
    1 绑定点击事件
    2 调用小程序内置 api  获取用户的收货地址  wx.chooseAddress
    2 获取用户对小程序所授予获取地址的权限状态 scope
      1 假设 用户 点击获取收货地址的提示框 确定  authSetting scope.address 
        scope 值 true 直接调用 获取收货地址
      2 假设 用户 从来没有调用过 收货地址的api 
        scope undefined 直接调用 获取收货地址
      3 假设 用户 点击获取收货地址的提示框 取消   
        scope 值 false 
        1 诱导用户 自己 打开 授权设置页面(wx.openSetting) 当用户重新给与 获取地址权限的时候 
        2 获取收货地址
      4 把获取到的收货地址 存入到 本地存储中
  2 页面加载完毕
    0 onLoad  onShow 
    1 获取本地存储中的地址数据
    2 把数据 设置给data中的一个变量
  3 onShow 
  0 回到了商品详情页面 第一次添加商品的时候 手动添加了属性
    1 num=1;
    2 checked=true;
  1 获取缓存中的购物车数组
  2 把购物车数据 填充到data中
  4 全选的实现 数据的展示
    1 onShow 获取缓存中的购物车数组
    2 根据购物车中的商品数据 所有的商品都被选中 checked=true  全选就被选中
  5 总价格和总数量
    1 都需要商品被选中 我们才拿它来计算
    2 获取购物车数组
    3 遍历
    4 判断商品是否被选中
    5 总价格 += 商品的单价 * 商品的数量
    5 总数量 +=商品的数量
    6 把计算后的价格和数量 设置回data中即可
  6 商品的选中
    1 绑定change事件
    2 获取到被修改的商品对象
    3 商品对象的选中状态 取反
    4 重新填充回data中和缓存中
    5 重新计算全选。总价格 总数量。。。
  7 全选和反选
    1 全选复选框绑定事件 change
    2 获取 data中的全选变量 allChecked
    3 直接取反 allChecked=!allChecked
    4 遍历购物车数组 让里面 商品 选中状态跟随  allChecked 改变而改变
    5 把购物车数组 和 allChecked 重新设置回data 把购物车重新设置回 缓存中 
  8 商品数量的编辑
    1 "+" "-" 按钮 绑定同一个点击事件 区分的关键 自定义属性 
      1 “+” "+1"
      2 "-" "-1"
    2 传递被点击的商品id goods_id
    3 获取data中的购物车数组 来获取需要被修改的商品对象
    4 当 购物车的数量 =1 同时 用户 点击 "-"
      弹窗提示(showModal) 询问用户 是否要删除
      1 确定 直接执行删除
      2 取消  什么都不做 
    4 直接修改商品对象的数量 num
    5 把cart数组 重新设置回 缓存中 和data中 this.setCart
  9 点击结算
    1 判断有没有收货地址信息
    2 判断用户有没有选购商品
    3 经过以上的验证 跳转到 支付页面！ 
*/
import { getSetting, chooseAddress, openSetting } from "../../utils/asyncWx"
// 勾选开发者工具里面的增强编译即可
// import regeneratorRuntime from '../../lib/runtime/runtime'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    address: {},
    cart: [],
    allChecked: false,
    totalPrice: 0,
    totalNum: 0
  },
  onShow() {
    // 获取本地存储中的地址数据
    const address = wx.getStorageSync('address')
    // 获取缓存中的购物车数据
    const cart = wx.getStorageSync("cart") || []
    // 计算全选
    // 空数组调用every方法也会返回true
    // const allChecked = cart.length ? cart.every(item => item.checked) : false
    this.setCart(cart)
    this.setData({
      address
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },
  // 获取收货地址
  async handleChooseAddress() {
    // 获取权限状态
    // wx.getSetting({
    //   success: (result) => {
    //     const scopeAddress = result.authSetting['scope.address']
    //     if (scopeAddress || scopeAddress === undefined) {
    //       wx.chooseAddress({
    //         success: (result1) => {
    //           console.log(result1)
    //         }
    //       })
    //     } else {
    //       // 用户以前拒绝过授予权限，先诱导用户打开授权页面
    //       wx.openSetting({
    //         success: (result2) => {
    //           wx.chooseAddress({
    //             success: (result3) => {
    //               console.log(result3)
    //             }
    //           })
    //         }
    //       })
    //     }
    //   },
    //   fail: () => {},
    //   complete: () => {}
    // })

    try {
      // 获取权限状态
      const res1 = await getSetting()
      const scopeAddress = res1.authSetting['scope.address']
      // 判断权限状态
      if (scopeAddress === false) {
        // 诱导用户打开授权页面
        await openSetting()
      }
      // 调用获取收货地址的api
      const address = await chooseAddress()
      address.all = address.provinceName + address.cityName + address.countyName + address.detailInfo
      // 存入到缓存中
      wx.setStorageSync('address', address)
    } catch (error) {
      console.log(error)
    }
  },
  // 商品checkbox选中事件
  handleItemCheck(e) {
    // 获取被修改的商品的id
    const goods_id = e.currentTarget.dataset.id
    // 获取购物车数组
    let {cart} = this.data
    // 找到被修改的商品对象
    let index = cart.findIndex(v => v.goods_id === goods_id)
    cart[index].checked = !cart[index].checked
    // 把购物车数据重新设置回data中和缓存中
    this.setCart(cart)
  },
  // 设置购物车状态同时计算底部工具栏的数据：全选/数量/总价
  setCart(cart) {
    let allChecked = true
    // 计算总价格
    let totalPrice = 0
    let totalNum = 0
    cart.forEach(item => {
      if (item.checked) {
        totalPrice += item.num * item.goods_price
        totalNum += item.num
      } else {
        allChecked = false
      }
    })
    // 判断数组是否为空
    allChecked = cart.length ? allChecked : false
    this.setData({
      cart,
      allChecked,
      totalPrice,
      totalNum
    })
    wx.setStorageSync('cart', cart)
  },
  // 商品全选/反选
  handleAllCheck() {
    // 获取购物车数组
    let {cart, allChecked} = this.data
    cart.forEach(v => {
      v.checked = !allChecked
    })
    this.setCart(cart)
  }
})