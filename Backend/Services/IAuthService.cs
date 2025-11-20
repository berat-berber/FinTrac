namespace Backend;

public interface IAuthService
{
    public Task<string> CreateJWT(User user);
}
