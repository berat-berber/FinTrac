using System.Collections;

namespace Backend;

public interface ITransactionsService
{
    public Task<string> SaveExcelFile(IFormFile excelFile);
}
