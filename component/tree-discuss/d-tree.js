const { postParamsRequest } = require("../../utils/request");
Component({
  properties: {
		discussArr: {
			type: Array,
			value: []
    },
    
  },
  methods:{
   /**
     * 点击评论：回复或删除
     * @param {*} e 
     */
    clickDiscuss:function(e){
      let that = this;
      var index = e.currentTarget.dataset.index;
      var list = that.properties.discussArr;
      var discuss = list[index];
      var user = wx.getStorageSync('user');
      if(discuss.userId == user.userId){
        wx.showModal({
          title: '提示',
          content: '是否删除此评论吗？',
          success: function(res) {
            if (res.confirm) {
              postParamsRequest("/discuss/remove",{discussId:discuss.discussId})
              .then((value) =>{
                const {code,msg} = value;
                if(code == 200){
                  list.splice(index,1);
                  that.setData({
                    discussArr:list
                  })
                  that.triggerEvent('flush',true);
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
      }else{
        this.triggerEvent("resEvent",discuss);
      }
    },


    /**
     * 长按删除其他亲友的评论
     * @param {*} e 
     */
    longpressDelete:function(e){
      let that = this;
      var index = e.currentTarget.dataset.index;
      var list = that.properties.discussArr;
      var discuss = list[index];
      var user = wx.getStorageSync('user');
      if(discuss.userId != user.userId){
        wx.showModal({
          title: '提示',
          content: '是否删除此评论吗？',
          success: function(res) {
            if (res.confirm) {
              postParamsRequest("/discuss/remove",{discussId:discuss.discussId})
              .then((value) =>{
                const {code,msg} = value;
                if(code == 200){
                  list.splice(index,1);
                  that.setData({
                    discussArr:list
                  })
                  that.triggerEvent('flush','true');
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
      }
    },

  }
 
})