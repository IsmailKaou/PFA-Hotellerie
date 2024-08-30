public class PageControllor {
    public String paramValue { get; set; }
    public PageControllor() {
        paramValue = ApexPages.currentPage().getParameters().get('paramName');
    }
}