package com.uas.erp.model;

import java.io.Serializable;
import java.util.List;

import org.codehaus.jackson.annotate.JsonIgnore;

import com.alibaba.fastjson.annotation.JSONField;
import com.uas.erp.dao.Saveable;

/**
 **/
public class Form implements Saveable, Serializable {

	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;
	private int fo_id;
	private String fo_table;
	private String fo_codefield;
	private String fo_title;
	private String fo_caller;
	private String fo_seq;
	private String fo_keyfield;
	private String fo_detailtable;
	private String fo_detailkeyfield;
	private String fo_detailmainkeyfield;
	private String fo_enidfield;
	private String fo_detailgridorderby;
	private int fo_detailgridfixedcol;
	private String fo_detailseq;
	private String fo_detailfromclause;
	private String fo_detaildetnofield;
	private String dataString;// 字符串格式的数据
	private String fo_button4add;// add页面表单的buttons
	private String fo_button4rw;// read&write页面表单的button
	private String fo_statusfield;
	private String fo_statuscodefield;
	private String fo_dealurl;// batchDeal页面的action名称
	private String fo_flowcaller;// 审批流名称
	private String fo_detailstatus;// 明细状态
	private String fo_detailstatuscode;// 明细状态码
	private String fo_detailcondition;// 明细条件
	private String fo_reportname;// 报表名称
	private String fo_helpdoc;// 帮助文档
	private String fo_pagetype;// 界面类型
	private Integer fo_mainpercent;//主表百分比
	private Integer fo_detailpercent;//从表百分比
	private Integer fo_isPrevNext;//是否启用上一条下一条
	
	public int getFo_id() {
		return fo_id;
	}

	public void setFo_id(int fo_id) {
		this.fo_id = fo_id;
	}

	public String getFo_table() {
		return fo_table;
	}

	public void setFo_table(String fo_table) {
		this.fo_table = fo_table;
	}

	public String getFo_codefield() {
		return fo_codefield;
	}

	public void setFo_codefield(String fo_codefield) {
		this.fo_codefield = fo_codefield;
	}

	public String getFo_title() {
		return fo_title;
	}

	public void setFo_title(String fo_title) {
		this.fo_title = fo_title;
	}

	public String getFo_caller() {
		return fo_caller;
	}

	public void setFo_caller(String fo_caller) {
		this.fo_caller = fo_caller;
	}

	public String getFo_detailstatus() {
		return fo_detailstatus;
	}

	public void setFo_detailstatus(String fo_detailstatus) {
		this.fo_detailstatus = fo_detailstatus;
	}

	public String getFo_detailstatuscode() {
		return fo_detailstatuscode;
	}

	public void setFo_detailstatuscode(String fo_detailstatuscode) {
		this.fo_detailstatuscode = fo_detailstatuscode;
	}

	public String getFo_seq() {
		return fo_seq;
	}

	public void setFo_seq(String fo_seq) {
		this.fo_seq = fo_seq;
	}

	public String getFo_flowcaller() {
		return fo_flowcaller;
	}

	public void setFo_flowcaller(String fo_flowcaller) {
		this.fo_flowcaller = fo_flowcaller;
	}

	public String getFo_keyfield() {
		return fo_keyfield;
	}

	public void setFo_keyfield(String fo_keyfield) {
		this.fo_keyfield = fo_keyfield;
	}

	public String getFo_detailtable() {
		return fo_detailtable;
	}

	public String getFo_statusfield() {
		return fo_statusfield;
	}

	public void setFo_statusfield(String fo_statusfield) {
		this.fo_statusfield = fo_statusfield;
	}

	public String getFo_statuscodefield() {
		return fo_statuscodefield;
	}

	public void setFo_statuscodefield(String fo_statuscodefield) {
		this.fo_statuscodefield = fo_statuscodefield;
	}

	public void setFo_detailtable(String fo_detailtable) {
		this.fo_detailtable = fo_detailtable;
	}

	public String getFo_detailkeyfield() {
		return fo_detailkeyfield;
	}

	public void setFo_detailkeyfield(String fo_detailkeyfield) {
		this.fo_detailkeyfield = fo_detailkeyfield;
	}

	public String getFo_detailmainkeyfield() {
		return fo_detailmainkeyfield;
	}

	public void setFo_detailmainkeyfield(String fo_detailmainkeyfield) {
		this.fo_detailmainkeyfield = fo_detailmainkeyfield;
	}

