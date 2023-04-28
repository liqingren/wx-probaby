const { postParamsRequest } = require("../../utils/request")

// pages/invited/invited.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    baby:{},//宝宝信息
    flag:false,//判断用户是否已关注宝宝
  },


  /**
   * 进入选择亲友关系页面
   */
  clickInvitation:function(){
    wx.navigateTo({
      url: '../invitation/invitation?baby='+JSON.stringify(this.data.baby),
    })
  },

  /**
   * 进入亲宝宝空间
   * @param {*} e 
   */
  clickEnter:function(){
    wx.setStorageSync('baby', this.data.baby);
    wx.switchTab({
      url: '../index/index',
      success: function(e) {
        var page = getCurrentPages().pop();
        if (page == undefined || page == null) {
          return
        }
        page.onLoad();//重新加载页面
      }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    if(options != null){
      this.setData({
        baby:JSON.parse(options.baby),
      })
    }
    postParamsRequest("/identity/list",{babyId:this.data.baby.babyId})
    .then((value) =>{
      const {data} = value;
      var user = wx.getStorageSync('user');
      for(var i=0;i<data.length;i++){
        if(data[i].userId == user.userId){
          this.setData({
            flag:true
          })
        }
      }
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