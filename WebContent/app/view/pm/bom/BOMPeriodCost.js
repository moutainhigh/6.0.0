Ext.define('erp.view.pm.bom.BOMPeriodCost',{ 
	extend: 'Ext.Viewport', 
	layout: 'fit', 
	hideBorders: true, 
	initComponent : function(){ 
		var me = this; 
		Ext.apply(me, { 
			items: [{
				xtype: "window",
				autoShow: true,
				closable: false,
				maximizable : true,
		    	width: '65%',
		    	height: '65%',
		    	layout: 'border',
		    	items: [{
		    		region: 'center',
		    		xtype: 'erpFormPanel',
	    			fixedlayout:true	
		    	}]
		    }]
		}); 
		me.callParent(arguments); 
	} 
});