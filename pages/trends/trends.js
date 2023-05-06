const { postParamsRequest,postRequest } = require("../../utils/request");
import {getAge} from '../../utils/util'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    trend:{},//动态信息
    tags:[],//标签
    trendId:null,//动态id
    index:null,//下标
    discuss:{
      content:''
    },//亲友评论
    cursor:0,//textarea光标位置
    releaseFocus:false,//输入框焦点
    showMiniStatus:null,//操作框状态
    placeholder:'说点什么，关爱一下',//评论输入框默认placeholder
    keywordHeight:0, //键盘高度
    showEmoji:false,//表情包状态
    animationData:'',//动画实例

  },

  /**
   * 点击预览照片
   * @param {*} e 
   */
  clickAmplify:function(e){
    var index = e.currentTarget.dataset.index;
    var images = this.data.trend.images;
    var imgUrl = this.data.trend.images[index];
    wx.previewImage({
      urls: images, //需要预览的图片http链接列表，注意是数组
      current: imgUrl, // 当前显示图片的http链接，默认是第一个
      success: function (res) { },
      fail: function (res) { },
      complete: function (res) { },
    })
  },


  /**
   * 点击显示底部弹出框
   **/
  clickOperator: function () {
    this.showModal();
  },


  /**
   * 点击隐藏底部弹出框
   */
  clickHideOper:function(){
    this.hideModal();
  },
  
  /**
   * 显示操作框
   **/
  showModal: function () {
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
   * 隐藏操作框
   */
  hideModal: function () {
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
   * 点击删除
   */
  clickDelete:function(){
    var that = this;
    wx.showModal({
      title: '提示',
      content: '确定删除这条记录吗？',
      success: function(res) {
        if (res.confirm) {
          postParamsRequest("/trend/remove",{trendId:that.data.trend.trendId})
          .then((value) =>{
            const {code,msg}= value;
            if(code == 200 ){
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
   * 聚焦
   * @param {*} e 
   */
  bindReply: function (e) {
    this.setData({
      releaseFocus: true,
      placeholder:'说点什么，关爱一下',
    })
    
  }, 



    /**
    * 回复人身份
    * @param {*} e 
    */
  clickResponse:function(e){
    this.setData({
      discuss:{
        content:''
      }
    })
    var trend = this.data.trend;
    var discuss = e.detail;
    var user = wx.getStorageSync('user');
    this.setData({
       placeholder:'回复 '+ discuss.identity,
       releaseFocus:true,
       'discuss.userId':user.userId,
       'discuss.trendId':trend.trendId,
       'discuss.parentId':discuss.discussId,
       'discuss.repUserId':discuss.userId,
       'discuss.repIdentity':discuss.identity
    })
  },


   /**
   * 选择表情包（判断是在文字中间插入表情包还是在文字后面插入表情包）
   */
  clickChooseEmoji:function(e){
    var emoji = e.detail;
    var cont = this.data.discuss.content;//评论内容
    var cursor = this.data.cursor;//光标位置
    if(cont.length>0){
      var prevStr = cont.substr(0,cursor);
      var nextStr = cont.substr(cursor);
      this.setData({
        'discuss.content':prevStr+emoji.emoji+nextStr,
      })
    }else{
      this.setData({
        'discuss.content':cont+emoji.emoji,
      })
    }
    this.setData({
      cursor:cursor+emoji.emoji.length
    })
  },

  /**
   * 失去焦点时获取光标位置
   * @param {*} e 
   */
  bindCursorChange:function(e){
    this.setData({
      cursor:e.detail.cursor
    })
  },


   /**
    * 回复输入框
    */
  responseInput:function(e){
    var val = e.detail.value;
    if(val != ''){
      this.setData({
        'discuss.content':val
      })
    }
  },


   /**
    * 点击保存评论
    */
  clickSaveDiscuss:function(e){
    if(this.data.discuss.content == '' || this.data.discuss.content == null){
      wx.showToast({
        title: '评论内容为空',
        icon:'none'
      })
      return
    }
    if(this.data.discuss.userId == undefined || this.data.discuss.userId == null){
      var trend = this.data.trend;
      var user = wx.getStorageSync('user');
      this.setData({
        'discuss.userId':user.userId,
        'discuss.trendId':trend.trendId,
      })
    }
    var baby = wx.getStorageSync('baby');
    postRequest("/discuss/save",
    {
      discuss:this.data.discuss,
      babyId:baby.babyId
    })
    .then((value) =>{
      const {code,data,msg} = value;
      if(code == 200){
        var trend = this.data.trend;
        trend.discusses.push(data);
        this.setData({
          trend:trend,
          'discuss.content':''
        })
        this.setData({
          showEmoji:false,
          keywordHeight:0
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
   * 删除评论后刷新页面
   * @param {*} e 
   */
  async flushTree(e){
    if(e.detail){
      var curr = getCurrentPages();
      var prve = curr[curr.length-1];
      var last = curr[curr.length-2];
      if(last != undefined && last != null){
        await last.onLoad();
      }
      setTimeout(()=>{
        prve.onLoad();
      },200)
      
    }
    
  },


  /**
   * 点击显示表情包
   */
  clickShowEmoji:function(e){
    var window = wx.getWindowInfo();
    var height = window.windowHeight - window.safeArea.top;
    this.setData({
      keywordHeight:height
    })
    if(this.data.showEmoji){
      this.setData({
        releaseFocus:true,
        showEmoji:false,
      })
    }else{
      wx.hideKeyboard();
      this.setData({
        showEmoji:true
      })
    }
  },


  /**
   * 隐藏表情包页面
   */
  hideEmoji:function(){
    this.setData({
      showEmoji:false,
      keywordHeight:0
    })
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    if(options != undefined){
      this.setData({
        trendId:options.trendId
      })
    }
    if(this.data.trendId != null){
      postParamsRequest("/trend/gettrendByIndex",{trendId:this.data.trendId})
      .then((value) =>{
        const {data} = value;
        var baby = wx.getStorageSync('baby');
        if(baby != null && baby.babyBirth != null){//获取宝宝年龄
          data.age = getAge(baby.babyBirth,data.uploadTime);
        }else{
          data.age = '';
        }
         //对图片做处理
         if(data.trendPhoto != null){
          var images = data.trendPhoto;
          var imgs = images.split(",");
          data.images = imgs; 
          data.height = 300 * wx.getWindowInfo().pixelRatio;;
          data.width = '100%';
        }
         //对视频做处理
         if(data.trendVideo != null){
          var images = data.trendVideo;
          var imgs = images.split(",");
          data.trendVideo = imgs[0];
          data.coverImage = imgs[1];
          data.height = 300 * wx.getWindowInfo().pixelRatio;;
          data.width = '100%';
        }
        this.setData({
          trend:data,
          tags:data.tags
        })
      })
    }

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
    this.onLoad();//刷新页面
    //监听键盘是否弹起
    wx.onKeyboardHeightChange(res =>{
      if(!this.data.showEmoji){//切换表情包时，表情包弹窗高度等于键盘弹起高度
        if(res.height>0){
          var window = wx.getWindowInfo();
          var height = window.windowHeight - window.safeArea.top;
          this.setData({
            keywordHeight:height
          })
        }else{
          this.setData({
            keywordHeight:0
          })
        }
      }
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
    var curr = getCurrentPages();
    var prve = curr[curr.length-2];
    if(prve != undefined && prve != null){
      prve.onLoad();
    }
     
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