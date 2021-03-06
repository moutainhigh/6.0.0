Ext.QuickTips.init();
Ext.define('erp.controller.plm.cost.SharedCount', {
    extend: 'Ext.app.Controller',
    FormUtil: Ext.create('erp.util.FormUtil'),
    BaseUtil: Ext.create('erp.util.BaseUtil'),
    views:[
    		'plm.cost.SharedCount',
    		'core.button.Confirm','core.button.Close','core.form.MonthDateField'
    	] ,
    	init:function(){
        	var me = this;
        	this.control({         		
        		'erpCloseButton': {
        			click: function(btn){
        				me.FormUtil.onClose();
        			}
        		},
        		'erpConfirmButton': {
        			click: function(btn){
        				this.catchDate();
        			}
        		},
        		'monthdatefield': {
        			afterrender: function(f) {
        				this.getCurrentMonth(f, "MONTH-O");
        			}
        		}
        	});
        },
    	getForm: function(btn){
    		return btn.ownerCt.ownerCt;
    	},
    	catchDate: function(){
    		var mb = new Ext.window.MessageBox();
    	    mb.wait('正在计算中','请稍后...',{
    		   interval: 400,
    		   duration: 14000,
    		   increment: 10,
    		   scope: this
    		});
    		Ext.Ajax.request({
    			url : basePath + "plm/cost/sharedCount.action",
    			params:{
    				param:{date:Ext.getCmp('date').value},
    			},
    			method:'post',
    			timeout: 24000,
    			callback:function(options,success,response){
    				mb.close();
    				var localJson = new Ext.decode(response.responseText);
        			if(localJson.success){
        				showMessage("提示", "公摊费用计算成功！");
						window.location.reload();
        			} else {
        				if(localJson.exceptionInfo){
        	   				var str = localJson.exceptionInfo;
        	   				if(str.trim().substr(0, 12) == 'AFTERSUCCESS'){//特殊情况:操作成功，但是出现警告,允许刷新页面
        	   					str = str.replace('AFTERSUCCESS', '');
        	   					showMessage('提示', str);
        	   					window.location.reload();
        	   				} else {
        	   					showError(str);return;
        	   				}
        	   			}
        			}
    			}
    		});
    	},
    	getCurrentMonth: function(f, type) {
        	Ext.Ajax.request({
        		url: basePath + 'fa/getMonth.action',
        		params: {
        			type: type
        		},
        		callback: function(opt, s, r) {
        			var rs = Ext.decode(r.responseText);
        			if(rs.data) {
        				f.setValue(rs.data.PD_DETNO);
        			}
        		}
        	});
        }
    });