	public String getFo_enidfield() {
		return fo_enidfield;
	}

	public void setFo_enidfield(String fo_enidfield) {
		this.fo_enidfield = fo_enidfield;
	}

	public String getFo_detailgridorderby() {
		return fo_detailgridorderby;
	}

	public void setFo_detailgridorderby(String fo_detailgridorderby) {
		this.fo_detailgridorderby = fo_detailgridorderby;
	}

	public int getFo_detailgridfixedcol() {
		return fo_detailgridfixedcol;
	}

	public void setFo_detailgridfixedcol(int fo_detailgridfixedcol) {
		this.fo_detailgridfixedcol = fo_detailgridfixedcol;
	}

	public String getFo_detailseq() {
		return fo_detailseq;
	}

	public void setFo_detailseq(String fo_detailseq) {
		this.fo_detailseq = fo_detailseq;
	}

	public String getFo_detailfromclause() {
		return fo_detailfromclause;
	}

	public void setFo_detailfromclause(String fo_detailfromclause) {
		this.fo_detailfromclause = fo_detailfromclause;
	}

	public String getFo_detaildetnofield() {
		return fo_detaildetnofield;
	}

	public void setFo_detaildetnofield(String fo_detaildetnofield) {
		this.fo_detaildetnofield = fo_detaildetnofield;
	}

	public String getFo_button4add() {
		return fo_button4add;
	}

	public void setFo_button4add(String fo_button4add) {
		this.fo_button4add = fo_button4add;
	}

	public String getFo_button4rw() {
		return fo_button4rw;
	}

	public void setFo_button4rw(String fo_button4rw) {
		this.fo_button4rw = fo_button4rw;
	}

	public String getFo_dealurl() {
		return fo_dealurl;
	}

	public void setFo_dealurl(String fo_dealurl) {
		this.fo_dealurl = fo_dealurl;
	}

	public String getDataString() {
		return dataString;
	}

	public void setDataString(String dataString) {
		this.dataString = dataString;
	}

	public String getFo_detailcondition() {
		return fo_detailcondition;
	}

	public void setFo_detailcondition(String fo_detailcondition) {
		this.fo_detailcondition = fo_detailcondition;
	}

	public void setFo_reportname(String fo_reportname) {
		this.fo_reportname = fo_reportname;
	}

	public String getFo_reportname() {
		return fo_reportname;
	}

	public String getFo_helpdoc() {
		return fo_helpdoc;
	}

	public void setFo_helpdoc(String fo_helpdoc) {
		this.fo_helpdoc = fo_helpdoc;
	}

	public Integer getFo_mainpercent() {
		return fo_mainpercent;
	}

	public void setFo_mainpercent(Integer fo_mainpercent) {
		this.fo_mainpercent = fo_mainpercent;
	}

	public Integer getFo_detailpercent() {
		return fo_detailpercent;
	}

	public void setFo_detailpercent(Integer fo_detailpercent) {
		this.fo_detailpercent = fo_detailpercent;
	}
	
	@Override
	public String table() {
		return "form";
	}

	@Override
	public String[] keyColumns() {
		return new String[] { "fo_id" };
	}

	private List<FormDetail> formDetails;

	public List<FormDetail> getFormDetails() {
		return formDetails;
	}

	public void setFormDetails(List<FormDetail> formDetails) {
		this.formDetails = formDetails;
	}

	/**
	 * 从form表拿到object的字段和对应的表名拼装成sql语句
	 * 
	 * @param condition
	 *            附加的条件
	 */
	@JsonIgnore
	@JSONField(serialize = false)
	public String getSql(String condition) {
		StringBuffer sb = new StringBuffer("SELECT ");
		for (FormDetail detail : this.formDetails) {
			sb.append(detail.getFd_field());
			sb.append(",");
		}
		String str = sb.substring(0, sb.length() - 1) + " FROM " + this.fo_table;
		return condition.equals("") ? str : str + " where " + condition;
	}

	public String getFo_pagetype() {
		return fo_pagetype;
	}

	public void setFo_pagetype(String fo_pagetype) {
		this.fo_pagetype = fo_pagetype;
	}

	public Integer getFo_isPrevNext() {
		return fo_isPrevNext;
	}

	public void setFo_isPrevNext(Integer fo_isPrevNext) {
		this.fo_isPrevNext = fo_isPrevNext;
	}

}
