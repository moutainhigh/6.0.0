
Ext.ns('App');

App = {
    webforms: {},
    init: function() {
        Ext.QuickTips.init();
        this.propertyManager = new App.property.PropertyManager();
        this.workbenchWindow = new Gef.ui.support.DefaultWorkbenchWindow();
        var viewport = new Ext.Viewport({
        	id:'viewport',
            layout: 'border',
            items: [
                this.createNorth(),
                this.createSouth(),
                this.createWest(),
                this.createEast(),
                this.createCenter()
            ],
            listeners: {
            	click: {
                    element: 'el', //bind to the underlying el property on the panel
                    fn: function(){ console.log('click el'); }
                },
                dblclick: {
                    element: 'body', //bind to the underlying body property on the panel
                    fn: function(){ console.log('dblclick body'); }
                }
            }
        
        });

        this.initEditor();

        setTimeout(function() {
            Ext.get('loading').remove();
            Ext.get('loading-mask').fadeOut({remove:true});
        }, 100);
    },

    initEditor: function() {
    	var me = this;
    	var fd_fcid =getUrlParam('fd_fcid');
    	var xmlInfo = '';
    	Ext.Ajax.request({
		    url: basePath + 'oa/flow/getFlowChart.action',
		    params: {
		        fcid: fd_fcid
		    },
		    success: function(response){
		    	var text = new Ext.decode(response.responseText);
		    	var text = text.data;
		         xmlInfo = text.xmlInfo;
		         var xml = xmlInfo;
		         if(!xmlInfo){
		        	/*xml = "<process  xmlns='http://jbpm.org/4.4/jpdl' name='sale'> "+
		     		"<start g='253,67,48,48' name='start 1'>"+
		     		"<transition to='end 1'/></start>"+
		     		"<end g='247,239,48,48' name='end 1'/></process>";*/
		         }
		         var editor = new Gef.jbs.ExtEditor();
		         var input = new Gef.jbs.JBSEditorInput();
		         input.readXml(xml);
		         me.workbenchWindow.getActivePage().openEditor(editor, input);
		         me.workbenchWindow.render();
		         Gef.activeEditor = editor;
		         var data = {};
		         data.pr_defname = text.shortName;
		         data.pr_caller = text.caller;
		         data.pr_descn = text.remark;
	   			 var Object = {
		   			flowName : data.pr_defname,
		   			flowCaller : data.pr_caller,
		   			flowRemark : data.pr_descn
	   			 }
                 me.propertyManager.initSelectionListener2(Gef.activeEditor,Object);
                 formCaller = text.caller;
		      }
			});
       
    	/*console.log(xmlInfo);
        var editor = new Gef.jbs.ExtEditor();
        var input = new Gef.jbs.JBSEditorInput();
        input.readXml(xmlInfo);
       
        //var workbenchWindow = new Gef.ui.support.DefaultWorkbenchWindow();
        this.workbenchWindow.getActivePage().openEditor(editor, input);
        this.workbenchWindow.render();
        Gef.activeEditor = editor;
        this.propertyManager.initSelectionListener(editor);  
       // Ext.getCmp('pr_constructor').setValue(en_uu); 设置操作人
*/    },

    getProcessModel: function() {
        var viewer = Gef.activeEditor.getGraphicalViewer();
        var processEditPart = viewer.getContents();
        return processEditPart.model;
    },

    createNorth: function() {
        var p = null;
        if (Gef.MODE_DEMO === true) {
            p = new Ext.Panel({
                region: 'north'
            });
        } else {
            p = new Ext.Panel({
                region: 'north'				
            });
        }

        App.northPanel = p;
        return p;
    },

    createSouth: function() {
        var p = this.propertyManager.getBottom();
        return p;
    },

    createWest: function() {
        var p = new App.PalettePanel({
            collapsible: true  //修复bug 可以伸缩  zhouy
        });

        App.westPanel = p;
        return p;
    },

    createEast: function() {
        var p = this.propertyManager.getRight();
        p.on('render',function(){
        	p.getEl().on('mouseover',function(){
        		Gef.activeEditor.disable();
        	});
        	 p.getEl().on('mouseout',function(){
        		 //查找 window是否有window弹出
        		 if(!Gef.activeEditor.existWin){
        			 Gef.activeEditor.enable();
        		 }
        		 
        		 
             });
        	},this); 
        return p;
    },

    createCenter: function() {
        var p = new App.CanvasPanel();
        App.centerPanel = p;
       
        return p;
    },

    getSelectionListener: function() {
        if (!this.selectionListener) {
            this.selectionListener = new Gef.jbs.ExtSelectionListener(null);
        }
        return this.selectionListener;
    }
};

/*
Gef.override(App.PalettePanel, {
    configItems: function() {
        this.html = 'sdfasfdfdsa';
    }
});
*/

//Gef.PALETTE_TYPE = 'plain';
Gef.PALETTE_TYPE = 'accordion';

Ext.onReady(App.init, App);

Gef.DEPLOY_URL = '../../console/d!deployJpdl.do';
Gef.SAVE_URL = '../../console/d!saveJpdl.do';

