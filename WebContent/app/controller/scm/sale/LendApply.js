Ext.QuickTips.init();
Ext.define('erp.controller.scm.sale.LendApply', {
    extend: 'Ext.app.Controller',
    FormUtil: Ext.create('erp.util.FormUtil'),
    GridUtil: Ext.create('erp.util.GridUtil'),
    BaseUtil: Ext.create('erp.util.BaseUtil'),
    views:[
      		'core.form.Panel','scm.sale.LendApply','core.grid.Panel2','core.toolbar.Toolbar','core.form.MultiField',
     		'core.button.Save','core.button.Add','core.button.Submit','core.button.Print','core.button.Upload','core.button.ResAudit',
  			'core.button.Audit','core.button.Close','core.button.Delete','core.button.Update','core.button.DeleteDetail','core.button.ResSubmit',
  			'core.trigger.DbfindTrigger','core.trigger.TextAreaTrigger','core.form.YnField'
  	],
	init:function(){
		var me = this;
		this.control({
			'erpGridPanel2': { 
				afterrender: function(grid){
    				var status = Ext.getCmp('ld_statuscode');
    				if(status && status.value != 'ENTERING' && status.value != 'COMMITED'){
    					Ext.each(grid.columns, function(c){
    						c.setEditor(null);
    					});
    				}
    			},
    			itemclick: function(selModel, record){
    				this.onGridItemClick(selModel, record);
    			}
			},
			'erpSaveButton': {
				click: function(btn){
    				var form = me.getForm(btn);
    				if(Ext.getCmp(form.codeField).value == null || Ext.getCmp(form.codeField).value == ''){
    					me.BaseUtil.getRandomNumber();//自动添加编号
    				}
    				var bool = true;
    				if(bool){
    					this.FormUtil.beforeSave(me);//保存
    				}
    			}
			},
			'erpDeleteButton' : {
				click: function(btn){
					me.FormUtil.onDelete(Ext.getCmp('ld_id').value);
				}
			},
			'erpUpdateButton': {
				afterrender: function(btn){
    				var status = Ext.getCmp('ld_statuscode');
    				if(status && status.value != 'ENTERING'){
    					btn.hide();
    				}
    			},
    			click: function(btn){
    				this.FormUtil.onUpdate(this);
    			}
			},
//			'erpAddButton': {
//				click: function(){
//					me.FormUtil.onAdd('addLendApply', '新增预测冲销', 'jsps/scm/sale/lendapply.jsp');
//				}
//			},
			'erpCloseButton': {
				click: function(btn){
					me.FormUtil.beforeClose(me);
				}
			},
			'erpSubmitButton': {
				afterrender: function(btn){
					var status = Ext.getCmp('ld_statuscode');
					if(status && status.value != 'ENTERING'){
						btn.hide();
					}
				},
				click: function(btn){
					me.FormUtil.onSubmit(Ext.getCmp('ld_id').value);
				}
			},
			'erpResSubmitButton': {
				afterrender: function(btn){
					var status = Ext.getCmp('ld_statuscode');
					if(status && status.value != 'COMMITED'){
						btn.hide();
					}
				},
				click: function(btn){
					me.FormUtil.onResSubmit(Ext.getCmp('ld_id').value);
				}
			},
			'erpAuditButton': {
				afterrender: function(btn){
					var status = Ext.getCmp('ld_statuscode');
					if(status && status.value != 'COMMITED'){
						btn.hide();
					}
				},
				click: function(btn){
					me.FormUtil.onAudit(Ext.getCmp('ld_id').value);
				}
			},
			'erpResAuditButton': {
				afterrender: function(btn){
					var status = Ext.getCmp('ld_statuscode');
					if(status && status.value != 'AUDITED'){
						btn.hide();
					}
				},
				click: function(btn){
					me.FormUtil.onResAudit(Ext.getCmp('ld_id').value);
				}
			},
			'erpPrintButton': {
				click: function(btn){
					me.FormUtil.onPrint(Ext.getCmp('ld_id').value);
				}
			},
		});
	}, 
	onGridItemClick: function(selModel, record){//grid行选择
		this.GridUtil.onGridItemClick(selModel, record);
	},
	getForm: function(btn){
		return btn.ownerCt.ownerCt;
	},
});