const { postParamsRequest } = require("../../utils/request");

// pages/my/my.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    user:{},//用户信息
    collects:[],//收藏集合
    likes:[],//点赞集合
    follows:[],//关注集合

  },

  /**
   * 跳转到个人信息页面
   */
  handleUserInfo:function(){
    wx.navigateTo({
      url: '../profile/profile',
    })
  },

  /**
   * 跳转到添加宝宝信息页面
   */
  handleBabyInfo:function(){
    wx.navigateTo({
      url: '../addbaby/addbaby',
    })
  },


  /**
   * 扫描二维码
   */
  scanCode:function(){
    //调用接口扫描二维码
    wx.scanCode({
      success(res){
        var list = res.result.split("\\");
        wx.navigateTo({
          url: list[1]+"?baby="+list[0],
        })
      }
    })
  },

  /**
   * 退出
   */
  loginout:function(){
    wx.showModal({
      title: '提示',
      content: '您确定要退出吗？',
      complete: (res) => {
        if (res.confirm) {
          //清除storage中的数据
          wx.removeStorageSync('token');
          wx.removeStorageSync('user');
          wx.removeStorageSync('baby');
          let openid = wx.getStorageSync('openid')
          if(openid != '' && openid != null){
            wx.removeStorageSync('openid');
          }
          //跳转到登录页面
          wx.redirectTo({
            url: '../login/login'
          })
        }
      }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.setData({
      user:wx.getStorageSync('user')
    })
    
    
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {
    postParamsRequest("/trend/listByUserId",{userId:this.data.user.userId})
    .then((value) =>{
      const {data} = value;
      this.setData({
        collects:data.collects,
        likes:data.likes,
        follows:data.follows
      })
    })
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  }
})