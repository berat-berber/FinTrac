namespace Backend;

public class CreateTransactionRequest
{
    public List<FileParseResponse> Parses {get;set;} = null!;

    public string AccountName {get;set;} = String.Empty;
}
