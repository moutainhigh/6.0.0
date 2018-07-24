Ext.define('Ext.ux.CheckColumn', {
    extend: 'Ext.grid.column.Column',
    alias: 'widget.checkcolumn',
    constructor: function() {
        this.addEvents(
            'checkchange'
        );
        this.callParent(arguments);
        this.sortable = false;
        if(!this.renderer){
        	this.renderer = this.rendererFn;
        }
        var me = this;
        fn = function(ch){
        	me.selectAll(ch.getAttribute('grid'), ch.getAttribute('cm'), ch.checked);
        };
    },
    headerCheckable: false,
    singleChecked: false,
    listeners: {
    	afterrender: function(){
    		if(this.headerCheckable) {
    			this.setText("<input type='checkbox' id='" + this.dataIndex + "-checkbox' grid='" + 
       				 this.ownerCt.ownerCt.id + "' cm='" + this.dataIndex + "' onclick='fn(this);'/>" + this.text);
    		}
    		if(this.singleChecked) {
    			this.on('checkchange', this.onSingleCheck, this, {delay: 100});
    		}
        }
    },
    /**
     * @private
     * Process and refire events routed from the GridView's processEvent method.
     */
    processEvent: function(type, view, cell, recordIndex, cellIndex, e) {
    	if (((view.panel.store.getAt(recordIndex).data.dg_isfixed && view.panel.store.getAt(recordIndex).data.dg_isfixed==-1)||(view.panel.store.getAt(recordIndex).data.fd_isfixed && view.panel.store.getAt(recordIndex).data.fd_isfixed==-1))&& this.dataIndex=="deploy") return ;
        if (type == 'mousedown' || (type == 'keydown' && (e.getKey() == e.ENTER || e.getKey() == e.SPACE))) {
        	var record = null;
        	var dataIndex = this.dataIndex;
        	var checked = null;
        	if(view.panel.store.tree){//treegrid
        		var tree = Ext.ComponentQuery.query('treepanel')[0];
        		tree.getRecordByRecordIndex(recordIndex);
        		record = tree.findRecord;
        		checked = !record.get(dataIndex);
        		//如果父节点checked，就把其子孙节点checked,否则unchecked
        		tree.checkRecord(record, dataIndex, checked);
        	} else {//普通的grid
        		record = view.panel.store.getAt(recordIndex);
        		checked = !record.get(dataIndex);
        	}
            record.set(dataIndex, checked);
            this.fireEvent('checkchange', this, recordIndex, checked);
            // cancel selection.
            return false;
        } else {
            return this.callParent(arguments);
        }
    },

    // Note: class names are not placed on the prototype bc renderer scope
    // is not in the header.
    rendererFn : function(value, m, record){
        var cssPrefix = Ext.baseCSSPrefix,
            cls = [cssPrefix + 'grid-checkheader'];

        if (value) {
            cls.push(cssPrefix + 'grid-checkheader-checked');
        }
        return '<div class="' + cls.join(' ') + '">&#160;</div>';
    },
    /**
     * (取消)全选
     */
    selectAll: function(g, c, checked){
    	var grid = Ext.getCmp(g);
    	if(!grid.store)
    		grid = grid.ownerCt;
    	if(grid && grid.store.data){
    		if(checked){
    			grid.store.each(function(){
        			if(!this.get(c)) {
        				this.set(c, true);
        			}
        		});
    		} else {
    			grid.store.each(function(){
        			if(this.get(c)) {
        				this.set(c, false);
        			}
        		});
    		}
    	} else if(grid.store.tree){//tree grid
    		var items = grid.store.tree.root.childNodes;
    		Ext.each(items, function(item){
    			
    		});
    	}
    },
    onSingleCheck: function(cm, rIdx, check) {
    	if(check) {
    		var grid = this.up('grid'), field = this.dataIndex;
        	grid.store.each(function(r, i){
        		if(i != rIdx && r.get(field)) {
        			r.set(field, false);
        		}
        	});
    	}
    }
});
Ext.define('erp.view.ma.MyDetail',{ 
	extend: 'Ext.grid.Panel', 
	alias: 'widget.mydetail',
	layout : 'fit',
 	emptyText : $I18N.common.grid.emptyText,
    columnLines : true,
    autoScroll : true,
    store: [],
    columns: [],
    plugins: Ext.create('Ext.grid.plugin.CellEditing', {
        clicksToEdit: 1,
        beforeEdit:function(context){
        	if(context.record.data.dg_isfixed && (context.record.data.dg_isfixed==-1) && (context.field=='dg_caller'||context.field=='dg_table'||context.field=='dg_field'||context.field=='dg_logictype'||context.field=='deploy')) 
        		return false;
        	else return true;
        }
    }),
    viewConfig: {
        getRowClass: function(record, rowIndex, rowParams, store){
            if (record.data.dg_isfixed && record.data.dg_isfixed==-1 )return 'x-grid-record-gray' ;
        }
    },
    GridUtil: Ext.create('erp.util.GridUtil'),
    bbar: {
    	xtype: 'erpToolbar',
    	allowExtraButtons: false
    },
	initComponent : function(){
		this.whoami = this.whoami || getUrlParam('whoami');
		this.getGridColumnsAndStore();
		this.callParent(arguments);
	},
	detno: 'dg_sequence',
	caller: 'DetailGrid',
	getGridColumnsAndStore: function(){
		if(em_type!='admin'){
    		showError('ERR_POWER_025:您没有修改页面配置的权限!');return;
    	}
		var grid = this;
		var main = parent.Ext.getCmp("content-panel");
		if(!main)
			main = parent.parent.Ext.getCmp("content-panel");
		if(main){
			main.getActiveTab().setLoading(true);//loading...
		}
		Ext.Ajax.request({//拿到grid的columns
        	url : basePath + 'common/singleGridPanel.action',
        	async: false,
        	params: {
        		caller: grid.caller,
        		condition: "dg_caller='" + grid.whoami + "'",
        		_m: 0
        	},
        	method : 'post',
        	callback : function(options,success,response){
        		if(main){
        			main.getActiveTab().setLoading(false);
        		}
        		var res = new Ext.decode(response.responseText);
        		if(res.exceptionInfo){
        			showError(res.exceptionInfo);return;
        		}
        		if(res.columns){
        			grid.columns = res.columns;
        			grid.fields = res.fields;
        			grid.columns.push({
        				xtype: 'checkcolumn',
        				text: '配置',
        				width: 60,
        				dataIndex: 'deploy',
        				cls: "x-grid-header-1",
        				locked: true,
        				editor: {
        					xtype: 'checkbox',
        					cls: "x-grid-checkheader-editor"
        				}
        			});
        			grid.fields.push({name: 'deploy', type: 'bool'});
        			//renderer
        			grid.getRenderer();
            		var data = Ext.decode(res.data.replace(/,}/g, '}').replace(/,]/g, ']'));
            		Ext.each(data, function(d){
            			d.deploy = true;
            			d.dg_modify = d.dg_modify == 'T';
            		});
            		grid.data = data;
            		if(res.dbfinds.length > 0){
            			grid.dbfinds = res.dbfinds;
            		}
            		//取数据字典配置
            		if(data && data.length > 0) {
            			var tab = data[0].dg_table;
                		if(tab) {
                			grid.getDataDictionaryData(tab.split(' ')[0]);
                		}
            		}
            		grid.reconfigureGrid();
        		}
        	}
        });
	},
	getRenderer: function(){
		var grid = this;
		Ext.each(grid.columns, function(column, y){
			//logictype
			var logic = column.logic;
			if(logic != null){
				if(logic == 'detno'){
					grid.detno = column.dataIndex;
				} else if(logic == 'keyField'){
					grid.keyField = column.dataIndex;
				} else if(logic == 'mainField'){
					grid.mainField = column.dataIndex;
				} else if(logic == 'necessaryField'){
					grid.necessaryField = column.dataIndex;
					if(!grid.necessaryFields){
						grid.necessaryFields = new Array();
					}
					grid.necessaryFields.push(column.dataIndex);
					if(!column.haveRendered){
						column.renderer = function(val, meta, item){
								if(item.data['dg_id'] != null && item.data['dg_id'] != '' && item.data['dg_id'] != '0' 
		            				&& item.data['dg_id'] != 0) {
									return '<img src="' + basePath + 'resource/images/renderer/finishrecord.png">' +   
										'<span style="color:blue;" title="已配置">' + val + '</span>';
								} else {
									return '<img src="' + basePath + 'resource/images/renderer/important.png">' +  
										'<span style="color:red;" title="未配置">' + val + '</span>';
								}
					   };
					}
				} else if(logic == 'groupField'){
					grid.groupField = column.dataIndex;
				}
			}
		});
	},
	reconfigureGrid: function(){
		var grid = this;
		grid.store = Ext.create('Ext.data.Store', {
		    fields: grid.fields,
		    data: grid.data,
		    sorters: [{
				property: 'dg_sequence'
		    }]
		});
	},
	getDataDictionaryData: function(tablename){
		var me = this, mGrid = Ext.getCmp('grid');
		if(mGrid && mGrid.dictionary && mGrid.dictionary[tablename]) {
			me.parseDictionary(mGrid.dictionary[tablename]);
		} else {
	  		Ext.Ajax.request({
	        	url : basePath + 'ma/getDataDictionary.action',
	        	async: false,
	        	params: {
	        		table: tablename
	        	},
	        	method : 'post',
	        	callback : function(options,success,response){
	        		var res = new Ext.decode(response.responseText);
	        		if(res.exceptionInfo){
	        			showError(res.exceptionInfo);return;
	        		} else if(res.success) {
	        			me.parseDictionary(res.datadictionary);
	        		}
	        	}
			});
		}
	},
	parseDictionary: function(dictionary) {
		var me = this, data = this.data;
		//取Max(序号)
		var det = Ext.Array.max(Ext.Array.pluck(data, me.detno));
		//data里面包含的字段
		var sel = [];
		Ext.Array.each(data, function(d){
			sel.push(d.dg_field.toLowerCase());
		});
		var o = null;
		Ext.each(dictionary, function(d, index){
			//将DataDictionary的数据转化成FormDetail数据
			if(sel.indexOf(d.column_name) == -1){
				o = new Object();
				o.dg_table = d.table_name;
				o.dg_field = d.column_name;
				o.dg_caption = d.comments;
				o.dg_captionfan = d.comments;
				o.dg_captionen = d.comments;
				o.dg_editable = false;
				o.dg_width = 80;
				o.dg_dbbutton = '0';
				o.dg_visible = true;
				o.deploy = false;
				o.dg_caller = me.whoami;
				if(contains(d.data_type, 'VARCHAR2', true)){
					o.dg_type = 'text';
					o.dg_maxlength=d.data_length;
				} else if(contains(d.data_type, 'TIMESTAMP', true)){
					o.dg_type = 'datetimecolumn';
				} else if(d.data_type == 'DATE'){
					o.dg_type = 'datecolumn';
				} else if(d.data_type == 'NUMBER'){
					o.dg_type = 'numbercolumn';
				} else if(d.data_type == 'FLOAT'){
					o.dg_type = 'floatcolumn';
				} else {
					o.dg_type = 'text';
					o.dg_maxlength=d.data_length||100;
				}
				o.dg_sequence = ++det;
				data.push(o);
			}
		});
		me.dictionary = dictionary;
	},
	getDeleted: function(){
		var grid = this,items = grid.store.data.items,key = grid.keyField,deleted = new Array(),d = null;
		Ext.each(items, function(item){
			d = item.data;
			if(item.dirty && !Ext.isEmpty(d[key]) && d['deploy'] == false) {
				deleted.push(grid.removeKey(d, 'deploy'));
			}
		});
		return deleted;
	},
	getAdded: function(){
		var grid = this,items = grid.store.data.items,key = grid.keyField,added = new Array(),d = null;
		Ext.each(items, function(item){
			d = item.data;
			if(item.dirty && d[key] == 0 && d['deploy'] == true) {
				added.push(grid.removeKey(d, 'deploy'));
			}
		});
		return added;
	},
	getUpdated: function(){
		var grid = this,items = grid.store.data.items,key = grid.keyField,updated = new Array(),d = null;
		Ext.each(items, function(item){
			d = item.data;
			if(item.dirty && !Ext.isEmpty(d[key]) && d[key] != 0 && d['deploy'] == true) {
				updated.push(grid.removeKey(d, 'deploy'));
			}
		});
		return updated;
	},
	removeKey: function(d, key){
		var a = new Object(),keys = Ext.Object.getKeys(d);
		Ext.each(keys, function(k){
			if(k != key) {
				a[k] = d[k];
				if(k == 'dg_modify') {
					a[k] = a[k] ? 'T' : 'F';
				}
				if(k == 'dg_editable' || k == 'dg_visible') {
					a[k] = a[k] ? -1 : 0;
				}
				if(k == 'dg_check')
					a[k] = a[k] ? 1 : 0;
			}
		});
		return a;
	},
	getChange: function(){
		var grid = this,items = grid.store.data.items,key = grid.keyField,
		added = new Array(),updated = new Array(),deleted = new Array(),d = null,e = null;
		Ext.each(items, function(item){
			d = item.data;
			if (item.dirty) {
				e = grid.removeKey(d, 'deploy');
				if(d[key] == 0 && d['deploy'] == true) {
					added.push(e);
				}
				if(!Ext.isEmpty(d[key]) && d[key] != 0 && d['deploy'] == true) {
					updated.push(e);
				}
				if(!Ext.isEmpty(d[key]) && d[key] != 0 && d['deploy'] == false) {
					deleted.push(e);
				}
			}
		});
		return {
			added: added,
			updated: updated,
			deleted: deleted
		};
	}
});