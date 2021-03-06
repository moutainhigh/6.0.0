Ext.QuickTips.init();
Ext.define('erp.controller.fs.fspledge.Pawn', {
    extend: 'Ext.app.Controller',
    FormUtil: Ext.create('erp.util.FormUtil'),
    BaseUtil: Ext.create('erp.util.BaseUtil'),
    views:[
    		'fs.fspledge.Pawn','core.form.Panel', 'core.grid.Panel2', 'core.toolbar.Toolbar', 'core.form.MultiField',
    		'core.button.Add','core.button.Save','core.button.Close','core.button.Update','core.button.Delete',
    		'core.button.Submit','core.button.ResSubmit','core.button.Audit','core.button.ResAudit',
    		'core.form.FileField','common.datalist.Toolbar','core.form.YnField', 'core.form.SeparNumber',
    		'core.trigger.TextAreaTrigger','core.trigger.DbfindTrigger'
    	],
    init:function(){
    	var me = this;
    	this.control({
    		'erpSaveButton': {
    			click: function(btn){
    				var form = me.getForm(btn);
    				if(Ext.getCmp(form.codeField).value == null || Ext.getCmp(form.codeField).value == ''){
    					me.BaseUtil.getRandomNumber('FSPLEDGE');
    				}
    				this.FormUtil.beforeSave(this);
    			}
    		},
    		'erpAddButton': {
    			click: function(){
    				me.FormUtil.onAdd('pawn', '新增抵押物', 'jsps/fs/fspledge/pawn.jsp');
    			}
    		},
    		'erpUpdateButton': {
    			click: function(btn){
    				this.FormUtil.onUpdate(this);
    			}
    		},
    		'erpDeleteButton': {
    			click: function(btn){
    				me.FormUtil.onDelete(Ext.getCmp('pl_id').value);
    			}
    		},
			'erpSubmitButton': {
    			afterrender: function(btn){
    				var status = Ext.getCmp('pl_statuscode');
    				if(status && status.value != 'ENTERING'){
    					btn.hide();
    				}
    			},
    			click: function(btn){
    				me.FormUtil.onSubmit(Ext.getCmp('pl_id').value);
    			}
    		},
    		'erpResSubmitButton': {
    			afterrender: function(btn){
    				var status = Ext.getCmp('pl_statuscode');
    				if(status && status.value != 'COMMITED'){
    					btn.hide();
    				}
    			},
    			click: function(btn){
    				me.FormUtil.onResSubmit(Ext.getCmp('pl_id').value);
    			}
    		},
    		'erpAuditButton': {
    			afterrender: function(btn){
    				var status = Ext.getCmp('pl_statuscode');
    				if(status && status.value != 'COMMITED'){
    					btn.hide();
    				}
    			},
    			click: function(btn){
    				me.FormUtil.onAudit(Ext.getCmp('pl_id').value);
    			}
    		},
    		'erpResAuditButton': {
    			afterrender: function(btn){
    				var status = Ext.getCmp('pl_statuscode');
    				if(status && status.value != 'AUDITED'){
    					btn.hide();
    				}
    			},
    			click: function(btn){
    				me.FormUtil.onResAudit(Ext.getCmp('pl_id').value);
    			}
    		},
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