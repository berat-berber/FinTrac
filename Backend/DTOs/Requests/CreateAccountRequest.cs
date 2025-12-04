namespace Backend;

public class CreateAccountRequest
{
    public string Name { get; set; } = String.Empty;

    public string AccountCategory { get; set; } = String.Empty;

    public string Currency { get; set; } = String.Empty;
}
