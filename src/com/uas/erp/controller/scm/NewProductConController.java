package com.uas.erp.controller.scm;

import java.util.HashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import com.uas.erp.service.scm.NewProductConService;
@Controller
public class NewProductConController {
	@Autowired
	private NewProductConService newProductConService;
	@RequestMapping("/scm/product/saveNewProductCon.action")  
	@ResponseBody 
	public Map<String, Object> save(String caller, String formStore, String param) {
		Map<String, Object> modelMap = new HashMap<String, Object>();
	    newProductConService.saveNewProductCon(formStore, caller);
		modelMap.put("success", true);
		return modelMap;
	}
	@RequestMapping("/scm/product/deleteNewProductCon.action")  
	@ResponseBody 
	public Map<String, Object> delete(String caller,int id) {
		Map<String, Object> modelMap = new HashMap<String, Object>();
	    newProductConService.deleteNewProductCon(id, caller);
		modelMap.put("success", true);
		return modelMap;
	}
	@RequestMapping("/scm/product/updateNewProductCon.action")  
	@ResponseBody 
	public Map<String, Object> update(String caller,String formStore) {
		Map<String, Object> modelMap = new HashMap<String, Object>();
	    newProductConService.updateNewProductCon(formStore, caller);
		modelMap.put("success", true);
		return modelMap;
	}
	@RequestMapping("/scm/product/submitNewProductCon.action")  
	@ResponseBody 
	public Map<String, Object> submitNewProductCon(String caller, int id) {
		Map<String, Object> modelMap = new HashMap<String, Object>();
		newProductConService.submitNewProductCon(id, caller);
		modelMap.put("success", true);
		return modelMap;
	}
	/**
	 * 反提交
	 */
	@RequestMapping("/scm/product/resSubmitNewProductCon.action")  
	@ResponseBody 
	public Map<String, Object> resSubmitNewProductCon(String caller, int id) {
		Map<String, Object> modelMap = new HashMap<String, Object>();
		newProductConService.resSubmitNewProductCon(id, caller);
		modelMap.put("success", true);
		return modelMap;
	}
	/**
	 * 审核
	 */
	@RequestMapping("/scm/product/auditNewProductCon.action")  
	@ResponseBody 
	public Map<String, Object> auditNewProductCon(String caller, int id) {
		Map<String, Object> modelMap = new HashMap<String, Object>();
		newProductConService.auditNewProductCon(id, caller);
		modelMap.put("success", true);
		return modelMap;
	}
	/**
	 * 反审核
	 */
	@RequestMapping("/scm/product/resAuditNewProductCon.action")  
	@ResponseBody 
	public Map<String, Object> resAuditNewProductCon(String caller, int id) {
		Map<String, Object> modelMap = new HashMap<String, Object>();
		newProductConService.resAuditNewProductCon(id, caller);
		modelMap.put("success", true);
		return modelMap;
	}
}