App.CanvasPanel = Ext.extend(Ext.Panel, {
	id:'canvaspanel',
	xmlValidate:function(){
	var xmlString = arguments[0];
	var xmlDoc = null;
try //IE 浏览器
  {
  xmlDoc=new ActiveXObject("Microsoft.XMLDOM");
  xmlDoc.async="false";
  xmlDoc.loadXML(xmlString);
  }
catch(e)
  {
	console.log(e.message);
  try //Firefox, Mozilla, 浏览器
    {
    /*parser=new DOMParser();
    xmlDoc=parser.parseFromString(xmlString,"text/xml");
    var tasks = xmlDoc.getElementsByTagName('task');
    for(var i=0;i<tasks.length;i++){        // 对任务节点的校验……
    	var transitions = tasks[i].getElementsByTagName('transition');
    	if(transitions.length!=2){
    		Ext.Msg.alert("温馨提示","任务".fontcolor("Red").fontsize(5)+new String(tasks[i].getAttribute('name')).fontcolor("Red").fontsize(5)+"只能有"+"两".fontcolor("Red")+"条"+"流出".fontcolor("Red")+"连线");
    		return false;
    	}
    	for(var j=0;j<transitions.length;j++){
    		var name = transitions[j].getAttribute('name');
    		console.log(name);
    		if(name!='同意'&&name!='不同意'){
    			Ext.Msg.alert("温馨提示","任务".fontcolor("Red").fontsize(5)+new String(tasks[i].getAttribute('name')).fontcolor("Red").fontsize(5)+" 的流出连线名称必须为“同意” 或 “不同意” !");
    			return false;
    			
    		}
    	}
    }
    
    var sqls = xmlDoc.getElementsByTagName('sql'); //对sql 节点的校验……
    for(var i=0;i<sqls.length;i++){
    	var querys = sqls[i].getElementsByTagName('query');
    	console.log(querys);
    	if(querys.length<1){
    		Ext.Msg.alert("温馨提示",new String(sqls[i].getAttribute('name')).fontcolor("Red").fontsize(5)+"节点的查询语句未设置!");
			return false;
    	}
    	for(var j=0;j<querys.length;j++){
    		var sqlString = new String(querys[j].childNodes[0].nodeValue);
    		console.log("sql节点的 sql查询语句"+sqlString);
    		if(sqlString.indexOf("drop")>=0||sqlString.indexOf("insert")>=0||sqlString.indexOf('delete')>=0){
    			
    			Ext.Msg.alert("温馨提示",new String(sqls[i].getAttribute('name')).fontcolor("Red").fontsize(5)+"节点的查询语句中含有敏感字符 !");
    			return false;
    		}
    		if(sqlString.indexOf("select")<0||sqlString.indexOf("from")<0){
    			Ext.Msg.alert("温馨提示",new String(sqls[i].getAttribute('name')).fontcolor("Red").fontsize(5)+"节点的查询语句语法错误 !");
    			return false;
    		}
    	}
        var transitions = sqls[i].getElementsByTagName('transition');
        if(transitions.length>1){
        	Ext.Msg.alert("温馨提示",new String(sqls[i].getAttribute('name')).fontcolor("Red").fontsize(5)+" 节点不能有两条及以上的流出连线 !");
        	return false;
        }
    }
    
    var decisions = xmlDoc.getElementsByTagName('decision'); //对 decision 节点的校验……
    for(var i=0;i<decisions.length;i++){
    	var expr = decisions[i].getAttribute('expr');
    	console.log(expr);
    	if(!expr){
    		transitions = decisions[i].getElementsByTagName('transition');
    		for(var j=0;j<transitions.length;j++){
    			conditions = transitions[j].getElementsByTagName('condition');
    			if(conditions.length!=1){
    				Ext.Msg.alert("温馨提示",new String(decisions[i].getAttribute('name')).fontcolor("Red").fontsize(5)+" 节点分支条件设置错误  !");
		        	return false;
    			}else{
    				var condition = transitions[j].getElementsByTagName('condition')[0];
    				var exp = new String(condition.getAttribute("expr"));
    				if(exp.indexOf("#{")<0){  // 校验……………………
    					Ext.Msg.alert("温馨提示",new String(decisions[i].getAttribute('name')).fontcolor("Red").fontsize(5)+" 节点分支条件设置错误  !");
			        	return false;
    				}
    			}
    		}
    	}
    }*/
    
    return true;
    }
  catch(e) {alert(e.message); return false;}
  }
},
    initComponent: function() {
        //this.on('bodyresize', function(p, w, h) {
        //    var b = p.body.getBox();
        //});
    	
        this.region = 'center';
        this.autoScroll = true;
        var mater=null;
        var contents=null;//行选择之后的xml
        var resetlength=null;//新建之后的xml的长度
        this.tbar = new Ext.Toolbar([{
            text: '新建',
            hidden:true,
            iconCls: 'tb-new',
            handler: function() {
            	App.propertyManager.initSelectionListener(Gef.activeEditor);
            	var model=Gef.activeEditor.getGraphicalViewer().getRootEditPart().getContents().getModel();
            	if(model.dom.getAttribute('data')){
            	model.dom.removeAttribute('data');	
            	}
            	Ext.getCmp('FirstForm').getForm().reset();
            	Gef.activeEditor.reset();
                resetlength=Gef.activeEditor.serial().length;
                contents=null; 
               
            }
        }, {
            text: '导入',
            iconCls: 'tb-webform',
            handler: function() {
                var xml = Gef.activeEditor.serial();
                if (!this.openWin) {
                    this.openWin = new Ext.Window({
                        title: 'xml',
                        layout: 'fit',
                        width: 500,
                        height: 300,
                        closeAction: 'hide',
                        modal: true,
                        items: [{
                            id: '__gef_jbpm4_xml_import__',
                            xtype: 'textarea'
                        }],
                        buttons: [{
                            text: '导入',
                            handler: function() {
                                var xml = Ext.getDom('__gef_jbpm4_xml_import__').value;
                                Gef.activeEditor.resetAndOpen(xml);
                                this.openWin.hide();
                                var viewer = Gef.activeEditor.getGraphicalViewer();
                                var browserListener = viewer.getBrowserListener();
                                var editor=Gef.activeEditor;
                                var data=Ext.getCmp('FirstForm').getForm().getValues();
                                data = {
                                	flowName : data.pr_defname,
						   			flowCaller : data.pr_caller,
						   			flowRemark : data.pr_descn
                                },
                                App.propertyManager.initSelectionListener2(Gef.activeEditor,data);
                            },
                            scope: this
                        }, {
                            text: '取消',
                            handler: function() {
                                this.openWin.hide();
                            },
                            scope: this
                        }]
                    });
                    this.openWin.on('show', function() {
                        Gef.activeEditor.disable();
                    });
                    this.openWin.on('hide', function() {
                        Gef.activeEditor.enable();
                    });
                }
                this.openWin.show(null, function() {
                    Ext.getDom('__gef_jbpm4_xml_import__').value = xml;
                });
            }
        }, {
            text: '导出',
            iconCls: 'tb-prop',
            handler: function() {
                var xml = Gef.activeEditor.serial();
                xml=xml.replace('\n','');
                if (!this.openWin) {
                    this.openWin = new Ext.Window({
                        title: 'xml',
                        layout: 'fit',
                        width: 500,
                        height: 300,
                        closeAction: 'hide',
                        modal: true,
                        items: [{
                            id: '__gef_jbpm4_xml_export__',
                            xtype: 'textarea'
                        }],
                        buttons: [{
                            text: '关闭',
                            handler: function() {
                                this.openWin.hide();
                            },
                            scope: this
                        }]
                    });
                    this.openWin.on('show', function() {
                        Gef.activeEditor.disable();
                    });
                    this.openWin.on('hide', function() {
                        Gef.activeEditor.enable();
                    });
                }
                this.openWin.show(null, function() {
                     Ext.getDom('__gef_jbpm4_xml_export__').value = xml;
                	/*document.getElementById('__gef_jbpm4_xml_export__').value=xml;*/
                	 
                });
            }
        },  {
            text: '保存',
            iconCls: 'tb-save',
            handler: function() {
            	//重复保存的情况 form 1.修改。。。Ext.getCmp('FirstForm').getForm().isDirty()
            	//  2.xml文件做了修改 了contents resetlength=44;
                var editor = Gef.activeEditor;
                var xml = editor.serial(); 
              /*  var str='<?xml version="1.0" encoding="UTF-8"?>\n'+xml;*/
               /* var param=str.replace("data='[object Object]'","");*/
                //Ext.Msg.wait('正在校验。。。');
                
                var result =Ext.getCmp('canvaspanel').xmlValidate(xml);// 自定义校验 
                if(!result){
                	return ;
                }else{
                	console.log("自定义 校验通过，可以正常保存 !");
                }
                
                var model=editor.getGraphicalViewer().getRootEditPart().getContents().getModel();
                //检验页面元素是否填写正确
                 // alert(Ext.getCmp('FirstForm'));
                App.propertyManager.initSelectionListener(editor);//add 选中面板便于拿到form 不是最好的解决办法 2012-08-21
                var form=Ext.getCmp('FirstForm');
               // if(resetlength==44||contents!=param||contests=param&&form.getForm().isDirty()){
                var isValid = new Validation(editor).validate();//可以对空xml进行校验
                if (!isValid) {
                    return false;
                }               
                //对form进行校验  
                if(form.getForm().isValid()){	
                	 if(!form.getForm().isDirty()){
                		var r = form.getForm().getValues();
                		 if(r.pr_caller==null||r.pr_defname==null||r.pr_caller==''||r.pr_defname==''){
                			 Ext.Msg.alert("提示","请填写右边属性面板必填项！");
                			 return;
                		 }
                		var xml2 ="";
                		  if(xml.indexOf('data=')!=-1){
                			
                        	  xml2 = xml.replace("data='[object Object]'","name='"+r.pr_defname+"'");
                        	  
                          }  
                    Ext.Msg.wait('正在保存...');
                	 Ext.Ajax.request({//保存前校验 
                    	  method: 'post',
                          url: basePath+'oa/flow/checkNodeAndOpt.action',
                          success: function(response) {
                          	  var o = null;
                              try {
                                  o = Ext.decode(response.responseText);
                                  if (o.success === true) {
                                  	Ext.Ajax.request({//保存流程数据到FLOW_CHART表中，存在则修改 
			                    	  method: 'post',
			                          url: basePath+'common/saveFlowChart.action',
			                          success: function(response) {
			                        	  var o = null;
			                              try {
			                                  o = Ext.decode(response.responseText);
			                                  if (o.success === true) {
			                                  	Ext.Msg.alert('提示', '保存成功!');
				                                  	//更新flow_define 关联id
				                                  	var fd_fcid = o.id;
				                                  	Ext.Ajax.request({
								                    	  method: 'post',
								                          url: basePath+'oa/flow/updateInstanceChartId.action',
								                          success: function(response) {
								                          	  
								                          },
								                          failure: function(response) {
								                        	  var o = Ext.decode(response.responseText);
								                        	  Ext.Msg.alert('提示','更新流程表失败请重新保存');
								                          },
								                          params: {
								                              id: fd_id,
								                              fcid:fd_fcid
								                          }
				                                  	});
			                                  } else {
			                                      Ext.Msg.alert('错误', o.errors.msg);
			                                  }
			                              } catch(e) {                                  
			                            	  if(o.exceptionInfo){
			                            		  showError(o.exceptionInfo);
			                            	  }
			                            	  Ext.Msg.alert('保存失败','请检查 xml文件格式！' );
			                              }
			                          },
			                          failure: function(response) {
			                        	  var o = Ext.decode(response.responseText);
			                        	  Ext.Msg.alert('保存失败','请检查 xml文件格式！'+o.exceptionInfo );
			                          },
			                          params: {
			                              shortName: shortName,
			                              remark: model.pr_descn,
			                              caller:model.pr_caller,
			                              name:fd_name,
			                              xml: xml
			                          }
			                        });
                                  }else {
                                  	Ext.Msg.alert('错误', o.errors.msg);
                                  	return;
                                  }
                              } catch(e) {                                  
                            	  if(o.exceptionInfo){
                            		  showError(o.exceptionInfo);
                            	  }
                            	  Ext.Msg.alert('保存失败','请检查 xml文件格式！' );
                              }
                          },
                          failure: function(response) {
                        	  var o = Ext.decode(response.responseText);
                        	  Ext.Msg.alert('保存失败',o.exceptionInfo );
                          },
                          params: {
                              shortName: shortName,
                              allNode: JSON.stringify(allNode),
                              allConnection: JSON.stringify(allConnection)
                           }
                     });
                   }else{
                	   alert("请填写右边属性面板必填项！");
                   }
                }else{
                   Ext.Msg.alert('提示','请填写右边必填条款!');	
                }
              
            }
        },/**{
        	text:'查看',
        	iconCls:'tb_find',
        	handler:function(){
        		resetlength=null;
        		var editor = Gef.activeEditor;
        		 var model=editor.getGraphicalViewer().getRootEditPart().getContents().getModel();
        		 Ext.Ajax.request({//拿到grid的数据总数count
        	        	url : basePath + 'common/datalistCount.action',
        	        	params: {
        	        		caller:'Process',
        	        		condition: "1=1",
        	        	},
        	        	method : 'post',
        	        	callback : function(options,success,response){
        	        		var res = new Ext.decode(response.responseText);
        	        		var dataCount = res.count;
        	        		Ext.Ajax.request({//拿到tree数据
                            	url : basePath+'common/datalist.action',
                            	params: {
                            		caller: 'Process',
                            		condition: '1=1',
                            		page: 1,
                            		pageSize: 20
                            	},
                            	method:'post',
                            	callback : function(options,success,response){
                            		res = new Ext.decode(response.responseText);
                            		var data=(res.data).replace(/,}/g,"}");
                            		var store= new Ext.data.JsonStore({
                        				fields : res.fields,
                            			data:Ext.decode(data),
                       				    autoLoad : true,                        			
                        			});
                            		var grid = new Ext.grid.GridPanel({
                            			id:'grid',
                            			width:600,
                              		    height:300,
                            		    autoExpandColumn:true,
                            		    stripeRows:true,
                              		    border:true,
                              		    title:'ERP流程列表',
                              		    columns:res.columns,
                              		    iconCls:'icon-grid',
                              		    store: store,                    
                            		    viewConfig: {
                            		        forceFit: true
                            		    },
                            		    listeners:{
                                        	'rowclick':function(grid,row, e){                       
                                        		var k=grid.getSelectionModel();
                                        		Ext.getCmp('win').close();
                                        		//Ext.getCmp('FirstForm').getForm().setValues(k.selections.items[0].data);
                                        		//拿到Xml字符串 向后台传回一个id 在拿到contents
                                        		var Id=k.selections.items[0].data.pr_id;
                                        	      Ext.Ajax.request({//拿到tree数据
                                                    	url : basePath+'common/process/getContentsById.action',
                                                    	params: {
                                                    		 param:Id,
                                                    	},
                                                    	method:'post',
                                                    	callback : function(options,success,response){
                                                    		res = new Ext.decode(response.responseText);
                                                    		if(res.success){ 
                                                    			contents=res.contents;
                                                    			
                                                   			  var editor = Gef.activeEditor;
//                                                    			var model=editor.getGraphicalViewer().getRootEditPart().getContents().getModel();
                                                    			Ext.getCmp('FirstForm').getForm().setValues(k.selections.items[0].data);
                                                    			Gef.activeEditor.resetAndOpen(res.contents);
                                                    			var data=Ext.getCmp('FirstForm').getForm().getValues();
                                                    			App.propertyManager.initSelectionListener2(editor,data);
                                                    		
                                                    		}else{
                                                    			Ext.Msg.alert('提示','操作失败!');
                                                    		}
                                                    	}
                                                    });
                                        		
                                        	}
                                        	
                                        },
                            		});
                                    var win = new Ext.Window({
                                    	id :'win',
                                        title: '人事',
                                        layout: 'fit',
                                        height: 500,
                                        width: 600,
                                        closeAction: 'hide',
                                        modal: true,
                                        items: [grid],                                        
                                        listeners:{
                                        	'beforehide':function(c){
                                        		Gef.activeEditor.enable();
                                        	},
                                        	'beforeshow':function(c){          		
                                        		 Gef.activeEditor.disable();
                                        	}
                                        	
                                        },
                                    });
                                    win.show();
                            		
        	        	       }
        	        		});
        	        	}
        	        });
        	},
          scope:this,
        
        },**/{
            text: '发布',
            hidden:true,
            iconCls: 'tb-deploy',
            deployProcess:function(caller){
            	/*console.log(caller);*/
            	Ext.Ajax.request({
        			method: 'post',
        			 params: {
                         caller:caller
                       },
        			url: basePath+'common/exitsJProcessDeploy.action',
        			success: function(response) {
        				try {
        					var o = Ext.decode(response.responseText);
        					if (o.result=== true) {
        						var processDefId = o.processDefId;
        						var version = processDefId.substring(processDefId.lastIndexOf("-")+1);
        						Ext.Msg.alert('信息', '操作成功, 你的流程定义编号为:'+o.processDefId+" ,版本号为:"+version);
        					} else if(o.result==false){
        							/*Ext.Msg.alert('错误', o.errors.msg);*/
        							Ext.Msg.alert('提示',"不存在该表单对应的流程 ,请先设计流程,保存后再发布！");
        							return ;
        						}
        						} catch(e) {
        							/*console.log(caller);*/
        							Ext.Msg.alert('系统错误', response.responseText);
        					}	
        				},
        			failure: function(response) {
        				/*console.log(caller);*/
        				Ext.Msg.alert('系统错误', response.responseText);
        			}
          
            	});
            	
            },
            handler: function() {
            	var me = this;
            	var counter = 0;
            	var win = new Ext.Window({
            		  title: '请填写流程对应的表单名称',
                      layout: 'fit',
                      height: 95,
                      width: 300,
                      closeAction: 'hide',
                      modal: true,
                      items:[{
                    	  xtype:'textfield',
                    	  id :'caller'	  
                    	  }],
                      buttonAlign:'center',	  
                      buttons: [{
                    	  text:'确定发布',
                    	  handler:function(){
                    		  var value  = Ext.getCmp("caller").getValue();
                    		  if(value==null||value==''){
                    			  alert("请先填写表单名称");
                    			  return ;
                    		  }
                    		  else{
                    			  if(counter == 0){
                    				  me.deployProcess(value);
                    				  counter = counter+1;
                    			  }
                    			  else{
                    				  /*Ext.Msg.alert("提示","你已经发布该流程,不能重复发布！");*/
                    				  Ext.Msg.alert("提示","请勿重复操作！");
                    				  counter = 0;
                    			  }
                    			  
                    		  }
                    		  }	  
                    	  }]
                      
            		
            	});
            	win.show();
            	
            	/* var editor = Gef.activeEditor;

                 var isValid = new Validation(editor).validate();
                 if (!isValid) {
                     return false;
                 }
                
                 var xml = editor.serial();
                 var model = editor.getGraphicalViewer().getContents().getModel();
                 console.log(model);
                 //var name = model.text;
                 var jdId =getUrlParam('jdId');
                 Ext.Msg.wait('正在发布');
                 var editor = Gef.activeEditor;

                var isValid = new Validation(editor).validate();
                if (!isValid) {
                    return false;
                }
                var xml = editor.serial();
                var model = editor.getGraphicalViewer().getContents().getModel();
                console.log(model);
                //var name = model.text;
                Ext.Msg.wait('正在发布');
                Ext.Ajax.request({
                    method: 'post',
                    url: basePath+'common/getJProcessDeployInfo.action',
                    success: function(response) {
                        try {
                            var o = Ext.decode(response.responseText);
                                var processDefId = o.processDefId;
                                var version = processDefId.substring(processDefId.lastIndexOf("-")+1);
                            	Ext.Msg.alert('信息', '操作成功, 你的流程定义编号为:'+o.processDefId+" ,版本号为:"+version);
                        } catch(e) {
                            Ext.Msg.alert('系统错误', response.responseText);
                        }
                    },
                    failure: function(response) {
                    	Ext.Msg.alert('系统错误', response.responseText);
                    },
                  	params: {
                       jdId:jdId
                    }
               });*/
            }
        }, {
            text: '清空',
            iconCls: 'tb-clear',
            handler: function() {
                Gef.activeEditor.clear();
            }
        }, {
            text: '撤销',
            iconCls: 'tb-undo',
            handler: function() {
                var viewer = Gef.activeEditor.getGraphicalViewer();
                var browserListener = viewer.getBrowserListener();
                var selectionManager = browserListener.getSelectionManager();
                selectionManager.clearAll();
                var commandStack = viewer.getEditDomain().getCommandStack();
                commandStack.undo();
            },
            scope: this
        }, {
            text: '重做',
            hidden:true,
            iconCls: 'tb-redo',
            handler: function() {
                var viewer = Gef.activeEditor.getGraphicalViewer();
                var model=viewer.getContents().getModel();
                var browserListener = viewer.getBrowserListener();
                var selectionManager = browserListener.getSelectionManager();              
               selectionManager.selectIn((model.children)[2]);
//                selectionManager.clearAll();
//                var commandStack = viewer.getEditDomain().getCommandStack();
//                commandStack.redo();
            },
            scope: this
        }, {
            text: '布局',
            iconCls: 'tb-activity',
            handler: function() {

                var viewer = Gef.activeEditor.getGraphicalViewer();
                var browserListener = viewer.getBrowserListener();
                var selectionManager = browserListener.getSelectionManager();
                selectionManager.clearAll();

                new Layout(Gef.activeEditor).doLayout();
            },
            scope: this
        },{
            text: '删除',
            hidden:false,
            iconCls: 'tb-delete',
            handler: this.removeSelected,
            scope: this
        },{
        	text:'流程删除',
        	hidden:true,
        	iconCls: 'tb-delete',
            handler: function(btn){
            	Ext.MessageBox.show({
                 	title: '提示',
                 	msg: '确认删除整个流程吗?',
                 	buttons: Ext.Msg.YESNO,
                 	icon: Ext.Msg.WARNING,
                 	fn:this.deleteProcess
            	});
            },
            scope: this
        }]);

        App.CanvasPanel.superclass.initComponent.call(this);
    },

    afterRender: function() {
        App.CanvasPanel.superclass.afterRender.call(this);

        var width = 3000;
        var height = 2500;

        Ext.DomHelper.append(this.body, [{
            id: '__gef_jbs__',
            tag: 'div',
            style: 'width:' + (width + 10) + 'px;height:' + (height + 10) + 'px;',
            children: [{
                id: '__gef_jbs_center__',
                tag: 'div',
                style: 'width:' + width + 'px;height:' + height + 'px;float:left;'
            }, {
                id: '__gef_jbs_right__',
                tag: 'div',
                style: 'width:10px;height:' + height + 'px;float:left;background-color:#EEEEEE;cursor:pointer;'
            }, {
                id: '__gef_jbs_bottom__',
                tag: 'div',
                style: 'width:' + (width + 10) + 'px;height:10px;float:left;background-color:#EEEEEE;cursor:pointer;'
            }]
        }]);

        var rightEl = Ext.fly('__gef_jbs_right__');
        rightEl.on('mouseover', function(e) {
            var t = e.getTarget();
            t.style.backgroundColor = 'yellow';
            t.style.backgroundImage = 'url(images/arrow/arrow-right.png)';
        });
        rightEl.on('mouseout', function(e) {
            var t = e.getTarget();
            t.style.backgroundColor = '#EEEEEE';
            t.style.backgroundImage = '';
        });
        rightEl.on('click', function(e) {
            Ext.fly('__gef_jbs__').setWidth(Ext.fly('__gef_jbs__').getWidth() + 100);
            Ext.fly('__gef_jbs_center__').setWidth(Ext.fly('__gef_jbs_center__').getWidth() + 100);
            Ext.fly('__gef_jbs_bottom__').setWidth(Ext.fly('__gef_jbs_bottom__').getWidth() + 100);

            Gef.activeEditor.addWidth(100);
        });

        var bottomEl = Ext.fly('__gef_jbs_bottom__');
        bottomEl.on('mouseover', function(e) {
            var t = e.getTarget();
            t.style.backgroundColor = 'yellow';
            t.style.backgroundImage = 'url(images/arrow/arrow-bottom.png)';
        });
        bottomEl.on('mouseout', function(e) {
            var t = e.getTarget();
            t.style.backgroundColor = '#EEEEEE';
            t.style.backgroundImage = '';
        });
        rightEl.on('click', function(e) {
            Ext.fly('__gef_jbs__').setHeight(Ext.fly('__gef_jbs__').getHeight() + 100);
            Ext.fly('__gef_jbs_center__').setHeight(Ext.fly('__gef_jbs_center__').getHeight() + 100);
            Ext.fly('__gef_jbs_right__').setHeight(Ext.fly('__gef_jbs_right__').getHeight() + 100);

            Gef.activeEditor.addHeight(100);
        });

       // this.body.on('contextmenu', this.onContextMenu, this);//取消面板上 右键 操作  2012-08-24
    },

    onContextMenu: function(e) {
        if (!this.contextMenu) {
            this.contextMenu = new Ext.menu.Menu({
                items: [{
                    text: '详细配置',
                    iconCls: 'tb-prop',
                    handler: this.showWindow,
                    scope: this
                }, {
                    text: '删除',
                    iconCls: 'tb-remove',
                    handler: this.removeSelected,
                    scope: this
                }]
            });
        }
        e.preventDefault();
        this.contextMenu.showAt(e.getXY());
    },

    showWindow: function() {
        App.propertyManager.changePropertyStatus('max');
    },
    deleteProcess:function(){
    	var id=parent.Ext.getCmp('jd_id').getValue();
    	if(id){
    	Ext.Ajax.request({
	   		url : basePath + 'common/deleteProcessDeploy.action',
	   		params: {
	   			id:id 
	   		},
	   		method : 'post',
	   		callback : function(options,success,response){	   		
	   			var localJson = new Ext.decode(response.responseText);
	   			if(localJson.exceptionInfo){
	   				showError(localJson.exceptionInfo);
	   			}
    			if(localJson.success){    				
    				Ext.Msg.alert('提示','删除成功!',function(){
    					parent.window.close();
    				});
    				
	   			}
	   		}
		});
    	}
    	
    },
    removeSelected: function() {
    	//取消选中
        var viewer = Gef.activeEditor.getGraphicalViewer();
        var browserListener = viewer.getBrowserListener();
        var selectionManager = browserListener.getSelectionManager();
        var edge = selectionManager.selectedConnection;
        var nodes = selectionManager.items;
        var request = {};
        if (edge != null) {
            request.role = {
                name: 'REMOVE_EDGE'
            };
            this.executeCommand(edge, request);
            selectionManager.removeSelectedConnection();
        }  if (nodes.length > 0) {
            //同时删除连线 ---2013-10-10 zhouy
            request.role={
            		name:'REMOVE_EDGE'
            };
            for(var i=0;i<nodes.length;i++){
            	if(nodes[i].incomingConnections.length>0){
            		for(var j=nodes[i].incomingConnections.length-1;j>=0;j--){
            			 this.executeCommand(nodes[i].incomingConnections[j], request);       			
            		}
            	}
            	if(nodes[i].outgoingConnections.length>0){
            		for(var k=nodes[i].outgoingConnections.length-1;k>=0;k--){
           			 this.executeCommand(nodes[i].outgoingConnections[k], request);          			
           		 }
            	}
            }
            request.role = {
                name: 'REMOVE_NODES',
                nodes: nodes
            };
            this.executeCommand(viewer.getContents(), request);            
            selectionManager.clearAll();
         }
    },

    executeCommand: function(editPart, request) {
        var command = editPart.getCommand(request);
        if (command != null) {
            Gef.activeEditor.getGraphicalViewer().getEditDomain().getCommandStack().execute(command);
        }
    }
});

