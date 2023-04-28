const { postParamsRequest } = require("../../utils/request");

// pages/relative/relative.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userId:null,//登录用户id
    identities:[],//亲友
    mom:{},//妈妈
    dad:{},//爸爸
    createUserId:'',//创建宝宝的用户id

  },


  /**
   * 点击跳转到显示邀请二维码
   */
  clickInvite:function(){
    wx.navigateTo({
      url: '../invite/invite',
    })
  },




  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    var baby = wx.getStorageSync('baby');
    this.setData({
      createUserId:baby.userId,
      userId:wx.getStorageSync('user').userId
    })
    postParamsRequest("/identity/list",{babyId:baby.babyId})
    .then((value) =>{
      const {data} = value;
      for(var i=0;i<data.length;i++){
        if(data[i].identity == '妈妈'){
          this.setData({
            mom:data[i]
          })
          data.splice(i,1);
        }
        if(data.length>0){
          if(data[i].identity == '爸爸'){
            this.setData({
              dad:data[i]
            })
            data.splice(i,1);
          }
        }
        
      }
      this.setData({
        identities:data
      })
      // console.log(data);
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