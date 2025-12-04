using System.Security.Claims;
using Backend;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace MyApp.Namespace
{
    [Route("api/[controller]")]
    [ApiController]
    public class SummariesController : ControllerBase
    {
        
        private readonly ITransactionsService _transactionsService;

        public SummariesController(ITransactionsService transactionsService)
        {
            _transactionsService = transactionsService;
        }

        [HttpPost]
        [Authorize(Roles = "User")]
        [Consumes("multipart/form-data")]
        public async Task<ActionResult> UploadSummary([FromForm] UploadSummaryRequest request)
        {
            var filePath = await _transactionsService.SaveExcelFile(request.File);

            var userId = User.FindFirst(ClaimTypes.NameIdentifier)!.Value;

            List<FileParseResponse> parsed = new();

            if(request.BankName == "Ziraat Bank")
            {
                parsed = await _transactionsService.ZiraatBankParser(filePath,request.AccountName, userId);
            }
            else if(request.BankName == "Is Bank")
            {
                parsed = await _transactionsService.IsBankParser(request.File,request.AccountName, userId);
            }

            _transactionsService.DeleteFile(filePath);

            return Ok(parsed);
        }
    }
}
