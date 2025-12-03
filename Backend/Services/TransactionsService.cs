using System.Collections;
using System.Text;


namespace Backend;

public class TransactionsService : ITransactionsService
{
    public async Task<string> SaveExcelFile(IFormFile excelFile)
    {
        var filePath = $"Backend/wwwroot/{Guid.NewGuid()}";
        
        Directory.CreateDirectory("Backend/wwwroot");

        using (var stream = new FileStream(filePath, FileMode.Create))
        {
            await excelFile.CopyToAsync(stream);
        }

        return filePath;
    }
}
