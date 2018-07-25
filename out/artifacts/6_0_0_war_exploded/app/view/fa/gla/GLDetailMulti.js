Ext.define('erp.view.fa.gla.GLDetailMulti',{ 
	extend: 'Ext.Viewport', 
	layout: 'anchor', 
	hideBorders: true, 
	initComponent : function(){ 
		var me = this; 
		Ext.apply(me, { 
			items: [{
				xtype: 'form',  
				anchor: '100% 5%',
				layout: 'column',
				bodyStyle: 'background:#f1f1f1;',
				buttonAlign: 'center',
				bbar: [{
					xtype: 'tbtext',
					id: 'gl_info_ym',
					updateInfo: function(args) {
						if(args.sl_yearmonth) {
							this.setText('期间: 从 ' + args.sl_yearmonth.begin + ' 到 ' + 
									args.sl_yearmonth.end + ' ');
						} else if(args.sl_date){
							this.setText('日期: 从 ' + args.sl_date.begin + ' 到 ' + 
									args.sl_date.end + ' ');
						}
					}
				},'-',{
					xtype: 'tbtext',
					id: 'gl_info_c',
					updateInfo: function(args) {
						if(args.chkcatelist){
							this.setText('科目: 从 ' + args.catecode + ' 到 ' + 
									args.ca_code.value.end + ' ');
						} else {
							this.setText('科目: ' + (args.catecode || ' ') + ' [' + (args.catename || ' ') + ']');
						}
					}
				},'-',{
					xtype: 'tbtext',
					id: 'gl_info_ass',
					updateInfo: function(args) {
						if(args.assname)
							this.setText(args.assname);
						else 
							this.setText(' ');
					}
				},'-' ,'->',{
					name: 'query',
					id: 'query',
					text: $I18N.common.button.erpQueryButton,
					iconCls: 'x-button-icon-query',
			    	cls: 'x-btn-gray',
			    	margin: '0 4 0 0'
				},{
					name: 'prev',
					id: 'prev',
					text: $I18N.common.tip.prev,
					iconCls: 'prev',
			    	cls: 'x-btn-gray',
			    	margin: '0 4 0 0'
				},{
					name: 'next',
					id: 'next',
					text: $I18N.common.tip.next,
					iconCls: 'next',
			    	cls: 'x-btn-gray',
			    	margin: '0 4 0 0'
				},{
					name: 'export',
					text: $I18N.common.button.erpExportButton,
					iconCls: 'x-button-icon-excel',
			    	cls: 'x-btn-gray',
			    	margin: '0 4 0 0'
				},{
					name: 'print',
					text: $I18N.common.button.erpPrintButton,
			    	iconCls: 'x-button-icon-print',
			    	margin: '0 4 0 0',
			    	cls: 'x-btn-gray'
				},{
					text: $I18N.common.button.erpCloseButton,
					iconCls: 'x-button-icon-close',
			    	cls: 'x-btn-gray',
			    	margin: '0 10 0 0',
			    	handler: function(){
			    		var main = parent.Ext.getCmp("content-panel"); 
			    		main.getActiveTab().close();
			    	}
				}]
		    },{
		    	xtype: 'ledgerdetail',  
		    	anchor: '100% 95%'
		    }] 
		}); 
		me.callParent(arguments); 
	} 
});