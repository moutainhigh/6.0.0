Ext.QuickTips.init();
Ext.define('erp.controller.co.cost.MonthCarryover', {
	extend : 'Ext.app.Controller',
	FormUtil : Ext.create('erp.util.FormUtil'),
	BaseUtil : Ext.create('erp.util.BaseUtil'),
	views : [ 'co.cost.MonthCarryover', 'core.form.MonthDateField', 'core.button.Carryover', 'core.button.Close' ],
	init : function() {
		var me = this;
		this.control({
			'erpCloseButton' : {
				click : function(btn) {
					me.FormUtil.onClose();
				}
			},
			'erpCarryoverButton' : {
				click : function(btn) {
					this.carryover();
				}
			},
			'monthdatefield' : {
				afterrender : function(f) {
					me.getCurrentYearmonth(f);
				}
			}
		});
	},
	getForm : function(btn) {
		return btn.ownerCt.ownerCt;
	},
	carryover : function() {
		Ext.Ajax.request({
			url : basePath + "co/cost/monthCarryover.action",
			params : {
				param : {
					date : Ext.getCmp('date').value
				},
			},
			method : 'post',
			callback : function(opt, s, res) {
				var r = new Ext.decode(res.responseText);
				if (r.success) {
					showMessage('提示', "结转成功！", 1000);
					window.location.reload();
				} else if (r.exceptionInfo) {
					var str = r.exceptionInfo;
					if (str.trim().substr(0, 12) == 'AFTERSUCCESS') {// 特殊情况:操作成功，但是出现警告,允许刷新页面
						str = str.replace('AFTERSUCCESS', '');
						showMessage('提示', str);
						window.location.reload();
					} else {
						showError(str);
						return;
					}
				}
			}
		});
	},
	getCurrentYearmonth : function(f) {
		Ext.Ajax.request({
			url : basePath + 'co/cost/getCurrentYearmonthCo.action',
			method : 'GET',
			callback : function(opt, s, r) {
				var rs = Ext.decode(r.responseText);
				if (rs.exceptionInfo) {
					showError(rs.exceptionInfo);
				} else if (rs.data) {
					f.setValue(rs.data);
				}
			}
		});
	}
});