/*
 * Compressed by JSA(www.xidea.org)
 */

Layout = function(editor) {
    this.editor = editor;
    this.processEditPart = editor.getGraphicalViewer().getContents();
    this.processModel = this.processEditPart.getModel();
};

Layout.prototype = {
    doLayout: function() {
        var diagram = new Diagram();
        diagram.init(this.processModel);

        var sorter = new TopologicalSorter(diagram);
        var sortedElements = sorter.getSortedElements();
        var sortedIds = [];
        for (var i = 0; i < sortedElements.length; i++) {
            sortedIds.push(sortedElements[i].id);
        }

        //console.info(sortedIds);

        var layouter = new LeftToRightGridLayouter(diagram, sortedIds);
        layouter.doLayout();

        var edgeMap = diagram.getEdgeMap();
        for (var edgeId in edgeMap) {
            var edge = edgeMap[edgeId];
            new EdgeLayouter(layouter.grid, edge);
        }

        diagram.updateModel();
    }
};

;

Diagram = function() {
};

Diagram.prototype = {
    getNodeMap: function() {
        return this.nodeMap;
    },

    getEdgeMap: function() {
        return this.edgeMap;
    },

    init: function(process) {
        this.process = process;
        this.nodeMap = {};
        this.edgeMap = {};

        for (var i = 0; i < this.process.children.length; i++) {
            var child = process.children[i];
            var node = new Node();
            node.id = child.text;
            node.type = child.type;
            node.x = child.x;
            node.y = child.y;
            node.w = child.w;
            node.h = child.h;

            this.nodeMap[node.id] = node;
        }

        for (var i = 0; i < this.process.children.length; i++) {
            var child = process.children[i];

            for (var j = 0; j < child.getOutgoingConnections().length; j++) {
                var connection = child.getOutgoingConnections()[j];
                this.createEdge(connection);
            }
        }
    },

    createEdge: function(connection) {
        var connectionId = connection.getSource().text + '_' + connection.getTarget().text;
        var edge = this.edgeMap[connectionId];
        if (!edge) {
            edge = new Edge();
            edge.id = connectionId;
            edge.name = connection.text;
            edge.source = this.nodeMap[connection.getSource().text];
            edge.target = this.nodeMap[connection.getTarget().text];

            edge.source.outgoingLinks.push(edge);
            edge.target.incomingLinks.push(edge);

            this.edgeMap[connectionId] = edge;
        }
    },

    updateModel: function() {
        for (var nodeId in this.nodeMap) {
            var item = this.nodeMap[nodeId];
            var model = this.getModel(nodeId);
            model.x = item.x;
            model.y = item.y;

            model.getEditPart().getFigure().x = model.x;
            model.getEditPart().getFigure().y = model.y;

            for (var i = 0; i < item.outgoingLinks.length; i++) {
                var connection = item.outgoingLinks[i];

                var connectionModel = this.getConnectionModel(model, connection);
                if (connectionModel == null) {
                    continue;
                }

                connectionModel.innerPoints = typeof connection.innerPoints == 'undefined' ? []
                                                : connection.innerPoints;
                connectionModel.textX = 0;
                connectionModel.textY = 0;
                connectionModel.getEditPart().getFigure().innerPoints = connectionModel.innerPoints;
                connectionModel.getEditPart().getFigure().textX = connectionModel.textX;
                connectionModel.getEditPart().getFigure().textY = connectionModel.textY;
            }
        }
        this.process.getEditPart().refresh();
    },

    getModel: function(name) {
        var model = null;

        Gef.each(this.process.children, function(item) {
            if (item.text == name) {
                model = item;
                return false;
            }
        });

        return model;
    },

    getConnectionModel: function(nodeModel, edge) {
        var model = null;

        Gef.each(nodeModel.getOutgoingConnections(), function(item) {
            if (item.getTarget().text == edge.getTarget().id) {
                model = item;
                return false;
            }
        });

        return model;
    }
};

