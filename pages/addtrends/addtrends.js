const { postRequest, postParamsRequest } = require("../../utils/request");
const { formatDate } = require("../../utils/util");

// pages/addtrends/addtrends.js
Page({
  /**
   * 页面的初始数据
   */
  data: {
    array:[],//权限
    index:0,//权限下标
    trend:{
      userId:'',
      username:'',
      content:null,
      trendPhoto:null,
      trendVideo:null,
      level:'',
      uploadTime:'',
    },//动态
    images:[],//图片集合
    tags:[],//标签集合
    uploadVedio:true,//是否显示增加视频的图标
    uploadImg:true,//是否显示增加图片的图标
    uploadCount:0,//上传视频的数量
    tagCount:0,//标签数量
    showTag:true,//是否显示增加标签的图标
    type:null,//上传媒体的类型：图片，视频
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
          html: that.data.trend.content,
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
      'trend.content':cont
    })
  },
  /**
   * 上传视频（只能上传一个）
   */
  handleInsertVedio:function(){
    let that = this;
    const images = that.data.images;
    wx.chooseMedia({
      count: 1,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      mediaType:['video'],
      async success(res) {
        const {type,tempFiles} = res;
        that.setData({
          type:type
        })
        var file = tempFiles[0].tempFilePath;//视频
        var thumbFile = tempFiles[0].thumbTempFilePath; //封面图
        var suffix1 = file.substr(file.indexOf("."));//视频后缀名
        var suffix2 = thumbFile.substr(thumbFile.indexOf("."));//封面图后缀名
        var media1 = await that.uploadVideo(suffix1,file);//上传视频到云端
        var media2 =await that.uploadVideo(suffix2,thumbFile);//上传封面图到云端
        images.push(media1);
        images.push(media2);
        that.setData({
          images:images,
          uploadVedio:false,
          uploadImg:false
        });  
      },
    })
  },
  /**
   * 上传多张图片（最多可上传九张）
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
          const {type,tempFiles} = res;
          that.setData({
            type:type
          })
          for(var i=0;i<tempFiles.length;i++){
            var file = tempFiles[i].tempFilePath;
            var suffix = file.substr(file.indexOf("."));
            var media = await that.uploadVideo(suffix,file);
            images.push(media);
          }
          if(images.length>=9){
            that.setData({
              uploadImg:false
            })
          }
          that.setData({
            images:images,
            uploadVedio:false,
            uploadCount:images.length
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
          if (res.statusCode === 204) {
            //200: 服务端业务处理正常结束
            resolve(res.fileID)
          } else {
            reject(res)
          }
        }
      })
      // //上传进度
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
   * 点击图片放大预览
   * @param {*} e 
   */
  clickImage:function(e){
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
          if(that.uploadCount <=0){
            that.setData({
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
      'trend.level':parseInt(e.detail.value)
    })
  },
  /**
   * 时间选择器
   */
  bindTimeChange:function(e){
    this.setData({
      'trend.uploadTime':formatDate(e.detail.value)
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
   * 保存动态
   */
  handleSaveTrends:function(){
    //处理图片集合（视频集合）
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
      if(this.data.type == 'image'){
        this.setData({
          'trend.trendPhoto':imgUrl
        })
      }else if(this.data.type == 'video'){
        this.setData({
          'trend.trendVideo':imgUrl
        })
      }
    }
    if(this.data.trend.content == '' && this.data.trend.trendPhoto == '' && this.data.trend.trendVideo == ''){
      wx.showToast({
        title: '你还没输入任何内容',
        icon:'none'
      })
    }else{
      var baby = wx.getStorageSync('baby');
      if(baby != null){
        this.setData({
          'trend.babyId':baby.babyId
        })
      }
      postRequest('/trend/save',
      {
        trend:this.data.trend,
        tags:this.data.tags
      })
      .then((value) =>{
        const{code,msg} = value;
        if(code == 200){
          var curr = getCurrentPages();
          //判断是从index页面添加动态的还是从bigevent页面添加动态的
          if(curr.length>0){
            for(var i=0;i<curr.length;i++){
              if(curr[i].route.indexOf('bigevent') != -1){
                //返回大事记页面
                wx.navigateBack({
                  delta:i
                })
                return
              }
            }
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
          }
        
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
  async onLoad(options) {
    var images = '';
    //判断是否先选择了图片或视频
    if(options.type != undefined && options.type != null){
      images = JSON.parse(options.images);
      this.setData({
        type:options.type
      })
    }
    if(images != null && images != ''){
      var imgs = [];
      var media = '';
      for(var i=0;i<images.length;i++){
        media = await this.uploadVideo(images[i].suffix,images[i].media);
        imgs.push(media);
        media +=media;
      }
      //上传的视频
      if(options.type == 'video'){
        this.setData({
          images:imgs,
          'trend.trendVideo':media,
          uploadImg:false,
          uploadVedio:false,
        })  
      }else if(options.type == 'image'){//上传的照片
        this.setData({
          images:imgs,
          uploadVedio:false,
          uploadCount:imgs.length
        })
        if(imgs.length>=9){
          this.setData({
            uploadImg:'none',
          })
        }
      }  
    }
    //判断是否先选择了标签
    if(options.tag != null && options.tag != undefined){
      var tags = this.data.tags;
      if(tags == null){
        tags = [];
      }
      tags.push(JSON.parse(options.tag));
      this.setData({
        tags:tags,
        tagCount:tags.length,
      })
    }
    var user = wx.getStorageSync('user');
    this.setData({
      'trend.userId':user.userId,
      'trend.username':user.username,
      'trend.uploadTime':formatDate(new Date()),
      'trend.level':this.data.index
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