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
<link rel="stylesheet" type="text/css" href="<%=basePath %>resource/ext/resources/css/ext-all-gray.css"/>
<link rel="stylesheet" href="<%=basePath %>resource/css/main.css" type="text/css"></link>
<script type="text/javascript" src="<%=basePath %>resource/ext/ext-all.js"></script>
<script type="text/javascript" src="<%=basePath %>resource/i18n/i18n.js"></script>
<style>
 #win-body{text-align:center;border:none}  
 .x-window-body-default {
    border-color: #bcb1b0;
    border-width: 1px;
    background: none; 
    color: black;
}
</style>
<script type="text/javascript">

Ext.Loader.setConfig({
	enabled: true
});//开启动态加载
Ext.application({
    name: 'erp',//为应用程序起一个名字,相当于命名空间
    appFolder: basePath+'app',//app文件夹所在路径
    controllers: [//声明所用到的控制层
        'fs.cust.HXFinancCondition'
    ],
    launch: function() {
        Ext.create('erp.view.fs.cust.HXFinancCondition');
    }
});

var caller = 'HXFinancCondition';
var formCondition = '';
var gridCondition = '';
var condition = getUrlParam('gridCondition');
var readOnly = getUrlParam('readOnly');
</script>
</head>
<body >
</body>
</html>