;

// should be change name to LayoutingElement
Node = function() {
    this.incomingLinks = [];
    this.outgoingLinks = [];
};

Node.prototype = {
    getIncomingLinks: function() {
        return this.incomingLinks;
    },

    getOutgoingLinks: function() {
        return this.outgoingLinks;
    },

    getPrecedingElements: function() {
        var previousElements = [];
        for (var i = 0; i < this.incomingLinks.length; i++) {
            previousElements.push(this.incomingLinks[i].source);
        }
        return previousElements;
    },

    getFollowingElements: function() {
        var followingElements = [];
        for (var i = 0; i < this.outgoingLinks.length; i++) {
            followingElements.push(this.outgoingLinks[i].target);
        }
        return followingElements;
    },

    isJoin: function() {
        return this.incomingLinks.length > 1;
    },

    isSplit: function() {
        return this.outgoingLinks.length > 1;
    },

    prevSplit: function() {
        var distance = 1000;
        var candidateDistance = 0;
        var split = null;
        var candidate = null;

        var precedingElements = this.getPrecedingElements();
        for (var i = 0; i < precedingElements.length; i++) {
            var elem = precedingElements[i];
            if (elem.isSplit()) {
                return elem;
            }

            candidate = elem.prevSplit();
            if (this.isJoin()) {
                // if this is not a join, we have only one precedingElement.
                candidateDistance = elem.backwardDistanceTo(candidate);
            }
            if (candidateDistance < distance) {
                split = candidate;
                distance = candidateDistance;
            }
        }
        return split;
    },

    backwardDistanceTo: function(other) {
        return this._backwardDistanceTo(other, []);
    },

    _backwardDistanceTo: function(other, historyElements) {
        if (other == this) {
            return 0;
        }
        if (historyElements.indexOf(this) != -1) {
            return 1000;
        }
        var d = 1000;
        var newHistory = [];
        newHistory.push(this);
        var precedingElements = this.getPrecedingElements();
        for (var i = 0; i < precedingElements.length; i++) {
            var el = precedingElements[i];
            d = Math.min(d, el._backwardDistanceTo(other, newHistory));
        }
        return d == 1000 ? d : d + 1;
    }
};

