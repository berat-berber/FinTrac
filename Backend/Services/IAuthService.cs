using Microsoft.AspNetCore.Identity;

namespace Backend;

public interface IAuthService
{
    public Task<string> CreateJWT(IdentityUser user);
}
