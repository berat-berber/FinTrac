using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Identity;
using Microsoft.CodeAnalysis.CSharp.Syntax;
using Microsoft.IdentityModel.Tokens;

namespace Backend;

public class AuthService : IAuthService
{

    private readonly UserManager<IdentityUser> _userManager;
    private readonly IConfiguration _configuration;

    public AuthService(UserManager<IdentityUser> userManager, IConfiguration configuration)
    {
        _userManager = userManager;
        _configuration = configuration;
    } 
    public async Task<string> CreateJWT(IdentityUser user){

    var roles = await _userManager.GetRolesAsync(user);

    List<Claim> claims = new List<Claim>
    {
        new Claim(ClaimTypes.Email, user.Email!),
    };

    foreach (var role in roles)
    {
        claims.Add(new Claim(ClaimTypes.Role, role));
    }

    var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration.GetValue<string>("JWTConfig:Key")!));

    var credentials = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

    var JWTConfig = new JwtSecurityToken(
        issuer: _configuration.GetValue<string>("JWTConfig:Issuer"),
        audience: _configuration.GetValue<string>("JWTConfig:Audience"),
        claims: claims,
        expires: DateTime.UtcNow.AddMinutes(30),
        signingCredentials: credentials
    );

    string token = new JwtSecurityTokenHandler().WriteToken(JWTConfig);

    return token;
    
    }
}
