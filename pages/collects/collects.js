// pages/collects/collects.js
const {postParamsRequest} = require("../../utils/request")
Page({

  /**
   * 页面的初始数据
   */
  data: {
    trends:[],//收藏的动态
    flag:false,//判断通过onLoad()刷新还是onShow()刷新

  },

    /**
   * 点击进入详情
   * @param {*} e 
   */
  clickDetail:function(e){
    var trendId = e.currentTarget.dataset.trendid;
    var followed = e.currentTarget.dataset.followed;
    wx.navigateTo({
      url: '../detailtrend/detailtrend?trendId='+trendId + '&followed='+followed,
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    var user = wx.getStorageSync('user');
    postParamsRequest("/trend/listcollect",{userId:user.userId})
    .then((value) =>{
      const {data} = value;
      for(var i=0;i<data.length;i++){
        //对图片进行处理
        if(data[i].trendPhoto != null){
          var images = data[i].trendPhoto;
          var imgs = images.split(",");
          data[i].images = imgs;
          data[i].minHeight = 200 + data[i].images.length * 560;
        }
        //对视频进行处理
        if(data[i].trendVideo != null){
          var images = data[i].trendVideo;
          var imgs = images.split(",");
          data[i].trendVideo = imgs[0];
          data[i].coverImage = imgs[1];
        }
        //判断是否关注过该用户
        var follows = data[i].follows;
        if(follows.length<=0){
          data[i].followed = false;
        }
        if(follows.length>0){
          for(var j=0;j<follows.length;j++){
            if(data[i].userId == follows[j].concernedId){
              data[i].followed = true;//已关注
            }else{
              data[i].followed = false;//未关注
            } 
          }
        }
        
        //判断是否收藏
        var collects = data[i].collects;
        if(collects.length<=0){
          data[i].collected = false;
        }
        if(collects.length>0){
          for(var j=0;j<collects.length;j++){
            if(user.userId == collects[j].userId){
              data[i].collected = true;
            }
          }
        }

        //判断是否点赞
        var likes = data[i].likes;
        if(likes.length<=0){
          data[i].liked = false;
        }
        if(likes.length>0){
          for(var j=0;j<likes.length;j++){
            if(user.userId == likes[j].userId){
              data[i].liked = true;
            }
          }
        }       

         //评论数量
        var comments = data[i].comments;
        if(comments.length>0){
          data[i].commentCount = data[i].comments[0].count
        }else{
          data[i].commentCount = 0;
        }
      }
     
      this.setData({
        trends:data
      })
      // console.log(data)
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