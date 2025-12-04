namespace Backend;

public class FileParseResponse
{
    public string TempId {get;set;} = Guid.NewGuid().ToString();
    public decimal Amount { get; set; }
    public decimal Balance { get; set; }
    public DateTime DateTime { get; set; }
    public string Desc { get; set; } = String.Empty;
    public int Order {get;set;}
}
