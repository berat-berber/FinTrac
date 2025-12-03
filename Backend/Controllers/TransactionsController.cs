using System.Security.Claims;
using System.Threading.Tasks;
using Backend;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace MyApp.Namespace
{
    [Route("api/[controller]")]
    [ApiController]
    public class TransactionsController : ControllerBase
    {

        private readonly ITransactionsService _transactionsService;

        public TransactionsController(ITransactionsService transactionsService)
        {
            _transactionsService = transactionsService;
        }

        [HttpPost]
        [Authorize(Roles = "User")]
        [Consumes("multipart/form-data")]
        public async Task<ActionResult> CreateTransactions([FromForm] CreateTransactionRequest request)
        {
            var filePath = await _transactionsService.SaveExcelFile(request.File);

            var userId = User.FindFirst(ClaimTypes.NameIdentifier)!.Value;

            List<Transaction> transactions = new();

            if(request.BankName == "Ziraat Bank")
            {
                transactions = await _transactionsService.ZiraatBankParser(filePath,request.AccountName, userId);
            }

            return Ok(transactions);
        }
    }
}
