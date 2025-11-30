using System.Security.Claims;
using Backend;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace MyApp.Namespace
{
    [Route("api/[controller]")]
    [ApiController]
    public class AccountsController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly UserManager<IdentityUser> _userManager;

        public AccountsController(AppDbContext context, UserManager<IdentityUser> userManager)
        {
            _context = context;
            _userManager = userManager;
        }

        [HttpPost]
        [Authorize(Roles = "User")]
        public async Task<ActionResult> CreateAccount(CreateAccountRequest request)
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)!.Value;

            var accountCategory = await _context.AccountCategories.FirstOrDefaultAsync(a => a.Name == request.AccountCategory);

            if(accountCategory is null) return BadRequest("Invalid Category");

            var currency = await _context.Currencies.FirstOrDefaultAsync(a => a.Symbol == request.Currency);

            if(currency is null) return BadRequest("Invalid Currency");

            var account = new Account()
            {
                Name = request.Name,
                UserId = userId,
                AccountCategoryId = accountCategory.Id,
                CurrencyId = currency.Id,
            };
            
            await _context.AddAsync(account);
            await _context.SaveChangesAsync();

            return Ok();   
        }

        [HttpGet()]
        [Authorize(Roles = "User")]
        public async Task<ActionResult> GetAllAccounts()
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)!.Value;
            
            var accounts = await _context.Accounts.Where(a => a.UserId == userId).ToListAsync();

            if (accounts is null) return BadRequest("Not Found");

            return Ok(accounts);
        }

        [HttpPut("{id}")]
        [Authorize(Roles = "User")]
        public async Task<ActionResult> UpdateAccount(string id, [FromBody] UpdateAccountRequest request)
        {
            var account = await _context.Accounts.FirstOrDefaultAsync(a => a.Id == id);

            if(account is null) return BadRequest("Account Not Found");

            var accountCategory = await _context.AccountCategories.FirstOrDefaultAsync(a => a.Name == request.AccountCategory);

            if(accountCategory is null) return BadRequest("Invalid Category");

            var currency = await _context.Currencies.FirstOrDefaultAsync(c => c.Symbol == request.Currency);

            if(currency is null) return BadRequest("Invalid Currency");

            account.Name = request.Name;
            account.AccountCategoryId = accountCategory!.Id;
            account.CurrencyId = currency.Id;

            _context.Accounts.Update(account);
            await _context.SaveChangesAsync();
            
            return Ok();
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult> DeleteAccount(string id)
        {
            var account = await _context.Accounts.FirstOrDefaultAsync(a => a.Id == id);

            if(account is null) return BadRequest("Account Not Found");

            _context.Remove(account);
            await _context.SaveChangesAsync();

            return Ok();
        }
    }
}
