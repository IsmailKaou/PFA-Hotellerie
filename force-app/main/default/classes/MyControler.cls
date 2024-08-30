public class MyControler {
     public Integer totalValue { get; set; }
    
    public MyControler() {
        totalValue = calculateTotal();
    }
    
    public Integer calculateTotal() {
        return 10 + 20;
    }
}