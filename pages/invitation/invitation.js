const { postRequest } = require("../../utils/request");

// pages/invitation/invitation.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    baby:{},//宝宝信息
    relativeArr:[//亲友关系
      {
        index:0,
        val:"姥姥",
        checked:false
      },
      {
        index:1,
        val:"外婆",
        checked:false
      },
      {
        index:2,
        val:"奶奶",
        checked:false
      },
      {
        index:3,
        val:"外公",
        checked:false
      },
      {
        index:4,
        val:"姥爷",
        checked:false
      },
      {
        index:5,
        val:"爷爷",
        checked:false
      },
      {
        index:6,
        val:"阿姨",
        checked:false
      },
      {
        index:7,
        val:"小姨",
        checked:false
      },
      {
        index:8,
        val:"姨妈",
        checked:false
      },
      {
        index:9,
        val:"姑姑",
        checked:false
      },
      {
        index:10,
        val:"姑妈",
        checked:false
      },
      {
        index:11,
        val:"干妈",
        checked:false
      },{
        index:12,
        val:"舅妈",
        checked:false
      },
      {
        index:13,
        val:"婶婶",
        checked:false
      },
      {
        index:14,
        val:"伯母",
        checked:false
      },
      {
        index:15,
        val:"舅舅",
        checked:false
      },
      {
        index:16,
        val:"叔叔",
        checked:false
      },
      {
        index:17,
        val:"伯父",
        checked:false
      },
      {
        index:18,
        val:"姑父",
        checked:false
      },
      {
        index:19,
        val:"姨父",
        checked:false
      },
      {
        index:20,
        val:"干爸爸",
        checked:false
      },
      {
        index:21,
        val:"姐姐",
        checked:false
      },
      {
        index:22,
        val:"哥哥",
        checked:false
      },
      {
        index:23,
        val:"其他",
        checked:false
      },
      
    ],
    index:null,//下标
    identity:{
      babyId:'',
      userId:'',
      identity:'',
    }//亲友身份对象
  },


  /**
   * 选择关系
   * @param {*} e 
   */
  selectRealtive:function(e){
    let that = this;
    // 按钮索引
    var index = e.currentTarget.dataset.index;
    var list = that.data.relativeArr;
    for(var i=0;i<list.length;i++){
      if(i !== index){
        list[i].checked = false;
      }else{
        list[i].checked = true;
        that.setData({
          'identity.identity':list[i].val,
          'identity.babyId':that.data.baby.babyId,
        })
      }
    }
     // 更新
     that.setData({
      relativeArr: list
    });
  },


  /**
   * 保存
   */
  saveRelative:function(){
    postRequest("/identity/save",this.data.identity)
    .then((value) =>{
      const {code,msg} = value;
      if(code == 200){
        wx.setStorageSync('baby', this.data.baby);
        //跳转到主页，并刷新页面
        wx.switchTab({
          url: '../index/index',
          success:res =>{
            var page = getCurrentPages().pop();
            if (page == undefined || page == null) {
              return
            }
            page.onLoad();//重新加载页面
          }
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
    if(options != null){
      this.setData({
        baby:JSON.parse(options.baby),
        'identity.userId':wx.getStorageSync('user').userId
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