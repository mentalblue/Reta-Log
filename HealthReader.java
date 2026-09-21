package hr.mentalblue.retadnevnik;
import android.content.Context;
import android.content.pm.PackageManager;
import android.health.connect.*;
import android.health.connect.datatypes.*;
import android.os.OutcomeReceiver;
import org.json.*;
import java.time.Instant;
import java.util.*;

public class HealthReader {
    interface Callback{void done(JSONObject result);}
    final Context context;final Callback callback;final JSONArray rows=new JSONArray(),warnings=new JSONArray();final HealthConnectManager manager;
    final Class[] types={WeightRecord.class,BodyFatRecord.class,LeanBodyMassRecord.class,BoneMassRecord.class,BodyWaterMassRecord.class,BasalMetabolicRateRecord.class};
    final String[] names={"WEIGHT","BODY_FAT","LEAN_BODY_MASS","BONE_MASS","BODY_WATER_MASS","BASAL_METABOLIC_RATE"};int index=0;
    final long requestedStart,requestedEnd;
    HealthReader(Context c,Callback cb,long start,long end){context=c;callback=cb;requestedStart=start;requestedEnd=end;manager=c.getSystemService(HealthConnectManager.class);}
    static String[] permissions(Context c){ArrayList<String> p=new ArrayList<>();for(String n:new String[]{"WEIGHT","BODY_FAT","LEAN_BODY_MASS","BONE_MASS","BODY_WATER_MASS","BASAL_METABOLIC_RATE"})p.add("android.permission.health.READ_"+n);try{c.getPackageManager().getPermissionInfo("android.permission.health.READ_HEALTH_DATA_HISTORY",0);p.add("android.permission.health.READ_HEALTH_DATA_HISTORY");}catch(Exception ignored){}return p.toArray(new String[0]);}
    void read(){if(manager==null){warnings.put("Health Connect is unavailable.");finish();return;}next();}
    void next(){if(index>=types.length){finish();return;}String permission="android.permission.health.READ_"+names[index];if(context.checkSelfPermission(permission)!=PackageManager.PERMISSION_GRANTED){warnings.put(names[index]+" access not granted.");index++;next();return;}page(-1);}
    @SuppressWarnings({"unchecked","rawtypes"}) void page(long token){boolean history=context.checkSelfPermission("android.permission.health.READ_HEALTH_DATA_HISTORY")==PackageManager.PERMISSION_GRANTED;Instant earliest=history?Instant.EPOCH:Instant.now().minusSeconds(29*86400L);Instant start=requestedStart>0?Instant.ofEpochMilli(Math.max(earliest.toEpochMilli(),requestedStart)):earliest;Instant end=requestedEnd>0?Instant.ofEpochMilli(Math.min(System.currentTimeMillis(),requestedEnd)):Instant.now();if(!end.isAfter(start)){warnings.put(names[index]+": selected range is outside currently accessible history.");index++;next();return;}ReadRecordsRequestUsingFilters.Builder builder=new ReadRecordsRequestUsingFilters.Builder(types[index]).setTimeRangeFilter(new TimeInstantRangeFilter.Builder().setStartTime(start).setEndTime(end).build()).setPageSize(1000);if(token!=-1)builder.setPageToken(token);
        try{manager.readRecords(builder.build(),context.getMainExecutor(),(OutcomeReceiver)new OutcomeReceiver<ReadRecordsResponse,HealthConnectException>(){public void onResult(ReadRecordsResponse response){for(Object obj:response.getRecords())add((android.health.connect.datatypes.Record)obj);if(rows.length()>20000){warnings.put("Import limited to 20,000 records.");finish();return;}if(response.getNextPageToken()!=-1)page(response.getNextPageToken());else{index++;next();}}public void onError(HealthConnectException e){warnings.put(names[index]+": "+e.getMessage());index++;next();}});}catch(Exception e){warnings.put(names[index]+": "+e.getMessage());index++;next();}}
    void add(android.health.connect.datatypes.Record record){try{JSONObject values=new JSONObject();if(record instanceof WeightRecord)values.put("weight",((WeightRecord)record).getWeight().getInGrams()/1000);if(record instanceof BodyFatRecord)values.put("fat",((BodyFatRecord)record).getPercentage().getValue());if(record instanceof LeanBodyMassRecord)values.put("lean",((LeanBodyMassRecord)record).getMass().getInGrams()/1000);if(record instanceof BoneMassRecord)values.put("bone",((BoneMassRecord)record).getMass().getInGrams()/1000);if(record instanceof BodyWaterMassRecord)values.put("waterMass",((BodyWaterMassRecord)record).getBodyWaterMass().getInGrams()/1000);if(record instanceof BasalMetabolicRateRecord)values.put("bmr",((BasalMetabolicRateRecord)record).getBasalMetabolicRate().getInWatts()*86400/4184);
        rows.put(new JSONObject().put("id",UUID.randomUUID().toString()).put("externalId",record.getMetadata().getId()).put("at",((InstantRecord)record).getTime().toString()).put("source","Health Connect · "+record.getMetadata().getDataOrigin().getPackageName()).put("values",values));}catch(Exception e){warnings.put("An unsupported record was skipped.");}}
    void finish(){try{if(context.checkSelfPermission("android.permission.health.READ_HEALTH_DATA_HISTORY")!=PackageManager.PERMISSION_GRANTED)warnings.put("Without history permission this import reads the last 29 days. Use Eufy CSV for older records.");callback.done(new JSONObject().put("rows",rows).put("warnings",warnings));}catch(Exception ignored){}}
}
