Ext.define('erp.view.oa.flow.flowEditor.FlowTurnEditor',{ 
	extend: 'Ext.Viewport', 
	layout: 'fit', 
	requires:['erp.view.oa.flow.flowEditor.flowGrid.FlowTurnGrid'],
	hideBorders: true, 
	initComponent : function(){
		var me = this; 
		//读取操作信息
		var fo_groupName;
		var fo_remark;
		Ext.Ajax.request({
			url : basePath + 'common/getFieldsDatas.action',
			async: false,
			params:{
				fields : 'fo_groupname,fo_remark',
				caller : 'flow_operation',
				condition : 'fo_fdshortname = \''+ shortName +'\' and fo_name = \''+ name +'\''
			},
			callback : function(options,success,response){
				var rs = new Ext.decode(response.responseText);
				if(rs.exceptionInfo){
					showError(rs.exceptionInfo);return;
				}
				var rs = Ext.decode(rs.data);
				if(rs.length>0){
					fo_groupName = rs[0].FO_GROUPNAME;
					fo_remark = rs[0].FO_REMARK
				}
			}
		});
		//取得当前字段和所有字段
		var nowFields = me.getNowFields(shortName,fo_groupName);
		var allFields = me.getAllFields(caller);
		var copyAllField = allFields.concat();//复制所有字段信息
		//获取参照信息
		var groupStore = me.getSelectTab(shortName);
		if(!nowFields){
			nowFields = new Array();
		}
		if(!allFields){
			allFields = new Array();
		}
		//剔除重复field
		if(nowFields.length>0&&allFields.length>0){
			Ext.Array.each(nowFields, function(b_item){
				Ext.Array.each(allFields, function(a_item,index){
					if(a_item&&a_item.field==b_item.field){
						allFields.splice(index,1)
						return;
					}
				});
			});
		}
		Ext.apply(me, { 
			items: [{ 
				id:'floweditor',
				xtype:'panel',
				layout: 'fit', 
				cls:'floweditor',
				bbar: ['->',{
					xtype:'button',
					cls:'x-btn-gray',
					text:'保存',
					id:'save',
					margin:'0 0 0 2',
					handler:function(btn){
						var groupName = Ext.getCmp('tabName').value;
						var remark = Ext.getCmp('remark').value;
						var nowItems = Ext.getCmp('togrid').store.data.items;//现在的字段
						if(nowItems.length<1){
							showInformation('至少选中一个字段', function(btn){});
							return;
						}
						if(!groupName||groupName.trim().length<1){
							showInformation('请填写正确的分组名', function(btn){});
							return;
						}
						//校验责任人字段必须要填写
						var haveDuty;
						Ext.Array.each(nowItems, function(item){
							if(item.data.fgc_rolecode=='duty'){
								haveDuty = true
							}
						});
						if(!haveDuty&&toNodeName!='END'){
							showInformation('责任人字段必须要填写', function(btn){});
							return;
						}
						var saveJson = new Array();
						//剔除重复field
						var deleteFields = Ext.getCmp('FlowTurnGrid').nowFields.concat();//需要删除的数组
						if(deleteFields.length>0&&nowItems.length>0){//找出删除的字段
							Ext.Array.each(nowItems, function(b_item){
								Ext.Array.each(deleteFields, function(a_item,index){
									if(a_item&&a_item.field==b_item.data.field){
										//为参照字段添加id
										//参照过来的字段没有fgc_id，没有主键的字段为新字段  此时需要遍历初始字段 查询相同field的字段 赋上fgc_id 标识为更新字段
										b_item.data.fgc_id = a_item.fgc_id//为现有字段和初始字段相同的添加fgc_id
										deleteFields.splice(index,1);//为deleteFields剔除重复字段
										return false;
									}
								});
							});
						}
						Ext.Array.each(nowItems, function(item,index){
							saveJson.push({
								fgc_role : item.data.fgc_role,
							    fgc_rolecode : item.data.fgc_rolecode,
								fgc_id : item.data.fgc_id,
								text : item.data.text,
								field : item.data.field,
								main : item.data.main,
								isNew : item.data.isNew,
								read : item.data.read,
								columnsWidth : item.data.columnsWidth,
								detno:index+1
							});
						});
						Ext.Ajax.request({
							url : basePath + 'oa/flow/saveTurnOperation.action',
							params: {
			   					shortName:shortName,
			   					name:name,
			   					groupName:groupName,
			   					nowItems:JSON.stringify(saveJson),
			   					deleteItems:JSON.stringify(deleteFields),
			   					remark:remark,
			   					nextNodeName:toNodeName,
			   					toId:toId,
			   					fromNodeName:fromNodeName,
			   					fromId:fromId
			   				},
							method : 'post',
							callback : function(options,success,response){
								var localJson = new Ext.decode(response.responseText);
								if(localJson.exceptionInfo){
									showError(localJson.exceptionInfo);return;
								}
								if(localJson.success){
									showInformation('操作保存成功！', function(btn){
										parent.Ext.getCmp('operationEdit').close()
									});
								}
							}
						});
					}
				},{xtype:'splitter',width:10},{
					xtype:'button',
					cls:'x-btn-gray',
					text:'关闭',
					margin:'0 5 0 0',
					handler:function(){
						var errInfo = '操作未保存，是否继续关闭？';
						warnMsg(errInfo, function(btn){
							if(btn == 'yes'){
								parent.Ext.getCmp('operationEdit').close()
							} else {
								return;
							}
						});
					}
				},'->'],
				items: [{
					xtype: 'panel',
					id:'flow_groupconfig',
					layout: 'column', 
					items:[{
						fieldLabel: '操作名称',
						name: '操作名称',
						columnWidth:0.3333,
						xtype:'textfield',
						labelAlign: 'left',
						readOnly:true,
						editable:false,
						value:name,
						cls: "form-field-allowBlank"
					},{
						fieldLabel: '<font color="red" style=\"position:relative; top:2px;right:2px; font-weight: bolder;\">*</font>分组名称',
						id: 'tabName',
						columnWidth:0.3333,
						xtype:'textfield',
						labelAlign: 'left',
						allowBlank:false,
						value:fo_groupName,
						baseValue:fo_groupName,
						cls: "form-field-allowBlank",
						listeners:{
							blur:function(t){
								var store = Ext.getCmp('like').store;
								Ext.Array.each(store.data.items,function(item){
									if(t.baseValue!=item.data.name){
										if(t.value==item.data.name){
											showInformation("该分组已存在", function(btn){});
											t.setValue(t.baseValue);
										}
									}
								});
							}
						}
					},{
						fieldLabel: '描述',
						id: 'remark',
						readOnly:false,
						value:fo_remark,
						xtype: "textareatrigger",
					    maxLength: 300,
				        maxLengthText: "字段长度不能超过300字符!",
				        hideTrigger: false,
				        editable: true,
				        columnWidth: 0.3333,
				        allowBlank: true,
				        cls: "form-field-allowBlank",
				        labelAlign: "left",
				        allowDecimals: true
					},{
						fieldLabel: '参照',
						id: 'like',
						allowDecimals:true,
						columnWidth: 1,
						hideTrigger:false,
						cls: "form-field-allowBlank",
						labelAlign:"left",
						maxLength:50,
						maxHeight:250,
						maxLengthText:"字段长度不能超过50字符!",
						readOnly:false,
						xtype:"combobox",
						editable: false,
						copyAllField:copyAllField,
						store: Ext.create('Ext.data.Store',{
							fields: ['name','shortName'],
							data: groupStore
						}),
						displayField: 'name',
						valueField: 'name',
						listeners:{
							change:function(f,newValue){
								//加载参照页面字段
								var selectTab = new Array();
								Ext.Ajax.request({
									url : basePath + 'oa/flow/getSelectTab.action',
									async:false,
									params:{
										shortName:shortName,
										groupName:newValue,
										caller:caller
									},
									callback : function(options,success,response){
										var rs = new Ext.decode(response.responseText);
										if(rs.exceptionInfo){
											showError(rs.exceptionInfo);return;
										}
										if(rs.groups.length>0){
											Ext.Array.each(rs.groups, function(item){
												var isNew = item.FGC_NEW?item.FGC_NEW:false
												if(isNew=='true'){isNew = true}else if(isNew=='false'){isNew = false}
												var main = item.FGC_REQUIREDFIELD?item.FGC_REQUIREDFIELD:false
												if(main=='true'){main = true}else if(main=='false'){main = false}
												var read = item.FGC_READ?item.FGC_READ:false
												if(read=='true'){read = true}else if(read=='false'){read = false}
												selectTab.push({
													fgc_role : item.FGC_ROLE,
													fgc_rolecode : item.FGC_ROLECODE,
													text : item.FD_CAPTION,
													logic: item.FD_LOGICTYPE,
													field : item.FGC_FIELD,
													main : main,
													isNew : isNew,
													read : read,
													columnsWidth : item.FGC_WIDTH
												});
											});
										}
									}
								});
								//剔除重复Group
								var toStroe = Ext.getCmp('togrid').store;
								var fromStore = Ext.getCmp('fromgrid').store;
								var allData = f.copyAllField.concat();
								var nowData = selectTab;
								if(allData.length>0&&nowData.length>0){
									Ext.Array.each(nowData, function(b_item){
										Ext.Array.each(allData, function(a_item,index){
											if(a_item&&a_item.field==b_item.field){
												allData.splice(index,1)
												return;
											}
										});
									});
								}
								//刷新usingGroups allGroups
								toStroe.loadData(selectTab);
								fromStore.loadData(allData);
							}
						}
					},{
						nowFields:nowFields,
						allFields:allFields,
						height:window.innerHeight - 85,
						columnWidth: 1,
						xtype:'FlowTurnGrid'
					}]
				}]
			}] 
		});
		me.callParent(arguments);
	},
	//读取已加载字段
	getNowFields:function(shortName,name){
		var nowFields = new Array();
		Ext.Ajax.request({
			url : basePath + 'oa/flow/getSelectTab.action',
			async:false,
			params:{
				shortName:shortName,
				groupName:name,
				caller:caller
			},
			callback : function(options,success,response){
				var rs = new Ext.decode(response.responseText);
				if(rs.exceptionInfo){
					showError(rs.exceptionInfo);return;
				}
				if(rs.groups.length>0){
					Ext.Array.each(rs.groups, function(item){
						var isNew = item.FGC_NEW?item.FGC_NEW:false
						if(isNew=='true'){isNew = true}else if(isNew=='false'){isNew = false}
						var main = item.FGC_REQUIREDFIELD?item.FGC_REQUIREDFIELD:false
						if(main=='true'){main = true}else if(main=='false'){main = false}
						var read = item.FGC_READ?item.FGC_READ:false
						if(read=='true'){read = true}else if(read=='false'){read = false}
						nowFields.push({
							fgc_role : item.FGC_ROLE,
							fgc_rolecode : item.FGC_ROLECODE,
							fgc_id : item.FGC_ID,
							logic: item.FD_LOGICTYPE,
							text : item.FD_CAPTION,
							field : item.FGC_FIELD,
							main : main,
							isNew : isNew,
							read : read,
							columnsWidth : item.FGC_WIDTH
						});
					});
				}
			}
		});
		return nowFields;
		
	},
	//读取全部字段
	getAllFields:function(caller){
		var allFields = new Array();
		//获取所有字段
		var s = '(select fo_id from form where fo_caller = \''+caller + '\') order by fd_detno ';
		Ext.Ajax.request({
			url : basePath + 'common/getFieldsDatas.action',
			async: false,
			params:{
				fields : 'fd_logictype,fd_caption,fd_field,fd_id',
				caller : 'formdetail',
				condition : 'fd_foid = ' + s
			},
			callback : function(options,success,response){
				var rs = new Ext.decode(response.responseText);
				if(rs.exceptionInfo){
					showError(rs.exceptionInfo);return;
				}
				Ext.Array.each(Ext.decode(rs.data), function(item){
					allFields.push({
						text:item.FD_CAPTION,
						field:item.FD_FIELD,
						logic:item.FD_LOGICTYPE
					});
				});
			}
		});
		return allFields;
	},
	getSelectTab:function(shortName){
		//获取参照页面
		var GroupStore = new Array();
		Ext.Ajax.request({
			url : basePath + 'common/getFieldsDatas.action',
			async: false,
			params:{
				fields : 'fgc_groupname,min(fgc_id)',
				caller : 'flow_groupconfig',
				condition : 'fgc_fdshortname = \''+ shortName +'\' group by fgc_groupname order by min(fgc_id)'
			},
			callback : function(options,success,response){
				var rs = new Ext.decode(response.responseText);
				if(rs.exceptionInfo){
					showError(rs.exceptionInfo);return;
				}
				Ext.Array.each(Ext.decode(rs.data), function(item){
					GroupStore.push({
						name:item.FGC_GROUPNAME,
						shortName:shortName
					});
				});
			}
		});
		return GroupStore;
	}
});