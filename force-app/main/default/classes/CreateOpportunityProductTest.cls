@isTest
private class CreateOpportunityProductTest {
  @isTest(SeeAllData=true)
  static void testOppProductMethod() {
    Double unitPrice = CreateOpportunityProduct.getUnitPrice(
      '01t8e000001NM9yAAG',
      '01s8e000001ec88AAA'
    );
    System.assertEquals(150, unitPrice);
  }
}