;

Edge = function() {
    this.source = null;
    this.target = null;
};

Edge.prototype = {
    getSource: function() {
        return this.source;
    },

    getTarget: function() {
        return this.target;
    },

    reverseOutgoingAndIncoming: function() {

        var index = 0;

        var oldSource = this.source;
        var oldTarget = this.target;

        index = oldSource.outgoingLinks.indexOf(this);

        oldSource.outgoingLinks.splice(index, 1);

        index = oldTarget.incomingLinks.indexOf(this);
        oldTarget.incomingLinks.splice(index, 1);

        var newSource = oldTarget;
        var newTarget = oldSource;

        newSource.outgoingLinks.push(this);
        newTarget.incomingLinks.push(this);

        this.source = newSource;
        this.target = newTarget;

    }
};

;

TopologicalSorter = function(diagram) {
    this.diagram = diagram;
    this.prepareDataAndSort(true);
    this.prepareDataAndSort(false);
};

TopologicalSorter.prototype = {
    getSortedElements: function() {
        return this.sortedElements;
    },

    prepareDataAndSort: function(shouldBackpatch) {
        this.sortedElements = [];
        this.elementsToSort = {};
        this.backwardsEdges = [];
        this.elementsToSortCount = 0;

        this.addAllChildren();
        this.topologicalSort();
        if (shouldBackpatch === true) {
            this.backpatchBackwardsEdges();
        }

        this.reverseBackwardsEdges();
    },

    addAllChildren: function() {
        for (var nodeId in this.diagram.nodeMap) {
            var node = this.diagram.nodeMap[nodeId];
            this.elementsToSort[nodeId] = new SortableLayoutingElement(node);
            this.elementsToSortCount++;
        }
    },

    topologicalSort: function() {
        var count = 0;
        var oldCount = 0;
        while (this.elementsToSortCount > 0) {
            var freeElements = this.getFreeElements();

            if (freeElements.length > 0) {

                for (var i = 0; i < freeElements.length; i++) {
                    var freeElement = freeElements[i];
                    this.sortedElements.push(freeElement.node);
                    this.freeElementsFrom(freeElement);
                    delete this.elementsToSort[freeElement.node.id];
                }
            } else {

                var entry = this.getLoopEntryPoint();

                for (var i = 0; i < entry.incomingLinks.length; i++) {
                    var backId = entry.incomingLinks[i];
                    entry.reverseIncomingLinkFrom(backId);
                    var elem = this.elementsToSort[backId];
                    elem.reverseOutgoingLinkTo(entry.node.id);

                    this.backwardsEdges.push(new BackwardsEdge(backId, entry.node.id));
                }
            }
        }
    },

    backpatchBackwardsEdges: function() {
        var newBackwardsEdges = [];
        for (var i = 0; i < this.backwardsEdges.length; i++) {
            newBackwardsEdges.push(this.backwardsEdges[i]);
        }
        for (var i = 0; i < this.backwardsEdges.length; i++) {
            var edge = this.backwardsEdges[i];
            var sourceId = edge.getSource();
            var targetId = edge.getTarget();

            var sourceElement = this.diagram.nodeMap[sourceId];

            while (!(sourceElement.isJoin() || sourceElement.isSplit())) {
                var newSourceElement = sourceElement.getPrecedingElements()[0];

                targetId = newSourceElement.id;
                newBackwardsEdges.push(new BackwardsEdge(targetId, sourceId));

                sourceElement = newSourceElement;
                sourceId = targetId;
            }
        }

        this.backwardsEdges = newBackwardsEdges;
    },

    reverseBackwardsEdges: function() {
        var edgeMap = this.diagram.edgeMap;
        for (var i = 0; i < this.backwardsEdges.length; i++) {
            var backwardsEdge = this.backwardsEdges[i];

            var sourceId = backwardsEdge.getSource();
            var targetId = backwardsEdge.getTarget();

            var sourceElement = this.diagram.nodeMap[sourceId];
            var targetElement = this.diagram.nodeMap[targetId];

            var edge = this.getEdge(edgeMap, sourceElement, targetElement);

            backwardsEdge.setEdge(edge);

            if (edge) {
                // reverse edge outgoing and incoming
                edge.reverseOutgoingAndIncoming();
            }
        }
    },

    getFreeElements: function() {
        var freeElements = [];
        for (var nodeId in this.elementsToSort) {
            var elem = this.elementsToSort[nodeId];
            if (elem.isFree()) {
                freeElements.push(elem);
            }
        }
        return freeElements;
    },

    freeElementsFrom: function(freeElement) {
        for (var i = 0; i < freeElement.outgoingLinks.length; i++) {
            var id = freeElement.outgoingLinks[i];
            var targetElement = this.elementsToSort[id];
            if (targetElement) {
                targetElement.removeIncomingLinkFrom(freeElement.node.id);
            }
        }
        this.elementsToSortCount--;
    },

    getLoopEntryPoint: function() {
        for (var nodeId in this.elementsToSort) {
            var candidate = this.elementsToSort[nodeId];
            if (candidate.oldInCount > 1
                    && candidate.oldInCount > candidate.incomingLinks.length) {
                return candidate;
            }
        }
        throw new Error('Could not find a valid loop entry point');
    },

    getEdge: function(edgeMap, sourceElement, targetElement) {
        for (var i = 0; i < sourceElement.outgoingLinks.length; i++) {
            var edge = sourceElement.outgoingLinks[i];
            if (edge.getTarget().id == targetElement.id) {
                return edge;
            }
        }
        return null;
    }
};

;

SortableLayoutingElement = function(node) {
    this.node = node;
    this.incomingLinks = [];
    this.outgoingLinks = [];

    for (var i = 0; i < node.incomingLinks.length; i++) {
        this.incomingLinks.push(node.incomingLinks[i].source.id);
    }
    for (var i = 0; i < node.outgoingLinks.length; i++) {
        this.outgoingLinks.push(node.outgoingLinks[i].target.id);
    }

    this.oldInCount = this.incomingLinks.length;
    this.isJoin = node.isJoin();
};

SortableLayoutingElement.prototype = {
    isFree: function() {
        return this.incomingLinks.length == 0;
    },

    removeIncomingLinkFrom: function(sourceId) {
        var index = this.incomingLinks.indexOf(sourceId);
        this.incomingLinks.splice(index, 1);
    },

    reverseIncomingLinkFrom: function(id) {
        this.removeIncomingLinkFrom(id);
        this.outgoingLinks.push(id);
    },

    reverseOutgoingLinkTo: function(id) {
        var index = this.outgoingLinks.indexOf(id);
        this.outgoingLinks.splice(index, 1);
        this.incomingLinks.push(id);
    }
};

;

BackwardsEdge = function(source, target) {
    this.source = source;
    this.target = target;
};

BackwardsEdge.prototype = {
    getEdge: function() {
        return this.edge;
    },

    setEdge: function(edge) {
        this.edge = edge;
    },

    getSource: function() {
        return this.source;
    },

    getTarget: function() {
        return this.target;
    }
};

;

LeftToRightGridLayouter = function(diagram, sortedIds) {
    this.diagram = diagram;
    this.sortedIds = sortedIds;
};

