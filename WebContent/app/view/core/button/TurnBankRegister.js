/**
 * 转银行登记
 */	
Ext.define('erp.view.core.button.TurnBankRegister',{ 
		extend: 'Ext.Button', 
		alias: 'widget.erpTurnBankRegisterButton',
		iconCls: 'x-button-icon-submit',
    	cls: 'x-btn-gray',
    	text: $I18N.common.button.erpTurnBankRegisterButton,
    	style: {
    		marginLeft: '10px'
        },
        width: 120,
		initComponent : function(){ 
			this.callParent(arguments); 
		}
	});