/* 
1 输入框绑定 值改变事件 input事件
  1 获取到输入框的值
  2 合法性判断 
  3 检验通过 把输入框的值 发送到后台
  4 返回的数据打印到页面上
2 防抖 （防止抖动） 定时器  节流 
  0 防抖 一般输入框中防止重复输入重复发送请求
  1 节流 一般是用在页面下拉和上拉 
  1 定义全局的定时器id
 */
import { request } from "../../request/index"

Page({
  /**
   * 页面的初始数据
   */
  data: {
    goods: []
  },
  timeId: '',
  handleInput(e) {
    // 获取输入框的值
    const {value} = e.detail
    // 检查合法性
    if (!value.trim()) {
      return
    }
    // 获取数据
    clearTimeout(this.timeId)
    this.timeId = setTimeout(() => {
      this.getSearchGoods(value)
    }, 1000)
  },
  // 获取数据
  async getSearchGoods(query) {
    const {goods} = await request({
      url: 'goods/search',
      data: {query}
    })
    this.setData({
      goods
    })
  }
})