LeftToRightGridLayouter.prototype = {
    doLayout: function() {
        this.grid = new Grid();

        this.layoutElements();

        this.calcGeometry(this.grid);
        this.writeGeometry(this.grid);

        this.diagram.updateModel();
    },

    layoutElements: function() {
        for (var i = 0; i < this.sortedIds.length; i++) {
            var sortedId = this.sortedIds[i];
            var currentElement = this.diagram.nodeMap[sortedId];
            var precedingElements = currentElement.getPrecedingElements();

            var cellOfElement = this.placeElement(currentElement, precedingElements);

            if (currentElement.isJoin() && precedingElements.length != 0) {
                // there is an edge hitting us left, so lets forbid
                // interleaving to use the left cell, if this is empty
                cellOfElement.getPrevCell().setPackable(false);
            }

            if (currentElement.isSplit()) {
                this.prelayoutSuccessors(currentElement, cellOfElement);
            }
        }
    },

    placeElement: function(currentElement, precedingElements) {
        var newCell = null;

        if (precedingElements.length == 0) {
            this.grid.startCell.value = currentElement;
            newCell = this.grid.startCell;
        } else {
            var leftCell = null;
            var newCell = this.grid.getCellOfItem(currentElement);

            if (currentElement.isJoin()) {
                var splitFound = false;

                var split = currentElement.prevSplit();
                if (split != null) {
                    var splits = new PriorityQueue(currentElement);
                    splits.add(split);
                    for (var i = 0; i < precedingElements.length; i++) {
                        var elem = precedingElements[i];
                        split = elem.prevSplit();
                        if (split != null && !splits.contains(split)) {
                            splits.add(split);
                            //console.info(splits.items);
                        }
                    }
                    split = null;
                    // get split with most connections
                    var maxCon = 0;
                    for (var i = 0; i < splits.items.length; i++) {
                        var target = splits.items[i];
                        if (target == currentElement) {
                            continue;
                        }
                        // current connections
                        var curCon = 0;
                        for (var j = 0; j < precedingElements.length; j++) {
                            var elem = precedingElements[j];
                            if (elem.backwardDistanceTo(target) < 1000) {
                                curCon++;
                            }
                        }
                        if (curCon > maxCon) {
                            maxCon = curCon;
                            split = target;
                        }
                    }
                    splitFound = split != null;
                }

                // current cell position
                var x = 0;
                var yAcc = 0;
                var yCnt = 0;
                for (var i = 0; i < precedingElements.length; i++) {
                    var elem = precedingElements[i];
                    var tmp = this.grid.getCellOfItem(elem);

                    if (tmp == null) {
                        tmp = {
                            getColIndex: function() {
                                return 0;
                            }
                        };
                    } else {
                        yAcc += tmp.getRowIndex();
                        yCnt++;
                    }
                    x = Math.max(x, tmp.getColIndex());
                }

                // farthest to the right
                if (splitFound) {
                    leftCell = this.grid.getCellOfItem(split).row.cells[x];

                    // set path to split unpackable
                    for (var c = leftCell; c.value != split; c = c.getPrevCell()) {
                        c.setPackable(false);
                    }
                } else {
                    if (yCnt == 0) {
                        leftCell = this.grid.rows[0].above().cells[x];
                    } else {
                        leftCell = this.grid.rows[yAcc / yCnt].cells[x];
                    }
                }

                if (newCell != null && newCell.value == currentElement) {
                    newCell.value = null;
                }
                newCell = leftCell.after();

                // set all incoming pathes unpackable

                for (var i = 0; i < precedingElements.length; i++) {
                    var el = precedingElements[i];
                    var target = this.grid.getCellOfItem(el);
                    if (target == null) {
                        continue;
                    }

                    var start = target.row.cells[x + 1];
                    for (var c = start; c != target; c = c.getPrevCell()) {
                        c.setPackable(false);
                    }
                }

            } else if (newCell == null) {
                // if not preLayouted
                var preElem = precedingElements[0];
                leftCell = this.grid.getCellOfItem(preElem);

                newCell = leftCell.after();
            }

            if (newCell.isFilled() && newCell.value != currentElement) {
                newCell.row.insertRowBeneath();
                newCell = newCell.beneath();
            }
            newCell.value = currentElement;
            newCell.getPrevCell().setPackable(false);
        }

        return newCell;
    },

    prelayoutSuccessors: function(currentElement, cellOfElement) {
        var baseCell = cellOfElement.after();
        var topCell = baseCell;
        var followingElements = currentElement.getFollowingElements();

        // heuristic for direct connection to join
        var directJoin = null;
        for (var i = 0; i < followingElements.length; i++) {
            var possibleJoin = followingElements[i];
            if (possibleJoin.isJoin()) {
                directJoin = possibleJoin;
            }
        }
        if (directJoin != null) {
            // put in the middle
            var index = followingElements.indexOf(directJoin);
            // remove
            followingElements.splice(index, 1);
            var position = parseInt(followingElements.length / 2, 10);
            // insert
            followingElements.splice(position, 0, directJoin);
        }

        // normal preLayout following elements
        var follow = parseInt(followingElements.length / 2, 10);
        for (var i = 0; i < follow; i++) {
            topCell.row.insertRowAbove();
            baseCell.row.insertRowBeneath();
            topCell = topCell.above();
        }

        for (var i = 0; i < followingElements.length; i++) {
            var newElem = followingElements[i];

            if (this.grid.getCellOfItem(newElem)) {
                continue;
            }

            topCell.value = newElem;
            topCell = topCell.beneath();
            if (topCell == baseCell && followingElements.length % 2 == 0) {
                topCell = topCell.beneath();
            }
        }
    },

    calcGeometry: function(grid) {
        grid.pack();

        var heightOfRow = [];
        for (var i = 0; i < grid.rowCount; i++) {
            heightOfRow.push(0);
        }
        var widthOfColumn = [];
        for (var i = 0; i < grid.colCount; i++) {
            widthOfColumn.push(0);
        }

        for (var i = 0; i < grid.rowCount; i++) {
            var row = grid.rows[i];

            for (var j = 0; j < grid.colCount; j++) {
                var cell = row.cells[j];
                if (cell.isFilled()) {
                    var elem = cell.value;
                    widthOfColumn[j] = Math.max(widthOfColumn[j], elem.w + 30);
                    heightOfRow[i] = Math.max(heightOfRow[i], elem.h + 30);
                }
            }
        }

        this.heightOfRow = heightOfRow;
        this.widthOfColumn = widthOfColumn;

        this.totalWidth = 0;
        this.totalHeight = 0;
        for (var i = 0; i < grid.colCount; i++) {
            this.totalWidth += widthOfColumn[i];
        }
        for (var i = 0; i < grid.rowCount; i++) {
            this.totalHeight += heightOfRow[i];
        }
    },

    writeGeometry: function(grid) {
        var x = 0;
        var y = 0;

        for (var i = 0; i < grid.rowCount; i++) {
            var row = grid.rows[i];

            var cellHeight = this.heightOfRow[i];

            for (var j = 0; j < grid.colCount; j++) {
                var cell = row.cells[j];

                var cellWidth = this.widthOfColumn[j];

                if (cell.isFilled()) {
                    var elem = cell.value;

                    var newX = x + cellWidth / 2 - elem.w / 2;
                    var newY = y + cellHeight / 2 - elem.h / 2;

                    elem.x = newX;
                    elem.y = newY;
                }
                x += cellWidth;
            }
            x = 0;
            y += cellHeight;
        }
    }
};

;

Grid = function() {
    var cell = new Cell();

    var row = new Row();
    row.grid = this;
    row.addCell(cell);

    this.rows = [row];

    this.startCell = cell;

    this.colCount = 1;
    this.rowCount = this.rows.length;
};

Grid.prototype = {
    addFirstRow: function() {
        var row = new Row();
        row.grid = this;
        for (var i = 0; i < this.rolCount; i++) {
            var cell = new Cell();
            row.addCell(cell);
        }
        this.rows.unshift(row);

        this.rowCount = this.rows.length;
    },

    addLastRow: function() {
        var row = new Row();
        row.grid = this;
        for (var i = 0; i < this.rolCount; i++) {
            row.addCell(new Cell());
        }
        this.rows.push(row);

        this.rowCount = this.rows.length;
    },

    addLastCol: function() {
        for (var i = 0; i < this.rowCount; i++) {
            var row = this.rows[i];

            row.addCell(new Cell());
        }

        this.colCount++;
    },

    getCellOfItem: function(elem) {
        for (var i = 0; i < this.rowCount; i++) {
            var row = this.rows[i];
            for (var j = 0; j < this.colCount; j++) {
                var cell = row.cells[j];
                if (cell.value == elem) {
                    return cell;
                }
            }
        }
        return null;
    },

    pack: function() {
        var changed = false;
        do {
            changed = false;
            for (var i = 0; i < this.rows.length; i++) {
                var row = this.rows[i];
                changed |= row.tryInterleaveWith(row.getPrevRow());
            }
            for (var i = 0; i < this.rows.length; i++) {
                var row = this.rows[i];
                changed |= row.tryInterleaveWith(row.getNextRow());
            }
        } while (changed);
    },

    info: function() {
        var value = '';
        for (var i = 0; i < this.rows.length; i++) {
            var row = this.rows[i];
            for (var j = 0; j < row.cells.length; j++) {
                var cell = row.cells[j];
                var id = '[    ]';
                if (cell.isFilled()) {
                    id = cell.value.id;
                } else if (cell.packable === false) {
                    id = '[ p  ]';
                }
                value += id;
            }
            value += '\n'
        }
        return value;
    }
};

;

Cell = function() {
    this.packable = true;
};

