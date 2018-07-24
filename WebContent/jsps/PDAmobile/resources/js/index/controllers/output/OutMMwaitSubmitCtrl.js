define([ 'app/app','service/Purc','service/SupportServices' ], function(app) {
	app.register.controller('OutMMwaitSubmitCtrl',['$scope', '$rootScope','$stateParams','$filter', 'ngTableParams','Online','SupportUtil','OutOper','toaster', 'Ring',function($scope, $rootScope,$stateParams,$filter, ngTableParams,Online,SupportUtil,OutOper,toaster,Ring){
		$scope.grid = $rootScope.outMMgrid;
		 var getOrder = function(code) {//根据路径中的id号获取对应的单据
			var result = null;
			angular.forEach($rootScope.outMMOrders, function(value, key){
				if(value.PI_INOUTNO == code) {
					result = value;
					return result;
				}
			});
			return result;
		 };
		 $scope.order = getOrder($stateParams.ioNocode);
		if($scope.grid){
			 $scope.tableParams = new ngTableParams({//未完成料号名称规格及剩余数量表格
			        page: 1,           
			        count: 10,          
			        filter: {  
			        },
			        sorting: {  
			        }
			    }, {
			        total: $scope.grid.length,
			        getData: function ($defer, params) {
			            var filteredData = params.filter() ?
			                    $filter('filter')($scope.grid, params.filter()) :
			                    data;
			            var orderedData = params.sorting() ?
			                    $filter('orderBy')(filteredData, params.orderBy()) :
			                    data;	
			            params.total(orderedData.length); // set total for recalc pagination
			            $defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));
			        }
			    });
		 }
		 $scope.deleteAll = function (){//全部删除
		 	if(confirm("确定删除全部？")){
		 		 angular.forEach($rootScope.outMMOrders, function(value, key) {//反写剩余数
					if (value.PI_INOUTNO == $scope.order.PI_INOUTNO) {
						for (var n in value.product) {
							for (var gs in $scope.grid){  
                               if (value.product[n].PD_ID == $scope.grid[gs].bi_pdid) {
								  value.product[n].PD_OUTQTY = eval($scope.grid[gs].bi_outqty+"+"+value.product[n].PD_OUTQTY);
							    }
                             } 						
						}
					}
			});		 				 			 		
				$rootScope.outMMgrid = $scope.grid ='';
			    $scope.tableParams.reload();
			    toaster.pop('success', '删除成功');
			}		 
		 };
	   $scope.deleteWaitSubmitItem =  function (s){	   		    
	   	    angular.forEach($rootScope.outMMOrders, function(value, key) {
						if (value.PI_INOUTNO == $scope.order.PI_INOUTNO) {
							for (var n in value.product) {
								if (value.product[n].PD_ID == s.bi_pdid) {
									value.product[n].PD_OUTQTY = eval(s.bi_outqty+"+"+value.product[n].PD_OUTQTY);
								}
							}
						}
					});
			for (var n in $scope.grid){  
               if($scope.grid[n].bi_barcode == s.bi_barcode){
                      $scope.grid.splice(n,1);
                 }
              } 
              $rootScope.outMMgrid = $scope.grid;
			  $scope.tableParams.reload();
		 };
		 
		 $scope.submitGet = function(){//提交采集操作，与后台交互		
			OutOper.saveOutBarcode({},JSON.stringify($scope.grid),function(data) {//获取成功		
				    $rootScope.outMMgrid = $scope.grid ='';
				    toaster.pop('success', '提交成功');
				}, function(response){//获取失败处理
					if(response.status == 0){ //无网络错误
					   Online.setOnline(false);//修改网络状态	
					   toaster.pop('error', '提交失败',"网络连接不可用，请稍后再试");
					}
					else {
					  toaster.pop('error', '提交失败',response.exceptionInfo);
					}
				});
	     	};		
	}])
});