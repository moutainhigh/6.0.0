Ext.QuickTips.init();
Ext.define('erp.controller.oa.persontask.myAgenda.ArrangeQuery', {
    extend: 'Ext.app.Controller',
    FormUtil: Ext.create('erp.util.FormUtil'),
    GridUtil: Ext.create('erp.util.GridUtil'),
    BaseUtil: Ext.create('erp.util.BaseUtil'),
    views:[
     		'oa.persontask.myAgenda.arrangeQuery.Viewport','oa.persontask.myAgenda.arrangeQuery.GridPanel','oa.persontask.myAgenda.arrangeQuery.Form',
     		'core.trigger.DbfindTrigger','core.form.ConDateField','oa.mail.MailPaging'
     	],
    init:function(){
    	this.control({
    		'erpArrangeQueryGridPanel': { 
    			itemclick: this.onGridItemClick 
    		},
    		'erpArrangeQueryFormPanel button[name=confirm]': {
    			click: function(btn){
    				
    			}
    		}
    	});
    },
    onGridItemClick: function(selModel, record){//grid行选择
    	console.log(record);
    	var id = record.data.ag_id;
    	var win = new Ext.window.Window({
			id : 'win',
			title: "日程查看",
			height: "320px",
			width: "50%",
			maximizable : false,
			buttonAlign : 'left',
			layout : 'anchor',
			items: [{
				tag : 'iframe',
				frame : true,
				anchor : '100% 100%',
				layout : 'fit',
				html : '<iframe id="iframe_' + id + '" src="' + basePath + 'jsps/oa/persontask/myAgenda/seeAgenda.jsp?id=' + id + '" height="100%" width="100%" frameborder="0" scrolling="yes"></iframe>'
			}]
		});
		win.show();	
    }

});