Cell.prototype = {
    isFilled: function() {
        return typeof this.value != 'undefined' && this.value != null;
    },

    isUnpackable: function() {
        return this.isFilled() || (this.packable === false);
    },

    setPackable: function(packable) {
        this.packable = packable;
    },

    getRowIndex: function() {
        return this.row.getIndex();
    },

    getColIndex: function() {
        for (var i = 0; i < this.row.cells.length; i++) {
            if (this.row.cells[i] == this) {
                return i;
            }
        }
    },

    after: function() {
        var colIndex = this.getColIndex();
        if (colIndex == this.row.cells.length - 1) {
            this.grid.addLastCol();
        }
        return this.row.cells[colIndex + 1];
    },

    above: function() {
        var rowIndex = this.getRowIndex();
        var colIndex = this.getColIndex();
        if (rowIndex == 0) {
            this.row.insertRowAbove();
        }
        return this.grid.rows[rowIndex - 1].cells[colIndex];
    },

    beneath: function() {
        var rowIndex = this.getRowIndex();
        var colIndex = this.getColIndex();
        if (rowIndex == this.grid.rowCount - 1) {
            this.row.insertRowBeneath();
        }
        return this.grid.rows[rowIndex + 1].cells[colIndex];
    },

    getPrevCell: function() {
        var index = this.getColIndex();
        return this.row.cells[index - 1];
    },

    getNextCell: function() {
        var index = this.getColIndex();
        return this.row.cells[index + 1];
    }
};

;

Row = function() {
    this.cells = [];
};

Row.prototype = {
    addCell: function(cell) {
        cell.row = this;
        cell.grid = this.grid;
        this.cells.push(cell);
    },

    getIndex: function() {
        for (var i = 0; i < this.grid.rows.length; i++) {
            if (this.grid.rows[i] == this) {
                return i;
            }
        }
    },

    insertRowBeneath: function() {
        var row = new Row();
        row.grid = this.grid;

        for (var i = 0; i < this.grid.colCount; i++) {
            row.addCell(new Cell());
        }

        var rowIndex = this.getIndex();
        var rows = this.grid.rows;

        if (rowIndex == rows.length - 1) {
            rows.push(row);
        } else {
            rows.splice(rowIndex + 1, 0, row);
        }

        this.grid.rowCount = rows.length;
    },

    insertRowAbove: function() {
        var row = new Row();
        row.grid = this.grid;

        for (var i = 0; i < this.grid.colCount; i++) {
            row.addCell(new Cell());
        }

        var rowIndex = this.getIndex();
        var rows = this.grid.rows;

        if (rowIndex == 0) {
            rows.unshift(row);
        } else {
            rows.splice(rowIndex, 0, row);
        }

        this.grid.rowCount = rows.length;
    },

    getPrevRow: function() {
        var index = this.getIndex();
        if (index > 0) {
            return this.grid.rows[index - 1];
        } else {
            return null;
        }
    },

    getNextRow: function() {
        var index = this.getIndex();
        if (index < this.grid.rows.length) {
            return this.grid.rows[index + 1];
        } else {
            return null;
        }
    },

    tryInterleaveWith: function(other) {
        if (!this.isInterleaveWith(other)) {
            return false;
        }

        for (var i = 0; i < this.cells.length; i++) {
            var cell = this.cells[i];
            var otherCell = other.cells[i];

            if (cell.isFilled()) {
                other.cells[i] = cell;
            } else if (cell.isUnpackable()) {
                otherCell.setPackable(false);
            }
        }

        this._remove();

        return true;
    },

    isInterleaveWith: function(other) {
        if (other == null || other == this) {
            return false;
        } else if (other.getPrevRow() != this && other.getNextRow() != this) {
            return false;
        }
        for (var i = 0; i < this.cells.length; i++) {
            var cell = this.cells[i];
            var otherCell = other.cells[i];
            if (cell.isUnpackable() && otherCell.isUnpackable()) {
                return false;
            }
        }
        return true;
    },

    _remove: function() {
        var index = this.getIndex();
        this.grid.rows.splice(index, 1);
        this.grid.rowCount--;
    }
};

;

PriorityQueue = function(center) {
    this.ce = center;
    this.items = [];
};

PriorityQueue.prototype = {
    add: function(element) {
        this.items.push(element);

        var len = this.items.length;
        for (var i = 0; i < len; i++) {
            for (var j = i; j < len; j++) {
                var elem1 = this.items[i];
                var elem2 = this.items[j];
                if (this.compareTo(elem1, elem2) > 0) {
                    this.items[i] = elem2;
                    this.items[j] = elem1;
                }
            }
        }
    },

    compareTo: function(elem1, elem2) {
        return this.ce.backwardDistanceTo(elem1) - this.ce.backwardDistanceTo(elem2);
    },

    contains: function(element) {
        return this.items.indexOf(element) != -1;
    }
};

;

EdgeLayouter = function(grid, edge) {
    this.grid = grid;
    this.edge = edge;

    edge.innerPoints = [];

    this.calculateGlobals();
    this.pickLayoutForEdge();
};

EdgeLayouter.prototype = {
    calculateGlobals: function() {
        this.source = this.edge.source;
        this.target = this.edge.target;

        this.sourceRelativeCenterX = this.source.w / 2;
        this.sourceRelativeCenterY = this.source.h / 2;
        this.targetRelativeCenterX = this.target.w / 2;
        this.targetRelativeCenterY = this.target.h / 2;

        this.sourceAbsoluteCenterX = this.source.x + this.sourceRelativeCenterX;
        this.sourceAbsoluteCenterY = this.source.y + this.sourceRelativeCenterY;
        this.targetAbsoluteCenterX = this.target.x + this.targetRelativeCenterX;
        this.targetAbsoluteCenterY = this.target.y + this.targetRelativeCenterY;

        this.sourceAbsoluteX = this.source.x;
        this.sourceAbsoluteY = this.source.y;
        this.sourceAbsoluteX2 = this.source.x + this.source.w;
        this.sourceAbsoluteY2 = this.source.y + this.source.h;

        this.targetAbsoluteX = this.target.x;
        this.targetAbsoluteY = this.target.y;
        this.targetAbsoluteX2 = this.target.x + this.target.w;
        this.targetAbsoluteY2 = this.target.y + this.target.h;

        this.sourceJoin = this.source.isJoin();
        this.sourceSplit = this.source.isSplit();
        this.targetJoin = this.target.isJoin();
        this.targetSplit = this.target.isSplit();

        this.backwards = this.sourceAbsoluteCenterX > this.targetAbsoluteCenterX;
    },

    pickLayoutForEdge: function() {
        // sourceX == targetX, up and down
        if (this.sourceAbsoluteCenterX == this.targetAbsoluteCenterX) {
            this.setEdgeDirectCenter();
            return;
        } else if (this.sourceAbsoluteCenterY == this.targetAbsoluteCenterY) {
            if (this.areCellsHorizontalFree()) {
                this.setEdgeDirectCenter();
            } else {
                this.setEdgeAroundTheCorner(true);
            }
            return;
        }

        if (this.sourceAbsoluteCenterX <= this.targetAbsoluteCenterX
                && this.sourceAbsoluteCenterY <= this.targetAbsoluteCenterY) {
            // target is right under
            if (this.sourcejoin && this.sourceSplit) {
                this.setEdgeStepRight();
                return;
            } else if (this.sourceSplit) {
                this.setEdge90DegreeRightUnderAntiClockwise();
                return;
            } else if (this.targetJoin) {
                this.setEdge90DegreeRightUnderClockwise();
                return;
            }
        } else if (this.sourceAbsoluteCenterX <= this.targetAbsoluteCenterX
                && this.sourceAbsoluteCenterY > this.targetAbsoluteCenterY) {
            // target is right above
            if (this.sourcejoin && this.sourceSplit) {
                this.setEdgeStepRight();
                return;
            } else if (this.sourceSplit) {
                this.setEdge90DegreeRightAboveClockwise();
                return;
            } else if (this.targetJoin) {
                this.setEdge90DegreeRightAboveAntiClockwise();
                return;
            }
        }

        if (this.sourceJoin && sourceSplit && (!this.backwards)) {
            this.setEdgeStepRight();
            return;
        }

        if (this.sourceJoin && sourceSplit) {
            this.setEdgeAroundTheCorner(true);
            return;
        }

        this.setEdgeDirectCenter();
    },

    areCellsHorizontalFree: function() {
        var fromCell = null;
        var toCell = null;
        if (this.sourceAbsoluteCenterX < this.targetAbsoluteCenterX) {
            fromCell = this.grid.getCellOfItem(this.source);
            toCell = this.grid.getCellOfItem(this.target);
        } else {
            fromCell = this.grid.getCellOfItem(this.target);
            toCell = this.grid.getCellOfItem(this.source);
        }

        fromCell = fromCell.getNextCell();
        while (fromCell != toCell) {
            if (fromCell == null || fromCell.isFilled()) {
                return false;
            }
            fromCell = fromCell.getNextCell();
        }

        return true;
    },

    setEdgeDirectCenter: function() {
        var boundsMinX = Math.min(this.sourceAbsoluteCenterX,
                                  this.targetAbsoluteCenterX);
        var boundsMinY = Math.min(this.sourceAbsoluteCenterY,
                                  this.targetAbsoluteCenterY);
        var boundsMaxX = Math.max(this.sourceAbsoluteCenterX,
                                  this.targetAbsoluteCenterX);
        var boundsMaxY = Math.max(this.sourceAbsoluteCenterY,
                                  this.targetAbsoluteCenterY);
        // this.edge.innerPoints = [];
    },

    setEdge90DegreeRightAboveClockwise: function() {
        this.edge.innerPoints = [
            [this.sourceAbsoluteCenterX, this.targetAbsoluteCenterY]
        ];
    },

    setEdge90DegreeRightAboveAntiClockwise: function() {
        this.edge.innerPoints = [
            [this.targetAbsoluteCenterX, this.sourceAbsoluteCenterY]
        ];
    },

    setEdge90DegreeRightUnderClockwise: function() {
        this.edge.innerPoints = [
            [this.targetAbsoluteCenterX, this.sourceAbsoluteCenterY]
        ];
    },

    setEdge90DegreeRightUnderAntiClockwise: function() {
        this.edge.innerPoints = [
            [this.sourceAbsoluteCenterX, this.targetAbsoluteCenterY]
        ];
    },

    setEdgeAroundTheCorner: function(down) {

        var height = Math.max(this.source.h / 2, this.target.h / 2) + 20;

        if (down) {
            height *= -1;
        }

        this.edge.innerPoints = [
            [this.sourceAbsoluteCenterX, this.sourceAbsoluteCenterY + height],
            [this.targetAbsoluteCenterX, this.sourceAbsoluteCenterY + height]
        ];
    }
};

