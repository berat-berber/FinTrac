namespace Backend;

public class UploadSummaryRequest
{
    public string BankName {get;set;} = String.Empty;

    public IFormFile File {get;set;} = null!;

    public string AccountName {get;set;} = String.Empty;
}
