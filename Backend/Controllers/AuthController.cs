using Backend;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.Data;
using Microsoft.AspNetCore.Mvc;

namespace MyApp.Namespace
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        
        private readonly UserManager<IdentityUser> _userManager;
        private readonly IAuthService _authService;

        public AuthController(UserManager<IdentityUser> userManager, IAuthService authService)
        {
            _userManager = userManager;
            _authService = authService;    
        }

        [HttpPost("register")]
        public async Task<ActionResult> Register([FromBody] RegisterRequest request)
        {
            var response = await _userManager.FindByEmailAsync(request.Email);

            if (response is not null) return BadRequest("User Exists");

            var user = new IdentityUser() {
                Email = request.Email,
                UserName = request.Email
            };

            var result = await _userManager.CreateAsync(user, request.Password);

            if (!result.Succeeded) return BadRequest(result);

            await _userManager.AddToRoleAsync(user, "User");

            return Ok();
        }

        [HttpPost("login")]
        public async Task<ActionResult<string>> Login([FromBody] LoginRequest request)
        {
            var response = await _userManager.FindByEmailAsync(request.Email);

            if (response is null) return BadRequest("User Not Found");

            var result = await _userManager.CheckPasswordAsync(response, request.Password);

            if (result == false) return BadRequest("Wrong Password");

            var token = await _authService.CreateJWT(response);
            
            return Ok(token);
        }

    }
}
