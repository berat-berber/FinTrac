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
        
        private readonly UserManager<User> _userManager;

        public AuthController(UserManager<User> userManager) => _userManager = userManager;

        [HttpPost("register")]
        public async Task<ActionResult> Register([FromBody] RegisterRequest request)
        {
            var response = await _userManager.FindByEmailAsync(request.Email);

            if (response is not null) return BadRequest("User Exists");

            var user = new User() {
                Email = request.Email,
                UserName = request.Email
            };

            var result = await _userManager.CreateAsync(user, request.Password);

            if (!result.Succeeded) return BadRequest(result);

            await _userManager.AddToRoleAsync(user, "User");

            return Ok();
        }

    }
}
