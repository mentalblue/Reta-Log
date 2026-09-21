package hr.mentalblue.retadnevnik;
import android.graphics.*;
import android.graphics.pdf.PdfDocument;
import org.json.*;
import java.io.*;
import java.time.*;
import java.time.format.DateTimeFormatter;
import java.util.*;

class ReportSummary {
    final PdfDocument pdf=new PdfDocument(); final Paint p=new Paint(Paint.ANTI_ALIAS_FLAG); PdfDocument.Page page; Canvas c; int number=0,y;
    void newPage(){if(page!=null)pdf.finishPage(page);page=pdf.startPage(new PdfDocument.PageInfo.Builder(595,842,++number).create());c=page.getCanvas();p.setColor(Color.rgb(16,41,61));p.setTextSize(11);c.drawText("Reta Log · private records",40,30,p);c.drawText("Page "+number,495,30,p);y=62;}
    void line(String s,int size){p.setTextSize(size);String[] paras=s.split("\n",-1);for(String para:paras){String left=para;if(left.isEmpty()){y+=10;continue;}while(!left.isEmpty()){if(y>785)newPage();p.setTextSize(size);int n=p.breakText(left,true,515,null);if(n<=0)n=1;if(n<left.length()){int space=left.lastIndexOf(' ',n);if(space>0)n=space;}c.drawText(left.substring(0,n),40,y,p);left=left.substring(n).trim();y+=size+6;}}}
    void heading(String s){y+=14;line(s,16);}
    static String when(String at){try{return Instant.parse(at).atZone(ZoneId.systemDefault()).format(DateTimeFormatter.ofPattern("EEE, dd MMM yyyy HH:mm",Locale.ENGLISH));}catch(Exception e){return at;}}
    static ArrayList<JSONObject> rows(JSONObject store,String key){ArrayList<JSONObject> result=new ArrayList<>();JSONArray a=store.optJSONArray(key);if(a!=null)for(int i=0;i<a.length();i++){JSONObject r=a.optJSONObject(i);if(r!=null)result.add(r);}result.sort((left,right)->left.optString("at").compareTo(right.optString("at")));return result;}
    static byte[] create(JSONObject store)throws Exception {ReportSummary r=new ReportSummary();r.newPage();if(store.has("reportText")){r.line(store.getString("reportText"),11);r.pdf.finishPage(r.page);ByteArrayOutputStream result=new ByteArrayOutputStream();r.pdf.writeTo(result);r.pdf.close();return result.toByteArray();}r.line("Personal records summary",25);r.line(store.optString("reportPeriod","Exported "+LocalDate.now()),12);JSONObject profile=store.optJSONObject("profile");if(profile!=null)r.line(profile.optString("name",""),12);r.line("User-entered and imported information. Not a diagnosis, measured drug level or treatment recommendation. Missing records do not mean zero intake.",11);
        ArrayList<JSONObject> doses=rows(store,"entries");int count=0;double total=0;for(JSONObject e:doses)if(e.optString("status","taken").equals("taken")){count++;total+=e.optDouble("mg",0);}r.heading("Recorded doses");r.line(count+" confirmed entries · "+total+" mg total",12);for(JSONObject e:doses){r.line(when(e.optString("at"))+" | "+e.optDouble("mg")+" mg | "+e.optString("status","taken"),11);if(!e.optString("site").isEmpty())r.line("Site: "+e.optString("site"),10);if(!e.optString("note").isEmpty())r.line("Note: "+e.optString("note"),10);}
        r.heading("Weight · original measurements");r.line("Each saved reading is listed; daily averaging is not applied to this table.",10);for(JSONObject m:rows(store,"measurements")){JSONObject v=m.optJSONObject("values");if(v!=null&&v.has("weight"))r.line(when(m.optString("at"))+" | "+v.optDouble("weight")+" kg",11);}
        r.heading("Daily check-ins");for(JSONObject f:rows(store,"feelings")){r.line(when(f.optString("at")),11);JSONObject values=f.optJSONObject("values");if(values!=null){StringBuilder b=new StringBuilder();Iterator<String> it=values.keys();while(it.hasNext()){String k=it.next();b.append(k).append(": ").append(values.opt(k)).append("/5  ");}r.line(b.toString(),10);}r.line(f.optString("note"),10);}
        r.heading("Drinks · not total dietary water");for(JSONObject h:rows(store,"hydration"))r.line(when(h.optString("at"))+" | "+h.optDouble("ml")+" mL"+(h.optString("note").isEmpty()?"":" | "+h.optString("note")),11);
        r.heading("Protein consumed");for(JSONObject h:rows(store,"proteinLog"))r.line(when(h.optString("at"))+" | "+h.optDouble("grams")+" g protein | "+h.optString("source")+" | "+h.optString("meal")+" | "+h.optString("note"),11);
        r.heading("About this export");r.line("Values reflect available records only. Drinks and protein are logged amounts, not verified consumption. Check details with the person who entered them. Keep this report private; it contains readable health information.",11);r.pdf.finishPage(r.page);ByteArrayOutputStream out=new ByteArrayOutputStream();r.pdf.writeTo(out);r.pdf.close();return out.toByteArray();}
}
