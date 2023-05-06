const { postRequest,postParamsRequest } = require("../../utils/request");

// pages/comment/comment.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    placeholder:'我也说一句',//textarea的placeholder
    // trendId:null,//动态id
    comment:{
      content:''
    },//评论对象
    cursor:0,//输入框光标位置
    releaseFocus:true,//textarea焦点
    showEmoji:false,//表情包页面的状态
    keywordHeight:0,//键盘高度
  },


  /**
   * 显示表情包
   */
  clickShowEmoji:function(){
    var window = wx.getWindowInfo();
    //表情包的高度
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
        showEmoji:true,
      })
    }

  },


  /**
   * 隐藏表情包
   */
  hideEmoji:function(){
    this.setData({
      showEmoji:false,
      releaseFocus:true,
    })
  },


  /**
   * 选择表情包（判断是在文字中间插入表情包还是在文字后面插入表情包）
   */
  clickChooseEmoji:function(e){
    var emoji = e.detail;
    var cont = this.data.comment.content;//评论内容
    var cursor = this.data.cursor;//光标位置
    if(cont.length>0){
      var prevStr = cont.substr(0,cursor);
      var nextStr = cont.substr(cursor);
      this.setData({
        'comment.content':prevStr+emoji.emoji+nextStr,
      })
      // console.log("光标前半部分："+prevStr+"，光标后半部分："+nextStr)
    }else{
      this.setData({
        'comment.content':cont+emoji.emoji,
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
   * 评论内容
   * @param {*} e 
   */
  onCommentInput:function(e){
    var val = e.detail.value;
    if(val != ''){
      this.setData({
        'comment.content':val
      })
    }
  },


  /**
   * 评论图片
   * @param {*} e 
   */
  clickMedia:function(e){
    var that = this;
    wx.chooseMedia({
      count: 1,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      mediaType:['image'],
      async success(res) {
        // console.log("成功",res);
        const {tempFiles} = res;
        var file = tempFiles[0].tempFilePath;//图片url
        var suffix = file.substr(file.indexOf("."));//图片后缀名
        var image = await that.uploadImage(suffix,file);
        that.setData({
          'comment.media':image
        })
        postRequest("/comment/save",that.data.comment)
        .then((value) =>{
          const {code,msg} = value;
          if(code == 200){
            //返回上一个页面
            wx.navigateBack({
              delta: 1,
            })
          }else{
            wx.showToast({
              title: msg,
              icon:'error'
            })
          }
        })
      },
     })
  },


  /**
   * 上传到云服务器
   * @param {*} suffix 
   * @param {*} fileURL 
   */
  uploadImage:function(suffix,fileURL){
    return new Promise((resolve, reject) => {
      wx.cloud.uploadFile({
        cloudPath:new Date().getTime()+suffix, // 上传至云端的路径
        filePath: fileURL, // 小程序临时文件路径
        success:res =>{
          if (res.statusCode === 204) {
            //200: 服务端业务处理正常结束
            resolve(res.fileID)
          } else {
            reject(res)
          }
        }
      })
    })
  },


  /**
   * 保存评论
   */
  saveComment:function(){
    if(this.data.comment.content == '' || this.data.comment.content == null){
      wx.showToast({
        title: '评论内容为空',
        icon:'none'
      })
    }else{
      postRequest("/comment/save",this.data.comment)
      .then((value) =>{
        const {code,msg} = value;
        if(code == 200){
          //返回上一个页面
          wx.navigateBack({
            delta: 1,
          })
        }else{
          wx.showToast({
            title: msg,
            icon:'error'
          })
        }
      })
    }
    
  },




  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    var user = wx.getStorageSync('user');
    if(options != null){
      this.setData({
        'comment.trendId':options.trendId,
        'comment.userId':user.userId,
        'comment.username':user.username,
        'comment.userPhoto':user.userPhoto,
      })
    }
    if(options.comment != undefined){
      var comment = JSON.parse(decodeURIComponent(options.comment));
      this.setData({
        placeholder:'回复 ' + comment.username,
        'comment.parentId':comment.commentId
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
    wx.onKeyboardHeightChange(res =>{
      if(res.height==0){
        if(!this.data.showEmoji){
          this.setData({
            keywordHeight:0
          })
        }
      }else if(res.height>0){
        var window = wx.getWindowInfo();
        this.setData({
          keywordHeight:window.windowHeight - window.safeArea.top
        })
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
    var page = getCurrentPages();
    var beforePage = page[page.length-2];
    if(beforePage != null && beforePage != undefined){
      beforePage.hideComtModal();
    }

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