Ext.ux.OneCombo = Ext.extend(Ext.form.ComboBox, {
    initComponent: function() {
        this.readOnly = true;
        this.displayField = 'text';
        this.valueField = 'text';
        this.triggerAction = 'all';
        this.mode = 'local';
        this.emptyText = 'Please Select...';

        this.store = new Ext.data.SimpleStore({
            expandData: true,
            fields: ['text']
        });
        this.store.loadData(this.data);

        Ext.ux.OneCombo.superclass.initComponent.call(this);
    }
});

Ext.reg('onecombo', Ext.ux.OneCombo);

App.PalettePanel = Ext.extend(Ext.Panel, {
    initComponent: function() {
        this.region = 'west';
        this.title = '活动环节';
        this.iconCls = 'tb-activity';
        this.width = 130;

        this.initPalette();

        App.PalettePanel.superclass.initComponent.call(this);
    },

    initPalette: function() {
        var paletteType = null;
        if (!Gef.PALETTE_TYPE) {
            paletteType = 'accordion';
        } else {
            paletteType = Gef.PALETTE_TYPE;
        }
        this.configLayout(paletteType);
        this.configItems(paletteType);
    },
    createHtml: function(array, divId) {
        var imageRoot = Gef.IMAGE_ROOT.replace('48/', '');

        if (divId) {
            var html = '<div id="' + divId + '" unselectable="on">';
        } else {
            var html = '<div unselectable="on">';
        }
        for (var i = 0; i < array.length; i++) {
            var item = array[i];
            html += '<div id="' + item.name 
                + '" class="paletteItem-' + item.name
                + '" style="text-align:center;font-size:12px;cursor:pointer;" unselectable="on"><img id="'
                + item.name + '-img" class="paletteItem-' + item.name
                + '" src="' + imageRoot + item.image + '.png" unselectable="on"><br>'
                + item.title + '</div>';
        }
        html += '</div>';
        return html;
    },

    /**
     * this.layout = 'accordion';
     */
    configLayout: function(type) {
        if (!type || type == 'plain') {
            //
        } else if (type && type == 'accordion') {
            this.layout = 'accordion';
        }
    },

    configItems: function(type) {
        if (type && type == 'accordion') {
            this.createItemsForAccordion();
        } else if (!type || type == 'plain') {
            this.createItemsForHtml();
        }
    },

    createItemsForAccordion: function() {
        this.id = '__gef_jbs_palette__';

        this.items = [{
            title: '所有活动',
            iconCls: 'tb-activity',
            autoScroll: true,
            html: this.createHtml([
                {name: 'select',       image: 'select32',               title: '选择'},
                {name: 'transition',   image: '32/flow_sequence',       title: '连线'},
                {name: 'start',        image: '32/start_event_empty',   title: '开始'},
                {name: 'end',          image: '32/end_event_terminate', title: '结束'},
                /*{name: 'cancel',       image: '32/end_event_cancel',    title: '取消'},  // 本来是高级活动中的
                {name: 'error',        image: '32/end_event_error',     title: '错误'},*/
               // {name: 'human',        image: '32/task_empty',          title: '人工'},
                {name: 'task',         image: '32/task_empty',          title: '任务'},
                {name: 'decision',     image: '32/gateway_exclusive',   title: '决策'},
                /*{name: 'sql',          image: '32/task_sql',            title: 'SQL'},*/
                {name: 'derive',       image: '32/derive',    		    title: '派生流程'},
                {name: 'mission',      image: '32/mission',    		    title: '派生任务'},
                {name: 'idea',         image: '32/idea',    		    title: '派生意见'}
                /*{name: 'auto',         image: '32/task_empty',          title: '自动'},
                {name: 'counter-sign', image: '32/task_empty',          title: '会签'},
                {name: 'fork',         image: '32/gateway_parallel',    title: '并行'},
                {name: 'join',         image: '32/gateway_parallel',    title: '汇聚'}*/
            ])
        }/*, {
            title: '高级活动',
            iconCls: 'tb-activity',
            autoScroll: true,
            html: this.createHtml([
                {name: 'cancel',       image: '32/end_event_cancel',    title: '取消'},
               
                {name: 'state',        image: '32/task_wait',           title: '等待'},
                //{name: 'task',         image: '32/task_empty',          title: '任务'},
                {name: 'human',        image: '32/task_empty',          title: '人工'},
                {name: 'decision',     image: '32/gateway_exclusive',   title: '决策'},
                {name: 'fork',         image: '32/gateway_exclusive',    title: '并行'},
                {name: 'join',         image: '32/gateway_parallel',    title: '汇聚'},
                {name: 'java',         image: '32/task_java',           title: 'JAVA'},
                {name: 'script',       image: '32/task_java',           title: '脚本'},
                {name: 'hql',          image: '32/task_hql',            title: 'HQL'},
                {name: 'sql',          image: '32/task_sql',            title: 'SQL'},
                {name: 'mail',         image: '32/task_empty',          title: '邮件'},
                {name: 'custom',       image: '32/task_empty',          title: '自定义'},
                {name: 'subProcess',   image: '32/task_empty',          title: '子流程'},
                {name: 'jms',          image: '32/task_empty',          title: 'JMS'},
                {name: 'ruleDecision', image: '32/gateway_exclusive',   title: '规则决策'},
                {name: 'rules',        image: '32/task_empty',          title: '规则'},
                {name: 'foreach',      image: '32/gateway_exclusive',   title: '动态分支'}
            ])
        }*/];
    },

    createItemsForHtml: function() {
        this.autoScroll = true;

        this.html = this.createHtml([
            {name: 'select',       image: 'select32',               title: '选择'},
            {name: 'transition',   image: '32/flow_sequence',       title: '连线'},
            {name: 'start',        image: '32/start_event_empty',   title: '开始'},
            {name: 'end',          image: '32/end_event_terminate', title: '结束'},
            {name: 'cancel',       image: '32/end_event_cancel',    title: '取消'},
            {name: 'error',        image: '32/end_event_error',     title: '错误'},
            {name: 'state',        image: '32/task_wait',           title: '等待'},
            {name: 'task',         image: '32/task_empty',          title: '任务'},
            {name: 'decision',     image: '32/gateway_exclusive',   title: '决策'},
            {name: 'fork',         image: '32/gateway_parallel',    title: '并行'},
            {name: 'join',         image: '32/gateway_parallel',    title: '汇聚'},
            {name: 'java',         image: '32/task_java',           title: 'JAVA'},
            {name: 'script',       image: '32/task_java',           title: '脚本'},
            {name: 'hql',          image: '32/task_hql',            title: 'HQL'},
            {name: 'sql',          image: '32/task_sql',            title: 'SQL'},
            {name: 'derive',       image: '32/derive',    		    title: '派生'},
            {name: 'mail',         image: '32/task_empty',          title: '邮件'},
            {name: 'custom',       image: '32/task_empty',          title: '自定义'},
            {name: 'subProcess',   image: '32/task_empty',          title: '子流程'},
            {name: 'jms',          image: '32/task_empty',          title: 'JMS'},
            {name: 'ruleDecision', image: '32/gateway_exclusive',   title: '规则决策'},
            {name: 'rules',        image: '32/task_empty',          title: '规则'},
            {name: 'human',        image: '32/task_empty',          title: '人工节点'},
            {name: 'auto',         image: '32/task_empty',          title: '自动节点'},
            {name: 'counter-sign', image: '32/task_empty',          title: '会签节点'}
        ], '__gef_jbs_palette__');
    }
});

Ext.ux.TwoCombo = Ext.extend(Ext.form.ComboBox, {
    initComponent: function() {
        this.readOnly = true;
        this.displayField = 'text';
        this.valueField = 'value';
        this.triggerAction = 'all';
        this.mode = 'local';
        this.emptyText = 'Please Select...';

        this.store = new Ext.data.SimpleStore({
            fields: ['value', 'text']
        });
        this.store.loadData(this.data);

        Ext.ux.TwoCombo.superclass.initComponent.call(this);
    }
});

Ext.reg('twocombo', Ext.ux.TwoCombo);
