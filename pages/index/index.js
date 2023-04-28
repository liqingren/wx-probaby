// pages/baby/baby.js
import { postParamsRequest, postRequest } from '../../utils/request';
import {getAge} from '../../utils/util'


Page({

  /**
   * 页面的初始数据
   */
  data: {
    baby:{},//宝宝对象
    age:null,//年龄
    showBaby:false,//显示宝宝界面
    trends:[],//所有动态
    trendList1:[],//显示半年内的动态集合
    _index:null,
    discuss:{
      content:''
    },//增加评论
    responseFocus:false,//回复焦点
    show:false,//是否显示剩下的内容
    relativeCount:'',//亲友数量
    showEmoji:false,//表情包页面的显示与隐藏
    keywordHeight:0,//键盘高度
    inputValue:'',//textarea输入框内容
    placeholder:'说点什么，关爱一下',//评论输入框的placeholder
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
        //当目标节点和参照区域相交时，intersectionRatio大于0
        this.setData({
          _index: index
        })
      }else {
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
   * 跳转到宝宝信息界面
   */
  handleBabyInfo:function(){
    var babyId = this.data.baby.babyId;
    wx.navigateTo({
      url: '../babyinfo/babyinfo?babyId='+babyId,
    })
  },

  /**
   * 上传头像
   */
  handleAvator:function(){
    let that = this;
    wx.chooseMedia({
     count: 1,
     sizeType: ['original', 'compressed'],
     sourceType: ['album', 'camera'],
     mediaType:['image'],
     success(res) {
       that.uploadImage(res.tempFiles[0].tempFilePath);
     },
    })
   },
 
   /**
    * 上传图片到云服务器
    * @param {*} fileURL 
    */
  uploadImage(fileURL) {
     wx.cloud.uploadFile({
       cloudPath:new Date().getTime()+'.png', // 上传至云端的路径
       filePath: fileURL, // 小程序临时文件路径
       success: res => {
         // 返回文件 ID
        //  console.log("上传成功",res)
         //获取文件路径
         this.setData({
           'baby.babyPhoto':res.fileID
         })
         postRequest('/baby/update',this.data.baby)
         .then((value) =>{
            const {code,data,msg} = value;
            // console.log(value);
            if(code == 200){
              wx.removeStorageSync('baby');
              wx.setStorageSync('baby', data);
              this.onLoad();
            }else{
              wx.showToast({
                title: msg,
                icon:'error'
              })
            }
         })
       },
       fail:err =>{
         console.log(err);
       }
     })
   },

   
   /**
    * 上传照片或视频（可一次性上传多个）
    */
  handleMedia(){
     wx.chooseMedia({
      count: 9,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success(res) {
        const {tempFiles,type} = res;
        const images = [];
        if(type == 'video'){//上传视频
          var file = tempFiles[0].tempFilePath;
          var thumbFile = tempFiles[0].thumbTempFilePath; 
          var suffix1 = file.substr(file.indexOf("."));
          var suffix2 = thumbFile.substr(thumbFile.indexOf("."));
          var img1 = {
            suffix:suffix1,//文件后缀名
            media:tempFiles[0].tempFilePath //视频
          }
          var img2 = {
            suffix:suffix2,//文件后缀名
            media:tempFiles[0].thumbTempFilePath //封面图
          }
          images.push(img1);
          images.push(img2);
        }else if(type == 'image'){//上传照片（可多张）
          for(var i=0;i<tempFiles.length;i++){
            var file = tempFiles[i].tempFilePath;
            var suffix = file.substr(file.indexOf("."));
            var img = {
              suffix:suffix,//照片后缀名
              media:tempFiles[i].tempFilePath//照片
            }
            images.push(img);
          }
        }
        wx.navigateTo({
          url: '../addtrends/addtrends?images='+JSON.stringify(images)+ '&type='+type,
        })
      },
    })
  },

  /**
   * 跳转增加动态页面
   */
  handleInsertTrends:function(){
    wx.navigateTo({
      url: '../addtrends/addtrends',
    })
  },



   /**
    * 跳转到动态详情页面
    */
   handleTrends:function(e){
     var trendId = e.currentTarget.dataset.trendid;
     wx.navigateTo({
       url: '../trends/trends?trendId='+trendId,
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
    * 点击弹出评论,再次点击隐藏
    * @param {*} e 
    */
  onCommentTrend:function(e){
    this.setData({
      responseFocus:!this.data.responseFocus,
      
    })
    if(this.data.responseFocus){//显示评论框
      wx.hideTabBar();//隐藏tabBar
      var index = e.currentTarget.dataset.index;
      var trend = this.data.trends[index];
      var user = wx.getStorageSync('user');
      this.setData({
        discuss:{
          content:''
        },
        inputValue:'',
        showEmoji:false,
        'discuss.userId':user.userId,
        'discuss.trendId':trend.trendId
      })
    }else{//隐藏评论框
      wx.showTabBar();//显示tabBar
    }
  },

  


   /**
    * 回复人身份
    * @param {*} e 
    */
  clickResponse:function(e){
    this.setData({
      discuss:{
        content:''
      },
      inputValue:''
    })
    var index = e.currentTarget.dataset.index;
    var trend = this.data.trends[index];
    var discuss = e.detail;
    var user = wx.getStorageSync('user');
    this.setData({
      placeholder:'回复 '+discuss.identity,
      responseFocus:true,
      'discuss.userId':user.userId,
      'discuss.trendId':trend.trendId,
      'discuss.parentId':discuss.discussId,
      'discuss.repUserId':discuss.userId,
      'discuss.repIdentity':discuss.identity
    })
  },


   /**
    * 回复输入框
    */
  responseInput:function(e){
    if(e.detail.value != ''){
      this.setData({
        'discuss.content':e.detail.value,
        inputValue:e.detail.value
      })
    }
  },

  /**
   * 保存回复
   * @param {*} e 
   */
  saveResponse:function(){
    if(this.data.discuss.content == '' || this.data.discuss.content == null){
      wx.showToast({
        title: '评论内容为空',
        icon:'none'
      })
      return
    }
    var baby = wx.getStorageSync('baby')
     //保存评论
    postRequest("/discuss/save",{
      discuss:this.data.discuss,
      babyId:baby.babyId
    }).then((value) =>{
      const {code,msg} = value;
      if(code == 200){
        this.onLoad();
        this.setData({
          responseFocus:false,
          showEmoji:false,
          inputValue:'',
          keywordHeight:0
        })
        wx.showTabBar();//显示tabBar导航
      }else{
        wx.showToast({
          title: msg,
          icon:'error'
        })
      }
    })
   },


   
  /**
   * 聚焦
   * @param {*} e 
   */
  readyFocus:function(){
    this.setData({
      responseFocus:true,
      showEmoji:false,
    })
  },


  /**
   * 隐藏评论框
   */
  hideKeyword:function(){
    this.setData({
      responseFocus:false,
      showEmoji:false,
    })
    wx.showTabBar();
  },

  /**
   * 点击显示表情包
   */
  clickShowEmoji:function(e){
    var window = wx.getWindowInfo();
    var height = window.windowHeight - window.safeArea.top;
    this.setData({
      showEmoji:true,
      keywordHeight:height
    })
    if(this.data.showEmoji){
      wx.hideTabBar();
    }else{
      this.setData({
        keywordHeight:0
      })
    }
    
  },

  /**
   * 隐藏表情包页面
   */
  hideEmoji:function(){
    this.setData({
      showEmoji:false,
      responseFocus:false,
      keywordHeight:0,
    })
    wx.showTabBar();
  },

  /**
   * 选择表情包
   * @param {*} e 
   */
  clickChooseEmoji:function(e){
    var cont = this.data.discuss.content;
    this.setData({
      'discuss.content':cont+e.detail.emoji,
      inputValue:cont+e.detail.emoji,
    })
  },


   /**
   * 点击展开剩余内容
   */
  clickDevelop:function(){
    this.setData({
      show:true
    })
  },

  /**
   * 收起剩余内容
   */
  clickPackup:function(){
    this.setData({
      show:false
    })
  },


  /**
   * 显示主页
   * @param {*} e 
   */
  clickShowIndex:function(e){
    this.setData({
      showBaby:e.detail
    })
    this.onLoad();//刷新
  },

  /**
   * 显示宝宝界面
   */
  clickShowBaby:function(){
    this.setData({
      showBaby:false
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  async onLoad(options) {
    //获取token
    let token = wx.getStorageSync('token');
    //根据token是否为空，来判断用户是否登录过
    if(token === '' || token === null){
      wx.redirectTo({
        url: '../login/login',
      })
    }else{
      //获取宝宝信息
      let baby = wx.getStorageSync('baby');
      //如果没有宝宝，则跳转到选择宝宝页面
      if(baby != null && baby != ''){
        this.setData({
          showBaby:true
        })
        let age = null;
        if(baby.babyBirth != null){
          age = getAge(baby.babyBirth,new Date());
        }
        this.setData({
          baby:baby,
          age:age
        })
      }else{
        this.setData({
          showBaby:false
        })
      }
      if(baby.babyId != null && baby.babyId != '' && baby.babyId != undefined){
        //获取用户自己的动态
        var user = wx.getStorageSync('user');
        await postParamsRequest("/trend/listtrend",{
          babyId:baby.babyId,
          userId:user.userId
        })
        .then((value) =>{
          const map = value.data;
          const data = map.trend;
          this.setData({
              relativeCount:map.count
          })
          var count = 0;
          for(var i=0;i<data.length;i++){
            //计算宝宝年龄
            if(baby.babyBirth != null){
              data[i].age = getAge(baby.babyBirth,data[i].uploadTime);
            }
            //对图片做处理
            if(data[i].trendPhoto != null){
              var images = data[i].trendPhoto;
              var imgs = images.split(",");
              data[i].images = imgs; 
              //高度处理
              if(data[i].images.length ==2 || data[i].images.length ==4){
                data[i].height = 100 * wx.getWindowInfo().pixelRatio;
                data[i].width = '49%';
                
              }else if(data[i].images.length>=3){
                data[i].height = 80 * wx.getWindowInfo().pixelRatio;;
                data[i].width = '32%'
              }else{
                data[i].height = 240 * wx.getWindowInfo().pixelRatio;;
                data[i].width = '105%';
              }
            }
            //对视频做处理
            if(data[i].trendVideo != null){
              var images = data[i].trendVideo;
              var imgs = images.split(",");
              data[i].trendVideo = imgs[0];
              data[i].coverImage = imgs[1];
              data[i].height = 240 * wx.getWindowInfo().pixelRatio;;
              data[i].width = '100%';
            }

            //判断动态的上传日期是否在半年以内
            if(Date.parse(data[i].uploadTime) >= Date.parse(this.getHalfYear())){
              count ++;
            }
          }
          this.setData({
            trends:data //全部动态
          })
          var list = '';//集合
          if(data.length>50){
            list = data.slice(0,50);//如果动态数据大于50条,则只显示前50条，点击展开显示全部
          }else{
            list = data.slice(0,count);//如果动态数据小于等于50条，则按上传时间判断是否超过半年，默认显示半年内的动态，点击展开显示全部
          }
          this.setData({
            trendList1:list
          })
        })
      }
    }
   
  },




  /**
   * 获取半年前的时间
   */
  getHalfYear(){
    // 获取半年前时间
    let curDate = (new Date()).getTime();
    // 将半年的时间单位换算成毫秒
    let halfYear = 365 / 2 * 24 * 3600 * 1000;
    let pastResult = curDate - halfYear; // 半年前的时间（毫秒单位）
  
    // 日期函数，定义起点为半年前
    let pastDate = new Date(pastResult),
    pastYear = pastDate.getFullYear(),
    pastMonth = pastDate.getMonth() + 1,
    pastDay = pastDate.getDate();
  
    return pastYear + '-' + pastMonth + '-' + pastDay;
  
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
     //监听键盘是否弹起
    wx.onKeyboardHeightChange(res =>{
      if(!this.data.showEmoji){//切换表情包时，表情包弹窗高度等于键盘弹起高度
        if(res.height>0){
          var window = wx.getWindowInfo();
          //底部tabBar高度
          var tabBarHeight = window.screenHeight - window.statusBarHeight - window.windowHeight - 42;
          this.setData({
            keywordHeight:(res.height - tabBarHeight) * 750 / wx.getWindowInfo().windowWidth
          })
        }else{
          wx.showTabBar()
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