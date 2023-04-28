// pages/edittrend/edittrend.js
const { postRequest,postParamsRequest } = require("../../utils/request");
const { formatDate } = require("../../utils/util");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    array:[],//权限
    index:0,//权限下标
    trend:{},//动态信息
    tags:[],//标签集合
    images:[],//图片集合
    uploadVedio:true,//是否显示增加视频图标
    uploadImg:true,//是否显示增加图片图标
    uploadCount:0,//上传图片数量
    tagCount:0,//标签数量
    showTag:true,//是否显示增加标签图标
    trendPer:{
      trendId:'',
      userId:'',
      babyId:'',
      username:'',
      content:null,
      trendPhoto:null,
      trendVideo:null,
      level:'',
      uploadTime:'',
    },//修改后的动态信息

  },


  /**
   * 初始化编辑器
   */
  onEditorReady(){
    let that = this
    // 修改时，反显数据
    this.createSelectorQuery().select("#editor")
      .context((res) => {
        res.context.setContents({
          html: that.data.trend.trendContent,
        });
      })
      .exec();
  },

  
  /**
   * 内容输入框
   * @param {*} e 
   */
  changeContent(e){
    var cont = e.detail.html;
    this.setData({
      'trend.trendContent':cont,
      'trendPer.content':cont
    })
  },


  /**
   * 点击图片放大预览
   * @param {*} e 
   */
  clickImage:function(e){
    // console.log(e);
    var index = e.currentTarget.dataset.index;
    var images = this.data.images;
    var imgUrl = images[index];
    wx.previewImage({
      urls: images, //需要预览的图片http链接列表，注意是数组
      current: imgUrl, // 当前显示图片的http链接，默认是第一个
      success: function (res) { },
      fail: function (res) { },
      complete: function (res) { },
    })
  
  },

  /**
   * 长按删除视频
   * @param {*} e 
   */
  deleteVideo:function(e){
    let that = this;
    wx.showModal({
      title: '提示',
      content: '确定要删除此视频吗？',
      success: function(res) {
        if (res.confirm) {
          that.setData({
            images:[],
            'trend.trendVideo':null,
            'trendPer.trendVideo':null,
            uploadVedio:true,
            uploadImg:true
          })
        } else if (res.cancel) {
          return false;
        }
      }
    })
  },


  /**
   * 长按图片删除
   * @param {*} e 
   */
  deleteImage:function(e){
    let that = this;
    var index = e.currentTarget.dataset.index;
    wx.showModal({
      title: '提示',
      content: '确定要删除此图片吗？',
      success: function(res) {
        if (res.confirm) {
          var images = that.data.images;
          images.splice(index,1);
          that.setData({
            images:images,
            uploadCount:that.data.uploadCount -1,
            uploadImg:true
          })
          if(that.data.uploadCount <=0){
            that.setData({
              'trend.trendPhoto':null,
              'trendPer.trendPhoto':null,
              uploadVedio:true
            })
          }
        } else if (res.cancel) {
          return false;
        }
      }
    })
  },

  /**
   * 添加标签
   */
  handleInsertTags:function(){
    wx.navigateTo({
      url: '../tags/tags',
    })
  },


