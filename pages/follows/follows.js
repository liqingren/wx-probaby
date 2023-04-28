const { postParamsRequest } = require("../../utils/request");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    users:[],//关注的用户集合
    follow:{
      followerId:null,
      concernedId:null,
    },//关注对象

  },

  /**
   * 取消关注
   * @param {*} e 
   */
  onFollowUser:function(e){
    var index = e.currentTarget.dataset.index;
    var concernedId = this.data.users[index].userId;
    var followerId = wx.getStorageSync('user').userId;
    postParamsRequest("/follow/remove",{
      followerId:followerId,
      concernedId:concernedId
    })
    .then((value) =>{
      const {code,msg} = value;
      if(code == 200){
        var users = this.data.users;
        users.splice(index,1);
        this.setData({
          users:users
        })
        wx.showToast({
          title: msg
        })
      }else{
        wx.showToast({
          title: msg,
          icon:'error'
        })
      }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    var user = wx.getStorageSync('user');
    postParamsRequest("/user/listfollow",{userId:user.userId})
    .then((value) =>{
      const {data} = value;
      for(var i=0;i<data.length;i++){
        var cities = data[i].userCity.split(" ");
        data[i].city = cities[0];
      }
      this.setData({
        users:data
      })
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