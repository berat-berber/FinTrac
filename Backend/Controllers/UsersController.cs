using Backend;
using FluentValidation;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace MyApp.Namespace
{
    [Route("api/[controller]")]
    [ApiController]
    public class UsersController : ControllerBase
    {
        private readonly UserManager<User> _userManager;
        private readonly IValidator<CreateUserRequest> _createValidator;
        private readonly IValidator<UpdateUserRequest> _updateValidator;

        public UsersController(UserManager<User> userManager, IValidator<CreateUserRequest> createValidator,
            IValidator<UpdateUserRequest> updateValidator)
        {
            _userManager = userManager;
            _createValidator = createValidator;
            _updateValidator = updateValidator;
        }

        [HttpPost]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult> CreateUser([FromBody] CreateUserRequest request)
        {

            var validationResult = _createValidator.Validate(request);

            if(!validationResult.IsValid) return BadRequest(validationResult.Errors);

            User user = new User()
            {
                Email = request.Email,
                UserName = request.Email,
            };

            var result = await _userManager.CreateAsync(user, request.Password);

            if (!result.Succeeded) return BadRequest(result);

            result = await _userManager.AddToRoleAsync(user, request.Role);

            if (!result.Succeeded) return BadRequest(result);

            return Ok();

        }

        [HttpGet]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult> GetAllUsers()
        {
            var users = await _userManager.Users.ToListAsync();

            if (users is null) return BadRequest("No User Found");

            return Ok(users);
        }

        [HttpGet("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult> GetUserById(string id)
        {
            var user = await _userManager.FindByIdAsync(id);

            if (user is null) return BadRequest("User Not Found");

            return Ok(user);
        }

        [HttpPut("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult> UpdateUser(string id, [FromBody] UpdateUserRequest request)
        {

            var validationResult = _updateValidator.Validate(request);

            if(!validationResult.IsValid) return BadRequest(validationResult.Errors);

            var user = await _userManager.FindByIdAsync(id);

            if (user is null) return BadRequest("User Not Found");

            if (user!.Email != request.Email) 
            {    
                user.Email = request.Email;
                user.UserName = request.Email;
                user.NormalizedEmail = request.Email.ToUpper();
                user.NormalizedUserName = request.Email.ToUpper();

                var result = await _userManager.UpdateAsync(user);

                if (!result.Succeeded) return BadRequest(result);
            }

            if (!await _userManager.CheckPasswordAsync(user, request.Password))
            {
                var result = await _userManager.RemovePasswordAsync(user);
                if (!result.Succeeded) return BadRequest(result);

                result = await _userManager.AddPasswordAsync(user, request.Password);
                if (!result.Succeeded) return BadRequest(result);
            }
            
            return Ok();
        }

        [HttpDelete("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult> DeleteUser(string id)
        {
            var user = await _userManager.FindByIdAsync(id);

            if (user is null) return BadRequest("User Already Absent");

            var result = await _userManager.DeleteAsync(user);

            if (!result.Succeeded) return BadRequest(result);

            return Ok();
        }
    }
}
