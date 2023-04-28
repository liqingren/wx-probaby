const { postParamsRequest, postRequest } = require("../../utils/request")
const {getAge} = require("../../utils/util")
Page({

  /**
   * 页面的初始数据
   */
  data: {
    trends:[],//所有动态（登录用户有权限查看的）
    follow:{
      followerId:null,
      concernedId:null,
    },//关注
    collect:{
      userId:null,
      trendId:null,
    },//收藏
    like:{
      userId:null,
      trendId:null,
    },//点赞
    _index:0,//视频下标
    userId:null,//登录用户id
    flag:false,//判断是否通过onShow()调用onLoad()刷新页面
  },


 /**
   * 滚动屏幕播放视频
   */
  onPageScroll(){
    this.intersectionObserver = this.createIntersectionObserver({observeAll: true})
    this.intersectionObserver.relativeTo('.relativeView')
    .observe(".video-list", (res) => {
      let index = res.dataset.id
      let intersectionRatio = res.intersectionRatio
      if(intersectionRatio > 0) {
        this.setData({
          _index: index
        })
      }else{
        this.setData({
          _index:null
        })
      }
    })
  },


  /**
   * 点击播放视频
   * @param {*} e 
   */
  play:function(e){
    var index = e.currentTarget.dataset.id;
    this.setData({
      _index:index
    })
  },


  /**
   * 点击内容跳转到详情页面
   * @param {*} e 
   */
  clickDeatil:function(e){
    var index = e.currentTarget.dataset.index;
    var trend = this.data.trends[index];
    var followed = trend.followed;
    wx.navigateTo({
      url: '../detailtrend/detailtrend?trendId='+trend.trendId+'&followed='+followed,
    })
  },


  /**
    * 点击图片放大全屏
    * @param {*} e 
    */
   clickImage:function(e){
    var bigIndex = e.currentTarget.dataset.bigindex;//外层循环的下标
    var smallIndex = e.currentTarget.dataset.small;//内层循环的下标
    var images = this.data.trends[bigIndex].images;
    var imgUrl = images[smallIndex];
    wx.previewImage({
      urls: images, //需要预览的图片http链接列表，注意是数组
      current:imgUrl, // 当前显示图片的http链接，默认是第一个
      success: function (res) { },
      fail: function (res) { },
      complete: function (res) { },
    })
   },


   /**
    * 关注
    * @param {*} e 
    */
   followUser:function(e){
    var index = e.currentTarget.dataset.index;
    var trend = this.data.trends[index];
    var concernedId = trend.userId;//被关注人
    var followerId = wx.getStorageSync('user').userId;//关注人
    this.setData({
      'follow.followerId':followerId,
      'follow.concernedId':concernedId
    })
    postRequest("/follow/save",this.data.follow)
    .then((value) =>{
      const {code,msg} = value;
      if(code == 200){
       //将增加的收藏放入收藏集合中
       trend.follows.push(this.data.follow);
       trend.followed = true;
       var trends = this.data.trends;
       trends[index]= trend;
       for(var i=0;i<trends.length;i++){
         if(trends[i].userId == concernedId){
           trends[i].followed = true;
         }
       }
       //更新trends
       this.setData({
         trends:trends
       })
       wx.showToast({
         title: msg,
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
    * 取消关注
    * @param {*} e 
    */
   onFollowUser:function(e){
    var index = e.currentTarget.dataset.index;
    var trend = this.data.trends[index];
    var concernedId = trend.userId;//被关注人
    var followerId = wx.getStorageSync('user').userId;//关注人
    postParamsRequest("/follow/remove",{
      followerId:followerId,
      concernedId:concernedId
    })
    .then((value) =>{
      const {code,msg} = value;
      if(code == 200){
        //更新trends中的follows
        var trends = this.data.trends;
        for(var i=0;i<trends.length;i++){
          if(trends[i].userId == concernedId){
            trends[i].followed = false;
          }
          var follows = trends[i].follows
          for(var j=0;j<follows.length;j++){
            if(follows[j].followerId == followerId 
              && follows[j].concernedId == concernedId){
              follows.splice(j,1);
            }
          }
          trends[i].follows = follows;
        }
        wx.showToast({
          title: msg,
        })
        this.setData({
          trends:trends
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
    * 收藏
    * @param {*} e 
    */
   clickCollected:function(e){
    var index = e.currentTarget.dataset.index;
    var trend = this.data.trends[index];
    var trendId = trend.trendId;
    var userId = wx.getStorageSync('user').userId;
    this.setData({
      'collect.userId':userId,
      'collect.trendId':trendId,
    })
    postRequest("/collect/save",this.data.collect)
    .then((value) =>{
      const {code,msg} = value;
      if(code == 200){
        //将增加的收藏放入收藏集合中
        trend.collects.push(this.data.collect);
        trend.collected = true;
        var trends = this.data.trends;
        trends[index]= trend;
        //更新trends
        this.setData({
          trends:trends
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
    * 取消收藏
    * @param {*} e 
    */
   onClickCollected:function(e){
    var index = e.currentTarget.dataset.index;
    var trend = this.data.trends[index];
    var trendId = trend.trendId;
    var userId = wx.getStorageSync('user').userId;
    postParamsRequest("/collect/remove",{
      userId:userId,
      trendId:trendId
    }).then((value) =>{
      const {code,msg} = value;
      if(code == 200){
        var collects = trend.collects;
        var colIndex = ''; 
        //获取删除的收藏的下标
        for(var i=0;i<collects.length;i++){
          if(collects[i].userId == userId && collects[i].trendId == trendId){
            colIndex =i;
          }
        }
        //将其移除收藏集合
        collects.splice(colIndex,1);
        trend.collects = collects;
        trend.collected = false;
        var trends = this.data.trends;
        trends[index]= trend;
         //更新trends
         this.setData({
           trends:trends
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
    * 点赞
    * @param {*} e 
    */
   clickLiked:function(e){
    var index = e.currentTarget.dataset.index;
    var trend = this.data.trends[index];
    var trendId = trend.trendId;
    var userId = wx.getStorageSync('user').userId;
    this.setData({
      'like.userId':userId,
      'like.trendId':trendId,
    })
    postRequest("/like/save",this.data.like)
    .then((value) =>{
      const {code,msg} = value;
      if(code == 200){
         //将增加的点赞放入点赞集合中
         trend.likes.push(this.data.like);
         trend.liked = true;
         var trends = this.data.trends;
         trends[index]= trend;
         //更新trends
         this.setData({
           trends:trends
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
    * 取消点赞
    * @param {*} e 
    */
   onClickLiked:function(e){
    var index = e.currentTarget.dataset.index;
    var trend = this.data.trends[index];
    var trendId = trend.trendId;
    var userId = wx.getStorageSync('user').userId;
    postParamsRequest("/like/remove",{
      userId:userId,
      trendId:trendId
    }).then((value) =>{
      const {code,msg} = value;
      if(code == 200){
        var likes = trend.likes;
        var likeIndex = ''; 
        //获取删除的点赞的下标
        for(var i=0;i<likes.length;i++){
          if(likes[i].userId == userId && likes[i].trendId == trendId){
            likeIndex =i;
          }
        }
        //将其移除点赞集合
        likes.splice(likeIndex,1);
        trend.likes = likes;
        trend.liked = false;
        var trends = this.data.trends;
        trends[index]= trend;
         //更新trends
         this.setData({
           trends:trends
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
  async onLoad(options) {
    var user = wx.getStorageSync('user');
    wx.showLoading();//加载loading
    await postParamsRequest("/trend/list",{userId:user.userId})
    .then((value) =>{
      const {data} = value;
      for(var i=0;i<data.length;i++){
        //计算宝宝年龄
        var baby = data[i].baby;
        if(baby.babyBirth != null){
          data[i].baby.age = getAge(baby.babyBirth,data[i].uploadTime);
        }

        //对图片进行处理
        if(data[i].trendPhoto != null){
          var images = data[i].trendPhoto;
          var imgs = images.split(",");
          data[i].images = imgs;
          //高度处理
          if(data[i].images.length ==2 || data[i].images.length ==4){
            data[i].height = 100 * wx.getWindowInfo().pixelRatio;
            data[i].width = '48%';
            
          }else if(data[i].images.length>=3){
            data[i].height = 80 * wx.getWindowInfo().pixelRatio;;
            data[i].width = '32%'
          }else{
            data[i].height = 140 * wx.getWindowInfo().pixelRatio;;
            data[i].width = '96%';
          }
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
        trends:data,
        userId:wx.getStorageSync('user').userId
      })
      wx.hideLoading();//隐藏加载loading
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