const {postParamsRequest} = require("../../utils/request")
// component/tree-response/tree.js
Component({

  data:{
    userId:null,//当前登录用户id
    flag:true,//判断动态id
    comment:{},//点击的评论
    commentArray:{},//评论集合
    showMiniStatus:null,
    animationData:'',//动画实例
  },
  /**
   * 组件的属性列表
   */
  properties: {
		commentArr: {
			type: Object,
      value: {},
      observer:function(newVal){
        this.setData({
          commentArray:newVal
        })
      }
    },
    trend_userId:{
      type:Number,
      observer:function(newVal){
        var user = wx.getStorageSync('user');
        var that = this;
        if(newVal == user.userId){
          that.setData({
            flag:true
          })
        }else{
          that.setData({
            flag:false
          })
        }
      }
    }
    
  
    
  },
  lifetimes:{
    attached:function(){//页面加载
      this.setData({
        userId:wx.getStorageSync('user').userId
      })
    }
  },
  observers:{//监听器
    'commentArr':function(){
      // console.log(1)
      this.hideComtModal();
    }
  },

 
  methods:{

    /**
     * 评论点击图片放大预览
     * @param {*} e 
     */
    clickShowMedia:function(e){
      // console.log(e);
      var comment = e.currentTarget.dataset.comment;
      var image = comment.media;
      wx.previewImage({
        urls: [image], //需要预览的图片http链接列表，注意是数组
        current:'', // 当前显示图片的http链接，默认是第一个
        success: function (res) { },
        fail: function (res) { },
        complete: function (res) { },
      })
    },



    /**
     * 点击回复或删除评论
     * @param {*} e 
     */
    responseComment:function(e){
      var arr = this.properties.commentArr;
      var index = e.currentTarget.dataset.index;//外层循环的下标
      var comment = arr[index];
      const com ={
        index:index,
        comment:comment
      }
      this.triggerEvent("resEvent",com);
    },


    /**
     * 点击二级及以上评论
     * @param {*} e 
     */
    clickMutlResponse:function(e){
      var comment = e.currentTarget.dataset.comment;
      this.triggerEvent("comEvent",comment);
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
    //设置对话框高度
    if(this.data.flag){
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
        height:200
      })
    }
    this.showComtModal();//显示弹窗
   
  },

  /**
   * 跳转到回复页面
   */
  navigateComment:function(){
    var trendId = this.data.comment.trendId;
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
        this.hideComtModal();
        var page = getCurrentPages().pop();
        // console.log(page)
        page.onLoad();//刷新详情页面
        
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
  }








  },
})