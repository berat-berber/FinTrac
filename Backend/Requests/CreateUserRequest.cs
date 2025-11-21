namespace Backend;

public class CreateUserRequest
{
    public string Email {get;set;} = String.Empty;
    public string Password {get;set;} = String.Empty;
    public string Role {get;set;} = String.Empty;

}
