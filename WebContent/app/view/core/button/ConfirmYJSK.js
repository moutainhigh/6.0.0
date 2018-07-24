// 确认样机收款按钮
Ext.define('erp.view.core.button.ConfirmYJSK',{ 
		extend: 'Ext.Button', 
		alias: 'widget.erpConfirmYJSKButton',
		param: [],
		id: 'erpConfirmYJSKButton',
		text: $I18N.common.button.erpConfirmYJSKButton,
		iconCls: 'x-button-icon-save',
    	cls: 'x-btn-gray',
    	width: 120,
    	style: {
    		marginLeft: '10px'
        },
		initComponent : function(){ 
			this.callParent(arguments); 
		}
	});