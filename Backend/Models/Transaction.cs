namespace Backend;

public class Transaction
{
    public string Id { get; set; } = Guid.NewGuid().ToString();
    public string AccountId { get; set; } = null!;

    public Account Account {get;set;} = null!;
    public DateTime DateTime { get; set; }
    public decimal Amount { get; set; }
    public string Description { get; set; } = String.Empty;
    public decimal Balance { get; set; }
    public int TransactionCategoryId { get; set; }

    public TransactionCategory Category {get;set;} = null!;
    public int Order { get; set; }
}
