/**
 *辅助核算窗口
 **/
Ext.define('erp.view.fa.arp.vmQuery.QueryWin',{
	id:'erpquerywin_'+caller,
	extend: 'Ext.window.Window',
	alias: 'widget.erpVmQueryWindow',
	height: screen.height*0.7*0.7,
	width: screen.width*0.7*0.6,
	condition:'',
    GridUtil: Ext.create('erp.util.GridUtil'),
    BaseUtil: Ext.create('erp.util.BaseUtil'),
    layout : 'anchor',
    items:[{
		autoScroll : true,
		anchor: '100% 100%',
		id:'vmqueryform_'+caller,
		xtype:'erpVmQueryFormPanel',
		condition:caller+'_main'
	}],
	buttonAlign : 'center',
	buttons:[{
		name: 'confirm',
		text: $I18N.common.button.erpConfirmButton,
		iconCls: 'x-button-icon-confirm',
		cls: 'x-btn-gray',
		style: {
			marginLeft: '10px'
	    },
	    handler:function(){
	    	var form = Ext.getCmp('vmqueryform_'+caller);
	    	form.onQuery();
	    	var win = Ext.getCmp('erpquerywin_'+caller); 
	    	win.close();
	    }
	},'-','-',{
		text: $I18N.common.button.erpDeleteButton,
		iconCls: 'x-button-icon-delete',
		cls: 'x-btn-gray',
		handler: function(btn){
			var form = Ext.getCmp('vmqueryform_'+caller);
			form.beforeDelete(btn,grid);
		}
	},'-','-',{
		text: $I18N.common.button.erpCloseButton,
		iconCls: 'x-button-icon-close',
		cls: 'x-btn-gray',
		handler: function(){
			var main = Ext.getCmp('erpquerywin_'+caller); 
			main.close();
		}
	}],
	initComponent : function(){ 
		this.callParent();
	}
});