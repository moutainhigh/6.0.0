Ext.QuickTips.init();
Ext.define('erp.controller.oa.publicAdmin.book.returnManage.RenewApp', {
    extend: 'Ext.app.Controller',
    FormUtil: Ext.create('erp.util.FormUtil'),
    BaseUtil: Ext.create('erp.util.BaseUtil'),
    views:[
    		'oa.publicAdmin.book.returnManage.RenewApp','common.datalist.GridPanel','common.datalist.Toolbar',
    		'core.trigger.DbfindTrigger','core.form.ConDateField','core.toolbar.Toolbar','oa.publicAdmin.book.returnManage.ReturnForm'
    		,'core.form.YnField'
    	],
    init:function(){
    	var me = this;
    	this.control({
    		'erpDatalistGridPanel': { 
    			itemclick: this.onGridItemClick 
    		},
    		'button[id=renew]': {
    			click: function(btn){
    				me.vastRenew();
    			}
    		}
    	});
    },
/*	'field[name=bo_isloan]': {
		change: function(f){
			if(f.value == -1){// YES 状态为借出
				me.updateStatus(Ext.getCmp('bo_id').value, 0); no 未借出
			}
		}
	},*/
    onGridItemClick: function(selModel, record){//grid行选择
    	var me = this;
    	if(keyField != null && keyField != ''){
    		var value = record.data[keyField];
        	var formCondition = keyField + "IS" + value ;
        	var gridCondition = pfField + "IS" + value;
        	var panel = Ext.getCmp(caller + keyField + "=" + value); 
        	var main = parent.Ext.getCmp("content-panel");
        	if(!main){
				main = parent.parent.Ext.getCmp("content-panel");
			}
        	if(!panel){ 
        		var title = "";
    	    	if (value.toString().length>4) {
    	    		 title = value.toString().substring(value.toString().length-4);	
    	    	} else {
    	    		title = value;
    	    	}
    	    	var myurl = '';
    	    	if(contains(url, '?', true)){
    	    		myurl = url + '&formCondition='+formCondition+'&gridCondition='+gridCondition;
    	    	} else {
    	    		myurl = url + '?formCondition='+formCondition+'&gridCondition='+gridCondition;
    	    	}
    	    	myurl += "&datalistId=" + main.getActiveTab().id;
    	    	main.getActiveTab().currentStore = me.getCurrentStore(value);//用于单据翻页
    	    	panel = {       
    	    			title : me.BaseUtil.getActiveTab().title+'('+title+')',
    	    			tag : 'iframe',
    	    			tabConfig:{tooltip:me.BaseUtil.getActiveTab().tabConfig.tooltip+'('+keyField + "=" + value+')'},
    	    			frame : true,
    	    			border : false,
    	    			layout : 'fit',
    	    			iconCls : 'x-tree-icon-tab-tab1',
    	    			html : '<iframe id="iframe_maindetail_'+caller+"_"+value+'" src="' + myurl + '" height="100%" width="100%" frameborder="0" scrolling="auto"></iframe>',
    	    			closable : true,
    	    			listeners : {
    	    				close : function(){
    	    					if(!main){
    	    						main = parent.parent.Ext.getCmp("content-panel");
    	    					}
    	    			    	main.setActiveTab(main.getActiveTab().id); 
    	    				}
    	    			} 
    	    	};
    	    	this.openTab(panel, caller + keyField + "=" + record.data[keyField]);
        	}else{ 
    	    	main.setActiveTab(panel); 
        	} 
    	}
    }, 
    openTab : function (panel,id){ 
    	var o = (typeof panel == "string" ? panel : id || panel.id); 
    	var main = parent.Ext.getCmp("content-panel"); 
    	if(!main) {
    		main =parent.parent.Ext.getCmp("content-panel"); 
    	}
    	var tab = main.getComponent(o); 
    	if (tab) { 
    		main.setActiveTab(tab); 
    	} else if(typeof panel!="string"){ 
    		panel.id = o; 
    		var p = main.add(panel); 
    		main.setActiveTab(p); 
    	} 
    },
    getCurrentStore: function(value){
    	var grid = Ext.getCmp('grid');
		var items = grid.store.data.items;
		var array = new Array();
		var o = null;
		Ext.each(items, function(item, index){
			o = new Object();
			o.selected = false;
			if(index == 0){
				o.prev = null;
			} else {
				o.prev = items[index-1].data[keyField];
			}
			if(index == items.length - 1){
				o.next = null;
			} else {
				o.next = items[index+1].data[keyField];
			}
			var v = item.data[keyField];
			o.value = v;
			if(v == value)
				o.selected = true;
			array.push(o);
		});
		return array;
    },
    vastRenew: function(){
    	var grid = Ext.getCmp('grid');
		var records = grid.selModel.getSelection();
		if(records.length > 0){
			var id = new Array();
			Ext.each(records, function(record, index){
				id[index] = record.data[keyField];
			});
			var main = parent.Ext.getCmp("content-panel");
			main.getActiveTab().setLoading(true);//loading...
			Ext.Ajax.request({
		   		url : basePath + 'oa/publicAdmin/book/returnManage/vastRenew.action',
		   		params: {
		   			id: id
		   		},
		   		method : 'post',
		   		callback : function(options,success,response){
		   			main.getActiveTab().setLoading(false);
		   			var localJson = new Ext.decode(response.responseText);
		   			if(localJson.exceptionInfo){
		   				showError(localJson.exceptionInfo);
		   				return "";
		   			}
	    			if(localJson.success){
		   				Ext.Msg.alert("提示", "提交续借申请成功!", function(){
		   					window.location.href = window.location.href;
		   				});
		   			}
		   		}
			});
		}
    }
});