package com.uas.erp.service.oa.impl;

import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.uas.erp.core.BaseUtil;
import com.uas.erp.core.HandlerService;
import com.uas.erp.core.SqlUtil;
import com.uas.erp.dao.BaseDao;
import com.uas.erp.service.oa.MaintenanceProjectService;
@Service
public class MaintenanceProjectServiceImpl implements MaintenanceProjectService{
	@Autowired
	private BaseDao baseDao;
	@Autowired
	private HandlerService handlerService;
	@Override
	public void saveMaintenanceProject(String formStore, String caller) {
		Map<Object, Object> store = BaseUtil.parseFormStoreToMap(formStore);
		//执行保存前的其它逻辑
		handlerService.beforeSave(caller, new Object[]{store});
		//执行保存操作
		String formSql = SqlUtil.getInsertSqlByFormStore(store, "MaintenanceProject", new String[]{}, new Object[]{});
		baseDao.execute(formSql);
		//记录操作
		baseDao.logger.save(caller, "mp_id", store.get("mp_id"));
		//执行保存后的其它逻辑
		handlerService.afterSave(caller, new Object[]{store});
	}

	@Override
	public void updateMaintenanceProject(String formStore, String caller) {
		Map<Object, Object> store = BaseUtil.parseFormStoreToMap(formStore);
		//执行修改前的其它逻辑
		handlerService.beforeUpdate(caller,new Object[]{store});
		//修改MaintenanceProject
		String formSql = SqlUtil.getUpdateSqlByFormStore(store, "MaintenanceProject", "mp_id");
		baseDao.execute(formSql);
		//记录操作
		baseDao.logger.update(caller, "mp_id", store.get("mp_id"));
		//执行修改后的其它逻辑
		handlerService.afterUpdate(caller,new Object[]{store});
		
	}

	@Override
	public void deleteMaintenanceProject(int mp_id, String caller) {
		//执行删除前的其它逻辑
		handlerService.beforeDel(caller, new Object[]{mp_id});
		//删除purchase
		baseDao.deleteById("MaintenanceProject", "mp_id", mp_id);
		//记录操作
		baseDao.logger.delete(caller, "mp_id", mp_id);
		//执行删除后的其它逻辑
		handlerService.afterDel(caller, new Object[]{mp_id});
	}
}
