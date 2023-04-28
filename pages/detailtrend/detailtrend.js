const { formatDate, formatTime,getAge } = require("../../utils/util");
const {postRequest,postParamsRequest} = require("../../utils/request")

// pages/detailtrend/detailtrend.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    trend:{},//动态信息
    trendId:null,//动态id
    followed:null,//是否关注发布者
    comments:{},//评论集合
    maxMediaHeight:0,//图片或视频高度
    locate:'comment',//跳转到评论位置,
    comment:{},//当前点击的评论
    userId:null,//登录用户id
    height:100,//对话框的高度
    showMiniStatus:null,//回复操作框状态
    showOperStatus:null,//编辑删除操作框状态
    animationData: '',//动画实例
    show:true,//判断显示回复还是删除，或者两者都显示
    flag:false,//判断是否通过onShow()调用onLoad()刷新页面


  },


  /**
    * 点击图片放大全屏
    * @param {*} e 
    */
  clickImage:function(e){
    var index = e.currentTarget.dataset.index;
    var images = this.data.trend.images;
    var imgUrl = images[index];
    wx.previewImage({
      urls: images, //需要预览的图片http链接列表，注意是数组
      current:imgUrl, // 当前显示图片的http链接，默认是第一个
      success: function (res) { },
      fail: function (res) { },
      complete: function (res) { },
    })
   },


   /**
    * 预览视频
    * @param {*} e 
    */
   clickVideo:function(){
    var trend = this.data.trend;
    var videoUrl = trend.trendVideo;
    wx.previewMedia({
      sources: [{
        url: videoUrl,
        type: 'video',
      }],
      showmenu: true,
      success: function (res) { },
      fail: function (res) { },
      complete: function (res) { },
    })
   },



   /**
    * 放大评论的图片
    * @param {*} e 
    */
  clickCommentMedia:function(e){
     var index = e.currentTarget.dataset.index;
     var image = this.data.trend.comments[index].media;
     wx.previewImage({
      urls: [image], //需要预览的图片http链接列表，注意是数组
      current:'', // 当前显示图片的http链接，默认是第一个
      success: function (res) { },
      fail: function (res) { },
      complete: function (res) { },
    })
   },



  /**
   * 点击评论跳转到评论页面
   */
  clickComment:function(){
    var trendId = this.data.trend.trendId;
    wx.navigateTo({
      url: '../comment/comment?trendId='+trendId,
    })
  },

   /**
    * 关注
    * @param {*} e 
    */
   followUser:function(){
    var trend = this.data.trend;
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
        this.setData({
          followed:'true'
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
   onFollowUser:function(){
    var trend = this.data.trend;
    var concernedId = trend.userId;//被关注人
    var followerId = wx.getStorageSync('user').userId;//关注人
    postParamsRequest("/follow/remove",{
      followerId:followerId,
      concernedId:concernedId
    })
    .then((value) =>{
      const {code,msg} = value;
      if(code == 200){
        this.setData({
          followed:'false'
        })
        //消息弹窗
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
    * 收藏
    * @param {*} e 
    */
  clickCollected:function(e){
    var trend = this.data.trend;
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
        this.setData({
          trend:trend
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
    var trend = this.data.trend;
    var trendId = trend.trendId;
    var userId = wx.getStorageSync('user').userId;
    postParamsRequest("/collect/remove",{
      userId:userId,
      trendId:trendId
    }).then((value) =>{
      const {code,msg} = value;
      if(code == 200){
        var collects = trend.collects;
        var index = ''; 
        //获取删除的收藏的下标
        for(var i=0;i<collects.length;i++){
          if(collects[i].userId == userId && collects[i].trendId == trendId){
            index =i;
          }
        }
        //将其移除收藏集合
        collects.splice(index,1);
        trend.collects = collects;
        trend.collected = false;
        this.setData({
          trend:trend
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
    var trend = this.data.trend;
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
        this.setData({
          trend:trend
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
    var trend = this.data.trend;
    var trendId = trend.trendId;
    var userId = wx.getStorageSync('user').userId;
    postParamsRequest("/like/remove",{
      userId:userId,
      trendId:trendId
    }).then((value) =>{
      const {code,msg} = value;
      if(code == 200){
        var likes = trend.likes;
        var index = ''; 
        //获取删除的收藏的下标
        for(var i=0;i<likes.length;i++){
          if(likes[i].userId == userId && likes[i].trendId == trendId){
            index =i;
          }
        }
        //将其移除收藏集合
        likes.splice(index,1);
        trend.likes = likes;
        trend.liked = false;
        this.setData({
          trend:trend
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
    if(options != undefined){
      this.setData({
        followed:options.followed,
        trendId:options.trendId
      })
    }
    if(this.data.trendId != null && this.data.trendId != ''){
      postParamsRequest("/trend/gettrend",{trendId:this.data.trendId})
      .then((value) =>{
        const {data} = value;
        var user = wx.getStorageSync('user');
        //计算宝宝年龄
        var baby = data.baby;
        if(baby.babyBirth != null){
          data.baby.age = getAge(baby.babyBirth,data.uploadTime);
        }

        //对图片进行处理
        if(data.trendPhoto != null){
          var images = data.trendPhoto;
          var imgs = images.split(",");
          data.images = imgs;
          //高度处理
          if(data.images.length ==2 || data.images.length ==4){
            data.height = 100 * wx.getWindowInfo().pixelRatio;
            data.width = '46%';
            
          }else if(data.images.length>=3){
            data.height = 80 * wx.getWindowInfo().pixelRatio;;
            data.width = '30%'
          }else{
            data.height = 140 * wx.getWindowInfo().pixelRatio;;
            data.width = '76%';
          }
          //设置图片区域高度
          var len = Math.ceil(data.images.length/3);
          this.setData({
            maxMediaHeight:len * data.height+40
          })
        }
        //对视频进行处理
        if(data.trendVideo != null){
          var images = data.trendVideo;
          var imgs = images.split(",");
          data.trendVideo = imgs[0];
          data.coverImage = imgs[1];
          this.setData({
            maxMediaHeight:480
          }) 
        }
 
        //判断是否收藏
        var collects = data.collects;
        if(collects.length<=0){
          data.collected = false;
        }
        if(collects.length>0){
          for(var j=0;j<collects.length;j++){
            if(user.userId == collects[j].userId){
              data.collected = true;
            }
          }
        }

        //判断是否点赞
        var likes = data.likes;
        if(likes.length<=0){
          data.liked = false;
        }
        if(likes.length>0){
          for(var j=0;j<likes.length;j++){
            if(user.userId == likes[j].userId){
              data.liked = true;
            }
          }
        }       

         //评论数量
        var comments = data.comments;
        if(comments.length>0){
          data.commentCount = data.comments[0].count
        }else{
          data.commentCount = 0;
        }
        this.setData({
          trend:data,
          comments:data.comments,
          userId:user.userId
        })
        // console.log(this.data.trend)
      })
    
    }
  },



  /**
   * 回复一级评论
   * @param {*} e 
   */
  clickResponse:function(e){
    // console.log(e)
    this.setData({
      comment:e.detail.comment
    })
    //设置对话框的高度
    if(this.data.userId == this.data.trend.userId){
      if(this.data.userId == this.data.comment.userId){
        this.setData({
          height:200
        })
      }else{
        this.setData({
          height:300
        })
      }
    }else{
      this.setData({
        height:200,
        show:false
      })
    }
    this.showComtModal();
  },

  
  /**
   * 回复多级评论
   * @param {*} e 
   */
  clickMultResponse:function(e){
    // console.log(e)
    this.setData({
      comment:e.detail
    })
    //设置对话框的高度
    if(this.data.userId == this.data.trend.userId){
      if(this.data.userId == this.data.comment.userId){
        this.setData({
          height:200
        })
      }else{
        this.setData({
          height:300
        })
      }
      
    }else{
      this.setData({
        show:false,
        height:200
      })
    }
    this.showComtModal();
  },

  /**
   * 跳转到回复页面
   */
  navigateComment:function(){
    var trendId = this.data.trend.trendId;
    wx.navigateTo({
      url: '../comment/comment?trendId='+trendId+"&comment="+encodeURIComponent(JSON.stringify(this.data.comment)),
    })
  },


  /**
   * 删除一级评论（仅动态发布者删除）
   */
  clickDeleteComment:function(){
    var commentId = this.data.comment.commentId;
    postParamsRequest("/comment/remove",{commentId:commentId})
    .then((value) =>{
      const {code,msg} = value;
      if(code == 200){
        this.onLoad();
        this.hideComtModal();
      }else{
        wx.showToast({
          title: msg,
          icon:'error'
        })
      }
    })
  },


  /**
   * 点击取消，因此回复评论框
   */
  clickExit:function(){
    this.hideComtModal();
  },

  /**
   * 显示回复操作框
   **/
  showComtModal: function () {
    // 显示遮罩层
    var animation = wx.createAnimation({
      timingFunction: 'step-start',
      delay: 0
    })
    this.animation = animation
    animation.translateY(300).step()
    this.setData({
      animationData: animation.export(),
      showMiniStatus: true
    })
    animation.translateY(0).step()
    this.setData({
      animationData: animation.export()
    })
  },

  
  /**
   * 隐藏回复操作框
   */
  hideComtModal: function () {
    // 隐藏遮罩层
    var animation = wx.createAnimation({
      timingFunction: "linear",
      delay: 0
    })
    this.animation = animation
    animation.translateY(300).step()
    this.setData({
      animationData: animation.export(),
    })
    animation.translateY(0).step()
    this.setData({
      animationData: animation.export(),
      showMiniStatus: false
    })
  },


  /**
   * 点击显示编辑删除操作框
   */
  clickShowOper:function(){
    this.showModal();
  },


  /**
   * 点击隐藏编辑删除操作框
   */
  clickHideOper:function(){
    this.hideModal();
  },


  /**
   * 显示编辑删除操作框
   */
  showModal:function(){
    // 显示遮罩层
    var animation = wx.createAnimation({
      timingFunction: 'step-start',
      delay: 0
    })
    this.animation = animation
    animation.translateY(300).step()
    this.setData({
      animationData: animation.export(),
      showOperStatus: true
    })
    animation.translateY(0).step()
    this.setData({
      animationData: animation.export()
    })
  },


  /**
   * 隐藏编辑删除操作框
   */
  hideModal:function(){
    // 隐藏遮罩层
    var animation = wx.createAnimation({
      timingFunction: "linear",
      delay: 0
    })
    this.animation = animation
    animation.translateY(300).step()
    this.setData({
      animationData: animation.export(),
    })
    animation.translateY(0).step()
    this.setData({
      animationData: animation.export(),
      showOperStatus: false
    })
  },


   /**
   * 点击删除
   */
  clickDeleteTrend:function(){
    var that = this;
    wx.showModal({
      title: '提示',
      content: '确定删除这条记录吗？',
      success: function(res) {
        if (res.confirm) {
          postParamsRequest("/trend/remove",{trendId:that.data.trend.trendId})
          .then((value) =>{
            const {code,msg}= value;
            // console.log(value);
            if(code == 200 ){
              var curr = getCurrentPages();
              var prve = curr[curr.length-2];
              if(prve != undefined && prve != null){
                var trends = prve.data.trends;
                trends.splice(that.data.index,1);
                prve.setData({
                  trends:trends
                })
              }
              wx.showToast({
                title: msg,
              })  
              wx.navigateBack({
                delta: 1
              });
            }else{
              wx.showToast({
                title: msg,
                icon:'error'
              })
            }
            
          })
        } else if (res.cancel) {
          return false;
        }
      }
    })
  },

  /**
   * 点击跳转到编辑页面
   */
  clickEdit:function(){
    wx.navigateTo({
      url: '../edittrend/edittrend?trend='+encodeURIComponent(JSON.stringify(this.data.trend)),
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
    this.hideComtModal();
    this.hideModal();

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