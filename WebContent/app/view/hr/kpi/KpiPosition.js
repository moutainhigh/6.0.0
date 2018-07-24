Ext.define('erp.view.hr.kpi.KpiPosition',{ 
	extend: 'Ext.Viewport', 
	layout: 'fit', 
	hideBorders: true, 
	initComponent : function(){ 
		var me = this; 
		Ext.apply(me, { 
			items: [{ 
				id:'erpFormPanel', 
				layout: 'anchor', 
				items: [{
					xtype: 'erpFormPanel',
					anchor: '100% 30%',
					saveUrl: 'hr/kpi/saveKpiPosition.action',
					deleteUrl: 'common/deleteCommon.action?caller='+caller,
					updateUrl: 'common/updateCommon.action?caller='+caller,
					getIdUrl: 'common/getId.action?seq=KpiRule_SEQ',
					keyField: 'kr_id',
					codeField: 'kr_code'
				},{
					xtype: 'erpPositionGrid',
					anchor: '100% 70%'
				}]
			}] 
		}); 
		me.callParent(arguments); 
	} 
});