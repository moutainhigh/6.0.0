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
<link rel="stylesheet" type="text/css" href="<%=basePath %>resource/ux/css/CheckHeader.css" />
<link rel="stylesheet" href="<%=basePath %>resource/css/main.css" type="text/css"></link>
<script type="text/javascript" src="<%=basePath %>resource/ext/ext-all.js"></script>
<script type="text/javascript" src="<%=basePath %>resource/i18n/i18n.js"></script>
<script type="text/javascript" src="<%=basePath %>resource/ux/CheckColumn.js"></script>
<script type="text/javascript">	
Ext.Loader.setConfig({
	enabled: true
});//开启动态加载
Ext.application({
    name: 'erp',//为应用程序起一个名字,相当于命名空间
    appFolder: basePath+'app',//app文件夹所在路径
    controllers: [//声明所用到的控制层
        'ma.createAccountBook.CreateAccountBook'
    ],
    launch: function() {
    	Ext.create('erp.view.ma.createAccountBook.CreateAccountBook');//创建视图
    }
});
var caller = 'CreateAccountBook';
var step = 0;
var em_name="<%=session.getAttribute("em_name")%>";
var em_email="<%=session.getAttribute("em_email")%>";
var em_tel="<%=session.getAttribute("em_tel")%>";
</script>
<link rel="stylesheet" type="text/css" href="<%=basePath %>jsps/ma/createAccountBook/createAccountBook.css" />
</head>
<body >
</body>
</html>