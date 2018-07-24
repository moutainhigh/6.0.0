package com.uas.erp.service.scm.impl;

import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.uas.erp.core.BaseUtil;
import com.uas.erp.core.HandlerService;
import com.uas.erp.core.SqlUtil;
import com.uas.erp.dao.BaseDao;
import com.uas.erp.service.scm.SaleForecastKindService;

@Service
public class SaleForecastKindServiceImpl implements SaleForecastKindService{
	@Autowired
	private BaseDao baseDao;
	
	@Autowired
	private HandlerService handlerService;
	@Override
	public void saveSaleForecastKind(String formStore, String caller) {
		Map<Object, Object> store = BaseUtil.parseFormStoreToMap(formStore);
		//当前编号的记录已经存在,不能新增!
		boolean bool = baseDao.checkByCondition("SaleForecastKind", "sf_code='" + store.get("sf_code") + "'");
		if(!bool){
			BaseUtil.showError(BaseUtil.getLocalMessage("common.save_codeHasExist"));
		}
		//执行保存前的其它逻辑
		handlerService.handler(caller, "save", "before", new Object[]{store});
		//保存
		String formSql = SqlUtil.getInsertSqlByFormStore(store, "SaleForecastKind", new String[]{}, new Object[]{});
		baseDao.execute(formSql);
		baseDao.logger.save(caller, "sf_id", store.get("sf_id"));
		//执行保存后的其它逻辑
		handlerService.handler(caller, "save", "after", new Object[]{store});
	}
	@Override
	public void deleteSaleForecastKind(int sf_id, String caller) {
		//执行删除前的其它逻辑
		handlerService.handler(caller, "delete", "before", new Object[]{sf_id});
		baseDao.delCheck("SaleForecastKind", sf_id);
		//删除
		baseDao.deleteById("SaleForecastKind", "sf_id", sf_id);
		//记录操作
		baseDao.logger.delete(caller, "sf_id", sf_id);
		//执行删除后的其它逻辑
		handlerService.handler(caller, "delete", "after", new Object[]{sf_id});
	}
	@Override
	public void updateSaleForecastKindById(String formStore, String caller) {
		Map<Object, Object> store = BaseUtil.parseFormStoreToMap(formStore);
		//执行修改前的其它逻辑
		handlerService.handler(caller, "save", "before", new Object[]{store});
		//修改
		String formSql = SqlUtil.getUpdateSqlByFormStore(store, "SaleForecastKind", "sf_id");
		baseDao.execute(formSql);
		//记录操作
		baseDao.logger.update(caller, "sf_id", store.get("sf_id"));
		//执行修改后的其它逻辑
		handlerService.handler(caller, "save", "after", new Object[]{store});
	}
}
