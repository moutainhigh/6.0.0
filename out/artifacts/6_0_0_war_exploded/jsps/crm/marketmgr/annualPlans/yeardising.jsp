<%@ page language="java" contentType="text/html; charset=utf-8"
    pageEncoding="utf-8"%>
<%
String path = request.getContextPath();
String basePath = request.getScheme()+"://"+request.getServerName()+":"+request.getServerPort()+path+"/";
%>
<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
<link rel="stylesheet" href="<%=basePath %>resource/ext/resources/css/ext-all-gray.css" type="text/css"></link>
<!--[if IE]>
	<link rel="stylesheet" href="<%=basePath %>resource/ext/resources/css/ext-ie-scoped.css" type="text/css"></link>
<![endif]-->
<link rel="stylesheet" href="<%=basePath %>resource/css/main.css" type="text/css"></link>
<style>
	.custom-blank .x-grid-cell{
		background-color: #F9F7F8;
	}
	.custom .x-grid-cell{
		background-color: #F5F2CD;
	}
	.custom-alt .x-grid-cell{
		background-color: #F3F2F0;
	}
	.custom-first .x-grid-cell{
		border-top-color: #999; 
		border-top-style: dashed;
		background-color: #EEE8CD;
	}
	.custom-alt-first .x-grid-cell{
		border-top-color: #999; 
		border-top-style: dashed;
		background-color: #EAEAEA;
	}
	.custom-grid .x-grid-row-over .x-grid-cell { 
	    background-color: #BCD2EE; 
	    border-bottom-color: #999; 
	    border-top-color: #999; 
	} 
	 
	.custom-grid .x-grid-row-selected .x-grid-cell { 
	    background-color: #BCD2EE !important; 
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
        'crm.marketmgr.annualPlans.Yeardising'
    ],
    launch: function() {
    	Ext.create('erp.view.crm.marketmgr.annualPlans.Yeardising');//创建视图
    }
});
var caller = 'Merchandising!Year';
var height = window.innerHeight*0.73; 
var formCondition = '';
var gridCondition = '';
</script>
</head>
<body >
</body>
</html>