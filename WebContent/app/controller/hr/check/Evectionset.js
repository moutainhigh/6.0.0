Ext.QuickTips.init();
Ext.define('erp.controller.hr.check.Evectionset', {
    extend: 'Ext.app.Controller',
    FormUtil: Ext.create('erp.util.FormUtil'),
    BaseUtil: Ext.create('erp.util.BaseUtil'),
    views:[
    		'hr.check.Evectionset','core.form.Panel',
    		'core.button.Add','core.button.Save','core.button.Close',
    		'core.button.Update','core.button.Delete','core.form.YnField',
    		'core.trigger.TextAreaTrigger','core.trigger.DbfindTrigger'
    	],
    init:function(){
    	var me = this;
    	this.control({ 
    		'erpSaveButton': {
    			click: function(btn){
    				this.FormUtil.beforeSave(this);
    			}
    		},
    		'erpCloseButton': {
    			click: function(btn){
    				this.FormUtil.beforeClose(this);
    			}
    		},
    		'erpUpdateButton': {
    			click: function(btn){
    				this.FormUtil.onUpdate(this);
    			}
    		},
    		'erpDeleteButton': {
    			click: function(btn){
    				me.FormUtil.onDelete(Ext.getCmp('es_id').value);
    			}
    		},
    		'erpAddButton': {
    			click: function(){
    				me.FormUtil.onAdd('addEvectionset', '新增出差类别', 'jsps/hr/check/evectionset.jsp');
    			}
    		}
    		
    	});
    },
    getForm: function(btn){
		return btn.ownerCt.ownerCt;
	}
});