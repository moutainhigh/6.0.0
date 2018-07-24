Ext.QuickTips.init();
Ext.define('erp.controller.pm.mould.MouldProdHour', {
    extend: 'Ext.app.Controller',
    FormUtil: Ext.create('erp.util.FormUtil'),
    BaseUtil: Ext.create('erp.util.BaseUtil'),
    GridUtil: Ext.create('erp.util.GridUtil'),
    views:[
    		'pm.mould.MouldProdHour','core.form.Panel','core.toolbar.Toolbar','core.grid.Panel2','core.button.CalMake','core.button.Check','core.button.ResCheck', 'core.button.End', 'core.button.ResEnd',
    		'core.button.Add','core.button.Save','core.button.Close','core.button.DeleteDetail',
    		'core.button.Submit','core.button.ResSubmit','core.button.Audit','core.button.ResAudit',
    		'core.button.Update','core.button.Delete','core.form.YnField','core.grid.YnColumn','core.button.Flow','core.button.Print',
    		'core.form.FileField','core.button.Modify','core.trigger.TextAreaTrigger','core.trigger.DbfindTrigger','core.form.MultiField'
    		],
    init:function(){
    	var me = this;
    	this.control({
    		'erpFormPanel': {},
    		'erpGridPanel2': {
    			itemclick: function(selModel, record){
    				me.onGridItemClick(selModel, record);
    			}
    		},
    		'erpSaveButton': {
    			click: function(btn){
    				var form = btn.ownerCt.ownerCt; 
    				if(Ext.getCmp(form.codeField)){
    				   if(Ext.getCmp(form.codeField).value == null || Ext.getCmp(form.codeField).value == ''){
    					me.BaseUtil.getRandomNumber('MouldProdHour');//自动添加编号
    				  }
    				}  				
    				this.FormUtil.beforeSave(this);   				
    			}
    		},
    		'erpDeleteButton' : {
    			afterrender: function(btn){
    				if(Ext.getCmp('mph_id').value == null || Ext.getCmp('mph_id').value == ''){
    					btn.hide();
    				}
    			},
    			click: function(btn){
    				me.FormUtil.onDelete(Ext.getCmp('mph_id').value);
    			}
    		},
    		'erpUpdateButton': {
    			afterrender: function(btn){
    				if(Ext.getCmp('mph_id').value == null || Ext.getCmp('mph_id').value == ''){
    					btn.hide();
    				}
    			},
    			click: function(btn){
    				this.FormUtil.onUpdate(this);
    			}
    		},
    		'erpAddButton': {
    			click: function(btn){
    				var title = btn.ownerCt.ownerCt.title || ' ';
    				var url = window.location.href;
    				url = url.replace(basePath, '');
    				url = url.substring(0, url.lastIndexOf('formCondition')-1);
    				me.FormUtil.onAdd('add' + caller, title, url);
    			}
    		},
    		'erpCloseButton': {
    			click: function(btn){
    				me.FormUtil.beforeClose(me);
    			}
    		},
    		'erpSubmitButton': {
    			afterrender: function(btn){
     				var status = Ext.getCmp(me.getForm(btn).statuscodeField);
    				if(status && status.value != 'ENTERING'){
    					btn.hide();
    				}
    			},
    			click: function(btn){
    				me.FormUtil.onSubmit(Ext.getCmp('mph_id').value,true);
    			}
    		},
    		'erpResSubmitButton': {
    			afterrender: function(btn){
    				var status = Ext.getCmp(me.getForm(btn).statuscodeField);
                    if(status && status.value != 'COMMITED'){
                        btn.hide();
                    }
    			},
    			click: function(btn){
    				me.FormUtil.onResSubmit(Ext.getCmp(me.getForm(btn).keyField).value);
    			}
    		},
    		'erpAuditButton': {
    			afterrender: function(btn){
    				var status = Ext.getCmp(me.getForm(btn).statuscodeField);
    				if(status && status.value != 'COMMITED'){
    					btn.hide();
    				}
    			},
    			click: function(btn){
    				me.FormUtil.onAudit(Ext.getCmp(me.getForm(btn).keyField).value);	
    			}
    		},
    		'erpCheckButton': {
                afterrender: function(btn){
                    var status = Ext.getCmp('ma_checkstatuscode');
                    if(status && status.value != 'COMMITED'){
                        btn.hide();
                    }
                },
                click:{ 
    				lock: 2000,
	                fn: function(btn){
                  		  me.FormUtil.onCheck(Ext.getCmp('mph_id').value);
	                }
                }
            },
            'erpResCheckButton': {
                afterrender: function(btn){
                    var status = Ext.getCmp('ma_checkstatuscode');
                    var status2 = Ext.getCmp('mph_statuscode');
                    if((status && status.value != 'APPROVE')||(status2 && status2.value == 'FINISH')){
                        btn.hide();
                    }
                    /*if(status && status.value != 'APPROVE' || Ext.getCmp('mph_statuscode').value != 'AUDITED'){
                        btn.hide();
                    }*/
                },
                click:{ 
    				lock: 2000,
	                fn: function(btn){
                   		 me.FormUtil.onResCheck(Ext.getCmp('mph_id').value);
	                }
                }
            },
            'erpEndButton': {
                afterrender: function(btn){
                    var status = Ext.getCmp('mph_statuscode');
                    if(status && status.value != 'AUDITED'){
                        btn.hide();
                    }
                },
                click: function(btn){
                    me.FormUtil.onEnd(Ext.getCmp('mph_id').value);
                }
            },
            'erpResEndButton': {
                afterrender: function(btn){
                    var status = Ext.getCmp('mph_statuscode');
                    if(status && status.value != 'FINISH'){
                        btn.hide();
                    }
                },
                click: function(btn){
                    me.FormUtil.onResEnd(Ext.getCmp('mph_id').value);
                }
            },
    		'erpResAuditButton': {
    			afterrender: function(btn){
    				var status = Ext.getCmp(me.getForm(btn).statuscodeField);
    				if(status && status.value != 'AUDITED'){
    					btn.hide();
    				}
    			},
    			click: {	
                    lock: 2000,
                	fn: function(btn){
	                    if (!confirm('确定要反审核单据?')){
	                        return;
	                    }
	                    me.FormUtil.onResAudit(Ext.getCmp('mph_id').value);
                	}
                }
    		}
    	});
    },
    onGridItemClick: function(selModel, record){//grid行选择
    	this.GridUtil.onGridItemClick(selModel, record);
	},
	getForm: function(btn){
		return btn.ownerCt.ownerCt;
	}
});