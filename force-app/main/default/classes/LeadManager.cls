@RestResource(urlMapping='/Leads/*')
global with sharing class LeadManager {
  @HttpPost
  global static ID createLead() {
    Lead l = new Lead();
    Map<String, Object> params = (Map<String, Object>) JSON.deserializeUntyped(
      RestContext.request.requestBody.toString()
    );

    for (String fieldName : params.keySet()) {
      l.put(fieldName, params.get(fieldName));
    }
    insert l;
    return l.Id;
  }
}