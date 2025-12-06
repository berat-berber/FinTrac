using System.Security.Claims;
using System.Threading.Tasks;
using Backend;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace MyApp.Namespace
{
    [Route("api/[controller]")]
    [ApiController]
    public class TransactionsController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly ITransactionsService _transactionsService;

        public TransactionsController(AppDbContext context, ITransactionsService transactionsService)
        {
            _context = context;
            _transactionsService = transactionsService;
        }

        [HttpPost]
        [Authorize(Roles = "User")]
        public async Task<ActionResult> CreateTransactions([FromBody] CreateTransactionRequest request)
        {
            
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)!.Value;

            var transactions = await _transactionsService.CreateTransactions(request.Parses, request.AccountName, userId);

            foreach(var t in transactions)
            {
                await _context.Transactions.AddAsync(t);
            }

            await _context.SaveChangesAsync();

            return Ok();
            
        }

        [HttpGet]
        [Authorize(Roles = "User")]
        public async Task<ActionResult> GetTransactions()
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)!.Value;

            var transactions = await _context.Transactions
            .Where(t => t.Account.UserId == userId)
            .OrderByDescending(t => t.DateTime)
            .ThenBy(t => t.Order)
            .Select(t => new {t.AccountId, t.Amount, t.Balance, t.DateTime, t.Description})
            .ToListAsync();

            return Ok(transactions);
        }
    }
}
