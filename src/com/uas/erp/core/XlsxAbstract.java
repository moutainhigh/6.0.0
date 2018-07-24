package com.uas.erp.core;

import java.io.InputStream;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;

import org.apache.poi.openxml4j.opc.OPCPackage;
import org.apache.poi.xssf.eventusermodel.XSSFReader;
import org.apache.poi.xssf.model.SharedStringsTable;
import org.apache.poi.xssf.usermodel.XSSFRichTextString;
import org.xml.sax.Attributes;
import org.xml.sax.InputSource;
import org.xml.sax.SAXException;
import org.xml.sax.XMLReader;
import org.xml.sax.helpers.DefaultHandler;
import org.xml.sax.helpers.XMLReaderFactory;
/**
 * xlsx格式的excel数据大批量导入
 * @author lidy
 * @since 2017-12-14
 */
public abstract class XlsxAbstract extends DefaultHandler {

	private SharedStringsTable sst;
    private String lastContents;
    private boolean nextIsString;

    private int sheetIndex = -1;
    private List<String> rowlist = new ArrayList<String>();
    private int curRow = 0;        //当前行
    private int curCol = 0;        //当前列索引
    private int preCol = 0;        //上一列列索引
    private int titleRow = 0;    //标题行，一般情况下为0
    private int rowsize = 0;    //列数
    
    private OPCPackage pkg;
	
    public XlsxAbstract(InputStream is) throws Exception{
    	this.pkg = OPCPackage.open(is);
    }
  //excel记录行操作方法，以行索引和行元素列表为参数，对一行元素进行操作，元素为String类型
//  public abstract void optRows(int curRow, List<String> rowlist) throws SQLException ;

  //excel记录行操作方法，以sheet索引，行索引和行元素列表为参数，对sheet的一行元素进行操作，元素为String类型
  public abstract void optRows(int sheetIndex,int curRow, List<String> rowlist) throws SQLException;

  //只遍历一个sheet，其中sheetId为要遍历的sheet索引，从1开始，1-3
  public void processOneSheet(int sheetId) throws Exception {
      XSSFReader r = new XSSFReader(pkg);
      SharedStringsTable sst = r.getSharedStringsTable();

      XMLReader parser = fetchSheetParser(sst);

      // rId2 found by processing the Workbook
      // 根据 rId# 或 rSheet# 查找sheet
      InputStream sheet2 = r.getSheet("rId"+sheetId);
      sheetIndex++;
      InputSource sheetSource = new InputSource(sheet2);
      parser.parse(sheetSource);
      sheet2.close();
      try{
          pkg.close();
      }catch(Exception e){

      }

  }

  /**
   * 遍历 excel 文件
   */
  public void process() throws Exception {
      XSSFReader r = new XSSFReader(pkg);
      SharedStringsTable sst = r.getSharedStringsTable();

      XMLReader parser = fetchSheetParser(sst);

      Iterator<InputStream> sheets = r.getSheetsData();
      while (sheets.hasNext()) {
          curRow = 0;
          sheetIndex++;
          InputStream sheet = sheets.next();
          InputSource sheetSource = new InputSource(sheet);
          parser.parse(sheetSource);
          sheet.close();
      }
      pkg.close();
  }

  public XMLReader fetchSheetParser(SharedStringsTable sst)
          throws SAXException {
      XMLReader parser = XMLReaderFactory
              .createXMLReader();
      this.sst = sst;
      parser.setContentHandler(this);
      return parser;
  }

  public void startElement(String uri, String localName, String name,
          Attributes attributes) throws SAXException {
      // c => 单元格
      if (name.equals("c")) {
          // 如果下一个元素是 SST 的索引，则将nextIsString标记为true
          String cellType = attributes.getValue("t");
          String rowStr = attributes.getValue("r");
          curCol = this.getRowIndex(rowStr);
          if (cellType != null && cellType.equals("s")) {
              nextIsString = true;
          } else {
              nextIsString = false;
          }
      }
      // 置空
      lastContents = "";
  }

  public void endElement(String uri, String localName, String name)
          throws SAXException {
      // 根据SST的索引值的到单元格的真正要存储的字符串
      // 这时characters()方法可能会被调用多次
      if (nextIsString) {
          try {
              int idx = Integer.parseInt(lastContents);
              lastContents = new XSSFRichTextString(sst.getEntryAt(idx))
                      .toString();
          } catch (Exception e) {

          }
      }

      // v => 单元格的值，如果单元格是字符串则v标签的值为该字符串在SST中的索引
      // 将单元格内容加入rowlist中，在这之前先去掉字符串前后的空白符
      if (name.equals("v")) {
          String value = lastContents.trim();
          value = value.equals("")?null:value;
          int cols = curCol-preCol;
          if (cols>1){
              for (int i = 0;i < cols-1;i++){
                  rowlist.add(preCol,null);
              }
          }
          preCol = curCol;
          rowlist.add(curCol-1, value);
      }else {
          //如果标签名称为 row ，这说明已到行尾，调用 optRows() 方法
          if (name.equals("row")) {
              int tmpCols = rowlist.size();
              if(curRow>this.titleRow && tmpCols<this.rowsize){
                  for (int i = 0;i < this.rowsize-tmpCols;i++){
                      rowlist.add(rowlist.size(), null);
                  }
              }
              try {
                  optRows(sheetIndex,curRow,rowlist);
              } catch (SQLException e) {
                  e.printStackTrace();
              }
              if(curRow==this.titleRow){
                  this.rowsize = rowlist.size();
              }
              rowlist.clear();
              curRow++;
              curCol = 0;
              preCol = 0;
          }
      }
  }

  public void characters(char[] ch, int start, int length)
          throws SAXException {
      //得到单元格内容的值
      lastContents += new String(ch, start, length);
  }

  //得到列索引，每一列c元素的r属性构成为字母加数字的形式，字母组合为列索引，数字组合为行索引，
  //如AB45,表示为第（A-A+1）*26+（B-A+1）*26列，45行
  public int getRowIndex(String rowStr){
      rowStr = rowStr.replaceAll("[^A-Z]", "");
      byte[] rowAbc = rowStr.getBytes();
      int len = rowAbc.length;
      float num = 0;
      for (int i=0;i<len;i++){
          num += (rowAbc[i]-'A'+1)*Math.pow(26,len-i-1 );
      }
      return (int) num;
  }

  public int getTitleRow() {
      return titleRow;
  }

  public void setTitleRow(int titleRow) {
      this.titleRow = titleRow;
  }
}