/**
   * 删除标签
   * @param {*} e 
   */
  deleteTags:function(e){
    var index = e.currentTarget.dataset.index;
    var tags = this.data.tags;
    tags.splice(index,1);
    this.setData({
      tags:tags,
      tagCount:this.data.tagCount - 1
    });
    //判断标签数量是否小于3个，小于3个显示增加标签的标志
    var count = this.data.tagCount;
    if(count<3){
      this.setData({
        showTag:true
      })
    }
  },

   /**
   * 权限选择器
   * @param {*} e 
   */
  bindPickerChange:function(e){
    this.setData({
      index:e.detail.value,
      'trend.level':parseInt(e.detail.value),
      'trendPer.level':parseInt(e.detail.value)
    })
  },

  /**
   * 时间选择器
   */
  bindTimeChange:function(e){
    this.setData({
      'trend.uploadTime':formatDate(e.detail.value),
      'trendPer.uploadTime':formatDate(e.detail.value)
    })
  },


   /**
   * 取消上传动态
   */
  handleExitTrends:function(){
    wx.navigateBack({
      delta: 1,
    })
  },


   /**
   * 上传视频
   */
  handleInsertVedio:function(){
    let that = this;
    wx.chooseMedia({
      count: 1,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      mediaType:['video'],
      async success(res) {
        // console.log("成功",res);
        const {tempFiles} = res;
        var file = tempFiles[0].tempFilePath;//视频
        var thumbFile = tempFiles[0].thumbTempFilePath; //封面图
        var suffix1 = file.substr(file.indexOf("."));//视频后缀名
        var suffix2 = thumbFile.substr(thumbFile.indexOf("."));//封面图后缀名
        var media1 = await that.uploadVideo(suffix1,file);//上传视频到云端
        var media2 =await that.uploadVideo(suffix2,thumbFile);//上传封面图到云端
        that.setData({
          'trend.trendVideo':media1,
          'trendPer.trendVideo':media1+","+media2,
          uploadVedio:false,
          uploadImg:false
        });
       
      },
    })
  },

  /**
   * 上传多张图片
   */
  handleInsertImage:function(){
      let that = this;
      const images = that.data.images;
      wx.chooseMedia({
        count: 9-images.length,
        sizeType: ['original', 'compressed'],
        sourceType: ['album', 'camera'],
        mediaType:['image'],
        async success( res) {
          // console.log(res);
          const {tempFiles} = res;
          var media = '';
          for(var i=0;i<tempFiles.length;i++){
            var file = tempFiles[i].tempFilePath;
            var suffix = file.substr(file.indexOf("."));
            media = await that.uploadVideo(suffix,file);
            images.push(media);
          }
          if(images.length>=9){
            that.setData({
              uploadImg:false
            })
          }
          that.setData({
            images:images,
            'trend.trendPhoto':media,
            uploadCount:images.length,
            uploadVedio:false,
          })
        },
        fail:err =>{
          console.log(err);
        }
      })
  },

   /**
   * 上传到云端
   * @param {*} fileURL 
   */
  uploadVideo:function(suffix,fileURL){
    return new Promise((resolve, reject) => {
      const uploadTask = wx.cloud.uploadFile({
        cloudPath:new Date().getTime()+suffix, // 上传至云端的路径
        filePath: fileURL, // 小程序临时文件路径
        success: res => {
          // console.log("上传成功",res);
          if (res.statusCode === 204) {
            //200: 服务端业务处理正常结束
            resolve(res.fileID)
          } else {
            reject(res)
          }
        }
      })
       //上传进度
      uploadTask.onProgressUpdate((res) => {
        if(res.progress <100){
          wx.showLoading({
            mask: true,
            title: '已上传：' + res.progress,
          })
        }else{
          wx.hideLoading();
        }
      })
    })
  },


  /**
   * 保存动态
   */
  handleSaveTrends:function(){
    //处理图片
    var images = this.data.images;
    var imgUrl = '';
    if(images.length>0){
      for(var i=0;i<images.length;i++){
        if(i == images.length-1){
          imgUrl +=images[i];
        }else{
          imgUrl +=images[i]+",";
        } 
      }
      this.setData({
        'trendPer.trendPhoto':imgUrl
      })
    }
    postRequest('/trend/update',
    {
      trend:this.data.trendPer,
      tags:this.data.tags
    })
    .then((value) =>{
      const{code,msg} = value;
      if(code == 200){
        wx.navigateBack({
          delta:1,
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
    var trend = JSON.parse(decodeURIComponent(options.trend));
    var images = [];
    if(trend.trendPhoto != null){
      images = trend.trendPhoto.split(",");
      if(images.length>=9){
        this.setData({
          uploadImg:false
        })
      }
      this.setData({
        uploadCount:images.length,
        uploadVedio:false,
      })
    }else if(trend.trendVideo != null){
      this.setData({
        uploadImg:false,
        uploadVedio:false,
        'trendPer.trendVideo':trend.trendVideo + "," + trend.coverImage,
      })
    }
    var tags = trend.tags;
    if(tags.length>0){
      for(var i=0;i<tags.length;i++){
        if(tags[i].content.length<=3){
          tags[i].width = tags[i].content.length * 11 + '%';
        }else{
          tags[i].width = tags[i].content.length * 7 + '%';
        }
        
      }
    }
    this.setData({
      trend:trend,
      images:images,
      tags:trend.tags,
      index:trend.level,
      'trendPer.trendId':trend.trendId,
      'trendPer.userId':trend.userId,
      'trendPer.username':trend.username,
      'trendPer.babyId':trend.babyId,
      'trendPer.content':trend.trendContent,
      'trendPer.level':trend.level,
      'trendPer.trendPhoto':trend.trendPhoto,
      'trendPer.uploadTime':trend.uploadTime
    })

    //获取权限（所有人或仅自己）
    postParamsRequest("/trend/getlevel")
    .then((value) =>{
      const {data} = value;
      this.setData({
        array:data
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
     // 获取当前页面
    const pages = getCurrentPages();
     // 获取上一级页面
    const beforePage = pages[pages.length - 2];
    if(beforePage != undefined && beforePage != null){
      beforePage.hideModal();//隐藏操作框
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