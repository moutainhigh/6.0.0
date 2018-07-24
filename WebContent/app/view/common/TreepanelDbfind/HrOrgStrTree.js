Ext.define('erp.view.common.TreepanelDbfind.HrOrgStrTree',{ 
	extend: 'Ext.tree.Panel', 
	alias: 'widget.hrOrgStrDbfindTree', 
	id: 'tree-panel', 
	border : false, 
	enableDD : false, 
	split: true, 
	width : '100%',
	height: '100%',
	singleExpand: true,
	expandedNodes: [],
	/*listeners:{
		selectionchange: function(view, record, item, index, e) {
			console.log(record);
			var value = record.data;
		}
    },*/
    
	toggleCollapse: function() {
		if (this.collapsed) {
			this.expand(this.animCollapse);
		} else {
			this.title = $I18N.common.main.navigation;
			this.collapse(this.collapseDirection, this.animCollapse);
		}
		return this;
	},
	rootVisible: false, 
	containerScroll : true, 
	autoScroll: false, 
	useArrows: true,
	store: Ext.create('Ext.data.TreeStore', {
    	root : {
        	text: 'root',
        	id: 'root',
    		expanded: true
    	}
    }),
	bodyStyle:'background-color:#f1f1f1;',
	initComponent : function(){ 
		this.getTreeRootNode(0);
		this.callParent(arguments);
	}, 
	getTreeRootNode: function(parentid){
		Ext.Ajax.request({//拿到tree数据
        	url : basePath + 'hr/employee/getAllHrOrgsTree.action',
        	params: {
        		//parentid: parentid
        	},
        	callback : function(options,success,response){
        		var res = new Ext.decode(response.responseText);
        		if(res.tree){
        			var tree = res.tree;
        			//console.log(Ext.getCmp('tree-panel'));
                	Ext.getCmp('tree-panel').store.setRootNode({
                		text: 'root',
                	    id: 'root',
                		expanded: true,
                		children: tree
                	});
        		} else if(res.exceptionInfo){
        			showError(res.exceptionInfo);
        		}
        		Ext.getCmp('tree-panel').listenerNode();
        	}
        });
	},
	listenerNode: function(node){
		var me = this;
		var Node = node || Ext.getCmp('tree-panel').store.tree.root;
		Ext.each(Node,function(e){
			e.on('beforecollapse',function(p,o){
			});
			if(e.data['leaf'] == false){
				me.listenerNode(e);
			}
		});
		
	},
    openCloseFun: function(){
	 	  var o = Ext.getCmp("open");
	 	  var c = Ext.getCmp("close");
	 	  var tree = Ext.getCmp('tree-panel');
	 		  if(o.hidden==false&&c.hidden==true){
	 			  tree.expandAll();
	 			  o.hide();
	 			  c.show();
	 		  }else{
	 			  tree.collapseAll();
	 			  o.show();
	 			  c.hide();
	 		  }
	},
	listeners: {//滚动条有时候没反应，添加此监听器
		scrollershow: function(scroller) {
			if (scroller && scroller.scrollEl) {
				scroller.clearManagedListeners();  
				scroller.mon(scroller.scrollEl, 'scroll', 

scroller.onElScroll, scroller);  
			}
		},
		/*//单选
		checkchange: function(node,checked){
		    var tree = Ext.getCmp('tree-panel');
		    var checkedList=tree.getChecked();
			Ext.each(checkedList,function(tr,index){
				tr.set('checked',false);
			});
			node.set('checked',true);
			
			
		}*/
	},
	/**
	 * 找到所有已展开的节点，包括当前被选中的节点
	 * @param record 当前被选中的节点
	 */
	getExpandedItems: function(record){
		var me = this;
		me.getRecordParents(record);
		if(record.isLeaf()){
			me.expandedNodes.push(record);
		}
	},
	getRecordParents: function(record, parent){
		var me = this;
		if(!parent){
			parent = me.store.tree.root;
			me.expandedNodes = [];
		}
		if(parent.childNodes.length > 0){
			Ext.each(parent.childNodes, function(){
				if(this.isExpanded()){
					me.expandedNodes.push(this);
					if(this.childNodes.length > 0){
						me.getRecordParents(record, this);
					}
				}
			});
		}
	},
	getExpandItem: function(root){
		var me = this;
		if(!root){
			root = this.store.tree.root;
		}
		var node = null;
		if(root.childNodes.length > 0){
			Ext.each(root.childNodes, function(){
				if(this.isExpanded()){
					node = this;
					if(this.childNodes.length > 0){
						var n = me.getExpandItem(this);
						node = n == null ? node : n;
					}
				}
			});
		}
		return node;
	}
});