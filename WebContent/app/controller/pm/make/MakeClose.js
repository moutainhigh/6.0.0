Ext.QuickTips.init();
Ext.define('erp.controller.pm.make.MakeClose', {
    extend: 'Ext.app.Controller',
    FormUtil: Ext.create('erp.util.FormUtil'),
    BaseUtil: Ext.create('erp.util.BaseUtil'),
    views:[
    		'pm.make.MakeClose','pm.make.MakeCloseForm',
    		'core.button.Confirm','core.button.Close','core.button.Print',
    		'core.form.ConDateField','core.trigger.DbfindTrigger'/*,'core.form.FtFindField'*/
    	] ,
    	init:function(){
        	var me = this;
        	this.control({         		
        		'erpCloseButton': {
        			click: function(btn){
        				me.FormUtil.beforeClose(me);
        			}
        		}
        	});
        },
    	getForm: function(btn){
    		return btn.ownerCt.ownerCt;
    	}
    });