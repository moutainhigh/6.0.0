<%@ page language="java" contentType="text/html; charset=utf-8"
    pageEncoding="utf-8"%>
<%
String path = request.getContextPath();
String basePath = request.getScheme()+"://"+request.getServerName()+":"+request.getServerPort()+path+"/";
%>
<!DOCTYPE html>
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
<link rel="stylesheet" href="<%=basePath %>resource/ext/resources/css/ext-all-gray.css" type="text/css"></link>
<link rel="stylesheet" href="<%=basePath %>resource/css/main.css" type="text/css"></link>
<style>
.breadcrumb{
    font: 11px Arial, Helvetica, sans-serif;
    background-image:url('<%=basePath %>resource/images/screens/bc_bg.png'); 
    background-repeat:repeat-x;
    height:100%;
    line-height:30px;
    color:#9b9b9b;
    border:solid 1px #cacaca;
    width:100%;
    overflow:hidden;
    margin:0px;
    padding:0px;
}
.breadcrumb li {
    list-style-type:none;
    float:left;
    padding-left:10px;
}
.breadcrumb a{
    height:30px;
    display:block;
    background-image:url('<%=basePath %>resource/images/screens/bc_separator.png'); 
    background-repeat:no-repeat; 
    background-position:right;
    padding-right: 15px;
    text-decoration: none;
    color:#454545;
}
.home{
    border:none;
    margin: 6px 0px;
}
.breadcrumb a:hover{
	color:#35acc5;
}

.x-tree-panel .x-grid-row .x-grid-cell-inner{
	background-color:white!important;
	font-size:16px;
}

.x-grid-row-selected .x-grid-cell, .x-grid-row-selected .x-grid-rowwrap-div{
	background-color:white!important;
}

.x-grid-row .x-grid-cell{
	background-color:white!important;
}

.x-tree-cls-node{
	background-image:none!important;
}

.x-grid-row-selected .x-grid-cell, .x-grid-row-selected .x-grid-rowwrap-div{
	font-weight:bold;
}

.x-panel-body .x-grid-body .x-panel-body-default .x-panel-body-default{
	background-color:white!important;
}

.x-grid-tree-node-expanded .x-tree-icon-parent {
   background-image: url('<%=basePath %>resource/ext/resources/themes/images/gray/tree/folder-open.gif')!important; 
   background: url('<%=basePath %>resource/ext/resources/themes/images/gray/tree/folder-open.gif')!important; 
}
</style>
<script type="text/javascript" src="<%=basePath %>resource/ext/ext-all.js"></script>
<script type="text/javascript" src="<%=basePath %>resource/i18n/i18n.js"></script>
<script type="text/javascript">	
Ext.Loader.setConfig({
	enabled: true
});//开启动态加载
Ext.application({
    name: 'erp',//为应用程序起一个名字,相当于命名空间
    appFolder: basePath+'app',//app文件夹所在路径
    controllers: [//声明所用到的控制层
        'plm.request.ProductType'
    ],
    launch: function() {
    	Ext.create('erp.view.plm.request.ProductType');//创建视图
    }
});
var caller = 'ProductType';
var type = getUrlParam('type');
var trigger = getUrlParam('trigger');
var status=getUrlParam('status');
var formCondition = '';
var gridCondition = '';
</script>
</head>
<body >
</body>
</html>