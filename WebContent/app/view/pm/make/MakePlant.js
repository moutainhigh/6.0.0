Ext.define('erp.view.pm.make.MakePlant', {
	extend : 'Ext.Viewport',
	layout : 'fit',
	hideBorders : true,
	initComponent : function() {
		var me = this;
		Ext.apply(me, {
			items : [ {
				layout : 'anchor',
				items : [ {
					xtype : 'erpFormPanel',
					anchor : '100% 50%',
					saveUrl : 'pm/make/saveMakeBase.action?caller=' + caller,
					deleteUrl : 'pm/make/deleteMakeBase.action?caller=' + caller,
					updateUrl : 'pm/make/updateMakeBase.action?caller=' + caller,
					submitUrl : 'pm/make/submitMakeBase.action?caller=' + caller,
					auditUrl : 'pm/make/auditMakeBase.action?caller=' + caller,
					resAuditUrl : 'pm/make/resAuditMakeBase.action?caller=' + caller,
					resSubmitUrl : 'pm/make/resSubmitMakeBase.action?caller=' + caller,
					checkUrl : 'pm/make/checkMakeBase.action?caller=' + caller,
					printUrl : 'pm/make/printMakeBase.action?caller=' + caller,
					resCheckUrl : 'pm/make/resCheckMakeBase.action?caller=' + caller,
					endUrl : 'pm/make/endMakeBase.action?caller=' + caller,
					resEndUrl : 'pm/make/resEndMakeBase.action?caller=' + caller,
					getIdUrl : 'common/getId.action?seq=MAKE_SEQ',
					keyField : 'ma_id',
					statusField : 'ma_status',
					codeField : 'ma_statuscode',
					voucherConfig:true
				}, {
					xtype:'tabpanel',
					id :'tab',
					anchor: '100% 50%',
					items:[{
						xtype : 'erpGridPanel2',
						detno : 'mm_detno',
						keyField : 'mm_id',
						id:'grid',
						title:'物料信息',
						caller:'Make!Base',
						mainField : 'mm_maid',
						allowExtraButtons : true,
						selModel: Ext.create('Ext.selection.CheckboxModel',{
							headerWidth: 0
						}),
						headerCt: Ext.create("Ext.grid.header.Container",{
					 	    forceFit: false,
					        sortable: true,
					        enableColumnMove:true,
					        enableColumnResize:true,
					        enableColumnHide: true
					     }),
						plugins: [Ext.create('Ext.grid.plugin.CellEditing', {
					        clicksToEdit: 1
					    }), Ext.create('erp.view.core.grid.HeaderFilter'), 
					    Ext.create('erp.view.core.plugin.CopyPasteMenu')]
					},{
						xtype : 'erpGridPanel2',
						id:'mc',
						keyField : 'mc_id',
						caller : 'MakeCraftGrid',
						mainField : 'mc_maid',
						title:'车间工作信息',
						bbar:null,
						condition:condition!=null?condition.replace(/IS/g, "=").replace('mm_maid','mc_maid')+' and nvl(mc_qty,0)>0 order by mc_detno':'',
					}]
				}]
			} ]
		});
		me.callParent(arguments);
	}
});