using System.Collections;

namespace Backend;

public interface ITransactionsService
{
    public Task<string> SaveExcelFile(IFormFile excelFile);
    public void DeleteFile(string filePath);

    public Task<List<Transaction>> CreateTransactions(List<FileParseResponse> parses, string accountName,  string userId);

    public Task<List<FileParseResponse>> ZiraatBankParser(string filePath, string accountName, string userId);
    public Task<List<FileParseResponse>> IsBankParser(IFormFile file, string accountName, string userId);
}
