import {postParamsRequest} from '../../utils/request'
import {getAge} from '../../utils/util'
Component({
   /**
   * 页面的初始数据
   */
  data: {
    babies:[],//宝宝集合
    showMiniStatus:null,//是否显示操作框
    index:null,//宝宝下标
    animationData:'',//动画实例
    state:'刚出生',//年龄状态
  },
  lifetimes:{
    //生命周期函数-监听页面加载
    attached:function(){
      this.init();//初始化
    }
  },
  methods:{
    /**
     * 初始化数据
     */
    init:function(){
      const user = wx.getStorageSync('user');
      postParamsRequest("/baby/listBabyByUserId",{userId:user.userId})
      .then((value) =>{
        const {data} = value;
        const list = data;
        //计算宝宝年龄
        for(var i=0;i<data.length;i++){
          if(data[i].babyBirth !== null){
            list[i].age = getAge(data[i].babyBirth,new Date());
          }else{
            list[i].age = '';
          }
        }
        //更新宝宝集合中的信息
        this.setData({
          babies:list
        })
      })
      this.hideModal();//隐藏操作框
    },
    /**
     * 跳转到添加宝宝
     */
    handleSaveBaby:function(){  
      wx.navigateTo({
        url: '../addbaby/addbaby',
      })
    },
    /**
     * 扫描邀请二维码
     */
    handleScanCode:function(){
      wx.scanCode({
        success(res){
          var list = res.result.split("\\");
          wx.navigateTo({
            url: list[1]+"?baby="+list[0],
          })
        }
      })
    },
    /**
     * 选择宝宝之后显示主页信息
     */
    handleBabyInfo:function(e){
      var index = e.currentTarget.dataset.index;
      var baby = this.data.babies[index];
      wx.setStorageSync('baby',baby);
      this.triggerEvent("clickEvent",true);
    },
    /**
     * 长按显示操作框
     * @param {*} e 
     */
    handleOperator:function(e){
      var index = e.currentTarget.dataset.index;
      this.setData({
        index:index
      })
      this.showModal();
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
     * 跳转到宝宝信息页面
     * @param {*} e 
     */
    clickDetailInfo:function(){
      var baby = this.data.babies[this.data.index];
      wx.navigateTo({
        url: '../babyinfo/babyinfo?babyId='+baby.babyId,
      })
    },
    /**
     * 删除宝宝
     */
    clickDelete:function(){
      var user = wx.getStorageSync('user');
      var baby = this.data.babies[this.data.index];
      //判断当前用户是否是创建宝宝的用户，若不是，则只能删除亲友关系，若是，则可以将宝宝信息全部删除
      if(user.userId == baby.userId){
        postParamsRequest("/baby/remove",{babyId:baby.babyId})
        .then((value) =>{
          const {code,msg} = value;
          if(code == 200){
            //移除删掉的宝宝对象
            var babies = this.data.babies;
            babies.splice(this.data.index,1);
            this.hideModal();
            this.setData({
              babies:babies
            })
            //默认选择排在最前面的宝宝
            wx.setStorageSync('baby', babies[0]);
          }else{
            wx.showToast({
              title: msg,
            })
          }
        })
      }else{
        postParamsRequest("/baby/removeIdentity",{
          babyId:baby.babyId,
          userId:user.userId
        })
        .then((value) =>{
          const {code,msg} = value;
          if(code == 200){
            //移除删掉的宝宝对象
            var babies = this.data.babies;
            babies.splice(this.data.index,1);
            this.hideModal();
            this.setData({
              babies:babies
            })
            //默认选择排在最前面的宝宝
            wx.setStorageSync('baby', babies[0]);
          }else{
            wx.showToast({
              title: msg,
            })
          }
        })
      }
    },
  }
})