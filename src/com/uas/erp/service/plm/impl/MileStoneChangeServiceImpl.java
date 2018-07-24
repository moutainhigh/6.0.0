package com.uas.erp.service.plm.impl;

import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.uas.erp.core.BaseUtil;
import com.uas.erp.core.HandlerService;
import com.uas.erp.core.SqlUtil;
import com.uas.erp.core.support.StateAssert;
import com.uas.erp.dao.BaseDao;
import com.uas.erp.service.plm.MileStoneChangeService;

@Service
public class MileStoneChangeServiceImpl implements MileStoneChangeService{
	@Autowired
	private BaseDao baseDao;
	@Autowired
	private HandlerService handlerService;

	@Override
	public void saveMileStoneChange(String formStore, String caller) {
		Map<Object, Object> store = BaseUtil.parseFormStoreToMap(formStore);
		handlerService.handler(caller, "save", "before", new Object[]{store});		
		String formSql = SqlUtil.getInsertSqlByFormStore(store, "MileStoneChange", new String[]{}, new Object[]{});
		baseDao.execute(formSql);	
		baseDao.logger.save(caller, "mc_id", store.get("mc_id"));
		//执行保存后的其它逻辑
		handlerService.handler(caller, "save", "after", new Object[]{store});
	}

	@Override
	public void updateMileStoneChangeById(String formStore,String caller) {		
		Map<Object, Object> store = BaseUtil.parseFormStoreToMap(formStore);
		handlerService.handler(caller, "save", "before", new Object[]{store});
		String formSql = SqlUtil.getUpdateSqlByFormStore(store, "MileStoneChange", "mc_id");
		baseDao.execute(formSql);
		//记录操作
		baseDao.logger.update(caller, "mc_id", store.get("mc_id"));
		//执行修改后的其它逻辑
		handlerService.handler(caller, "save", "after", new Object[]{store});
	}

	@Override
	public void deleteMileStoneChange(int mc_id, String caller) {		
		//执行删除前的其它逻辑
		handlerService.handler(caller, "delete", "before", new Object[]{mc_id});
		//删除主表内容
		baseDao.deleteById("MileStoneChange", "mc_id", mc_id);
		baseDao.logger.delete(caller, "mc_id", mc_id);
		//执行删除后的其它逻辑
		handlerService.handler(caller, "delete", "after", new Object[]{mc_id});
	}

	@Override
	public void auditMileStoneChange(int mc_id, String caller) {
		//只能对已提交进行审核操作
		Object status = baseDao.getFieldDataByCondition("MileStoneChange", "mc_statuscode", "mc_id=" + mc_id);
		StateAssert.auditOnlyCommited(status);
		handlerService.beforeAudit("MileStoneChange", mc_id);
		//执行审核前的其它逻辑
		handlerService.handler(caller, "audit", "before", new Object[]{mc_id});
		//执行审核操作
		baseDao.audit("MileStoneChange", "mc_id=" + mc_id, "mc_status", "mc_statuscode", "mc_auditdate", "mc_auditor");
		//记录操作
		baseDao.logger.audit(caller, "mc_id", mc_id);
		//执行审核后的其它逻辑
		handlerService.handler(caller, "audit", "after", new Object[]{mc_id});
	}
	@Override
	public void submitMileStoneChange(int mc_id, String caller) {
		// 只能对状态为[在录入]的表单进行提交操作!
		Object status = baseDao.getFieldDataByCondition("MileStoneChange", "mc_statuscode", "mc_id=" + mc_id);
		StateAssert.submitOnlyEntering(status);
		// 执行提交前的其它逻辑
		handlerService.handler(caller, "commit", "before", new Object[] { mc_id });
		// 执行提交操作
		baseDao.submit("MileStoneChange", "mc_id=" + mc_id, "mc_status", "mc_statuscode");
		// 记录操作
		baseDao.logger.submit(caller, "mc_id", mc_id);
		// 执行提交后的其它逻辑
		handlerService.handler(caller, "commit", "after", new Object[] { mc_id });
	}
	@Override
	public void resSubmitMileStoneChange(int mc_id, String caller) {
		// 只能对状态为[已提交]的表单进行反提交操作!
		Object status = baseDao.getFieldDataByCondition("MileStoneChange", "mc_statuscode", "mc_id=" + mc_id);
		StateAssert.resSubmitOnlyCommited(status);
		handlerService.handler(caller, "resCommit", "before", new Object[] { mc_id });
		// 执行反提交操作
		baseDao.resOperate("MileStoneChange", "mc_id=" + mc_id, "mc_status", "mc_statuscode");
		// 记录操作
		baseDao.logger.resSubmit(caller, "mc_id", mc_id);
		handlerService.handler(caller, "resCommit", "after", new Object[] { mc_id });
	}
	@Override
	public void resAuditMileStoneChange(int mc_id, String caller) {
		// 只能对状态为[已审核]的表单进行反审核操作!
		Object status = baseDao.getFieldDataByCondition("MileStoneChange", "mc_statuscode", "mc_id=" + mc_id);
		StateAssert.resAuditOnlyAudit(status);
		// 执行反审核操作
		baseDao.resAudit("MileStoneChange", "mc_id=" + mc_id, "mc_status", "mc_statuscode", "mc_auditdate", "mc_auditor");
		baseDao.resOperate("MileStoneChange", "mc_id=" + mc_id, "mc_status", "mc_statuscode");
		// 记录操作
		baseDao.logger.resAudit(caller, "mc_id", mc_id);
	}
}
