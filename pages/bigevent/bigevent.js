const { postParamsRequest } = require("../../utils/request");
import {getAge} from '../../utils/util'

// pages/bigevent/bigevent.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    trends:[],//大事记动态
    flag:false,//刷新

  },

  /**
   * 添加标签
   * @param {*} e 
   */
  clickInsertTags:function(e){
    wx.navigateTo({
      url: '../tags/tags',
    })
  },


  /**
   * 点击进入详情页面
   * @param {*} e 
   */
  clickDetail:function(e){
    // console.log(e);
    var trendId = e.currentTarget.dataset.trendid;
    wx.navigateTo({
      url: '../trends/trends?trendId='+trendId,
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    var baby = wx.getStorageSync('baby');
    var user = wx.getStorageSync('user');
    postParamsRequest("/trend/bigevents",{
      babyId:baby.babyId,
      userId:user.userId
    })
    .then((value) =>{
      const {data} = value;
      for(var i=0;i<data.length;i++){
        //计算宝宝年龄
        data[i].age = getAge(baby.babyBirth,data[i].uploadTime);
        //对图片做处理
        if(data[i].trendPhoto != null){
          var images = data[i].trendPhoto.split(",");
          data[i].images = images;
        }
        //对视频做处理
        if(data[i].trendVideo != null){
          var images = data[i].trendVideo.split(",");
          data[i].trendVideo = images[0];
          data[i].coverImage = images[1];
        }
      }
      this.setData({
        trends:data
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
    if(this.data.flag){
      this.onLoad();//刷新
    }
    this.setData({
      flag:true
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
  async onPullDownRefresh() {
    await this.onLoad();//刷新
    wx.stopPullDownRefresh();//关闭下拉加载 
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