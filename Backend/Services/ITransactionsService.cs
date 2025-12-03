using System.Collections;

namespace Backend;

public interface ITransactionsService
{
    public Task<string> SaveExcelFile(IFormFile excelFile);

    public Task<List<Transaction>> ZiraatBankParser(string filePath, string accountName, string userId);
}
