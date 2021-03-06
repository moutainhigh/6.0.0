/**
 * 取消B2B对账
 */	
Ext.define('erp.view.core.button.CancelB2BCheck',{ 
		extend: 'Ext.Button', 
		alias: 'widget.erpCancelB2BCheckButton',
		text: $I18N.common.button.erpCancelB2BCheckButton,
    	tooltip: '取消B2B对账',
    	iconCls: 'x-button-icon-check',
    	cls: 'x-btn-gray',
    	id: 'erpCancelB2BCheckButton',
    	width: 120,
		initComponent : function(){ 
			this.callParent(arguments); 
		},
		handler: function(){
			var grid = Ext.getCmp('batchDealGridPanel');
	        var items = grid.selModel.getSelection();
	        Ext.each(items, function(item, index){
	        	if(this.data[grid.keyField] != null && this.data[grid.keyField] != ''
	        		&& this.data[grid.keyField] != '0' && this.data[grid.keyField] != 0){
	        		var bool = true;
	        		Ext.each(grid.multiselected, function(){
	        			if(this.data[grid.keyField] == item.data[grid.keyField]){
	        				bool = false;
	        			}
	        		});
	        		if(bool){
	        			grid.multiselected.push(item);
	        		}
	        	}
	        });
			var records = grid.multiselected;
			if(records.length > 0){
				var id = new Array();
				Ext.each(records, function(record, index){
					id.push(record.data['ve_id']);
				});
				grid.setLoading(true);
				Ext.Ajax.request({
			   		url : basePath + 'scm/purchase/cancelB2BCheck.action',
			   		params: {
			   			data: id.join(","),
			   			caller:caller			   			
			   		},
			   		method : 'post',
			   		callback : function(options,success,response){
			   			grid.setLoading(false);
			   			var localJson = new Ext.decode(response.responseText);
			   			if(localJson.exceptionInfo){
			   				showError(localJson.exceptionInfo);
			   			} else {
			   				if(localJson.success){
			   					showMessage("提示", '取消B2B对账成功！');
			   					grid.multiselected = new Array();
			   					Ext.getCmp('dealform').onQuery(true);
			   				}
			   			}
			   		}
				});
			} else {
				showError("请勾选需要的明细!");
			}
		}
});