using System.Collections;
using System.Globalization;
using System.Security.Claims;
using System.Text;
using ClosedXML.Excel;
using Microsoft.EntityFrameworkCore;
using NPOI.HSSF.UserModel;
using NPOI.SS.Formula.Functions;
using NPOI.SS.UserModel;


namespace Backend;

public class TransactionsService : ITransactionsService
{

    private readonly AppDbContext _context;
    CultureInfo culture = new CultureInfo("tr-TR");

    public TransactionsService(AppDbContext context)
    {
        _context = context;
    }

    public async Task<string> SaveExcelFile(IFormFile excelFile)
    {

        var extension = Path.GetExtension(excelFile.FileName);
        var filePath = $"wwwroot/{Guid.NewGuid()}.{extension}";
        
        Directory.CreateDirectory("wwwroot");

        using (var stream = new FileStream(filePath, FileMode.Create))
        {
            await excelFile.CopyToAsync(stream);
        }

        return filePath;
    }

    public void DeleteFile(string filePath)
    {
        if (File.Exists(filePath))
        {
            File.Delete(filePath);
        }
    }

    public async Task<List<Transaction>> CreateTransactions(List<FileParseResponse> parses, string accountName,  string userId){
        
        var accountId = await _context.Accounts
            .Where(a => a.Name == accountName && a.UserId == userId)
            .Select(a => a.Id)
            .FirstOrDefaultAsync();

        List<Transaction> transactions = new();

        foreach(var p in parses)
        {
            transactions.Add(new Transaction
            {
               AccountId = accountId!,
               DateTime = p.DateTime,
               Amount = p.Amount,
               Description = p.Desc,
               Balance = p.Balance,
               TransactionCategoryId = 1,
               Order = p.Order
            });
        }

        return transactions;
    }

    public async Task<List<FileParseResponse>> ZiraatBankParser(string filePath, string accountName, string userId)
    {
        decimal amount;
        string description;
        decimal balance;
        int order = 0;
        DateTime date;
        DateTime previousDate = DateTime.Now.ToUniversalTime();

        var turkeyTimezone = TimeZoneInfo.FindSystemTimeZoneById("Europe/Istanbul");

        var accountId = await _context.Accounts
            .Where(a => a.Name == accountName && a.UserId == userId)
            .Select(a => a.Id)
            .FirstOrDefaultAsync();

        var newestTransactionDate = await _context.Transactions
            .Where(t => t.AccountId == accountId)
            .OrderByDescending(t => t.DateTime)
            .ThenBy(t => t.Order)
            .Select(t => t.DateTime)
            .FirstOrDefaultAsync();

        var oldestTransactionDate = await _context.Transactions
            .Where(t => t.AccountId == accountId)
            .OrderBy(t => t.DateTime)
            .ThenByDescending(t => t.Order)
            .Select(t => t.DateTime)
            .FirstOrDefaultAsync();

        var workbook = new XLWorkbook(filePath);
        var worksheet = workbook.Worksheet(1);

        int headerRow = 0;

        var parsed = new List<FileParseResponse>(){};

        foreach (var row in worksheet.RowsUsed())
        {
            if (row.Cell(1).Value.ToString().Contains("Hesap Hareketleri"))
            {
                headerRow = row.RowNumber();
                break;
            }
        }

        int transactionRow = headerRow+2;

        while (true)
        {
            var row = worksheet.Row(transactionRow);
            if (row.Cell(1).IsEmpty()) break;

            if(DateTime.TryParseExact(row.Cell(1).Value.ToString(), "dd.MM.yyyy", culture,
            DateTimeStyles.None, out DateTime dtLocal))
            {
                dtLocal = DateTime.SpecifyKind(dtLocal, DateTimeKind.Unspecified);

                date = TimeZoneInfo.ConvertTimeToUtc(dtLocal, turkeyTimezone);
            }
            else return null!;

            if(newestTransactionDate != default && oldestTransactionDate != default)
            {
                if(date <= newestTransactionDate && date >= oldestTransactionDate)
                {
                    transactionRow++;
                    continue;
                }
            }

            if(date == previousDate) order++;
            else
            {
                order = 0;
                previousDate = date;
            }

            amount = Convert.ToDecimal(row.Cell(4).Value.ToString());
            description = row.Cell(3).Value.ToString();
            balance = Convert.ToDecimal(row.Cell(5).Value.ToString());
        
            parsed.Add(new FileParseResponse
            {
                Amount = amount,
                Balance = balance,
                DateTime = date,
                Desc = description,
                Order = order
            });

            transactionRow++;
        }

        return parsed;
    }

    public async Task<List<FileParseResponse>> IsBankParser(IFormFile file, string accountName, string userId)
    {
        decimal amount;
        string description;
        decimal balance;
        int order = 0;
        DateTime date;
        DateTime previousDate = DateTime.Now.ToUniversalTime();

        var turkeyTimezone = TimeZoneInfo.FindSystemTimeZoneById("Europe/Istanbul");

        var accountId = await _context.Accounts
            .Where(a => a.Name == accountName && a.UserId == userId)
            .Select(a => a.Id)
            .FirstOrDefaultAsync();

        var newestTransactionDate = await _context.Transactions
            .Where(t => t.AccountId == accountId)
            .OrderByDescending(t => t.DateTime)
            .ThenBy(t => t.Order)
            .Select(t => t.DateTime)
            .FirstOrDefaultAsync();

        var oldestTransactionDate = await _context.Transactions
            .Where(t => t.AccountId == accountId)
            .OrderBy(t => t.DateTime)
            .ThenByDescending(t => t.Order)
            .Select(t => t.DateTime)
            .FirstOrDefaultAsync();

        var parsed = new List<FileParseResponse>(){};

        using (var stream = file.OpenReadStream())
        {
            IWorkbook workbook = new HSSFWorkbook(stream);
            ISheet sheet = workbook.GetSheetAt(0);

            int transactionRow = 0;

            for (int i = 0; i <= sheet.LastRowNum; i++)
            {
                var row = sheet.GetRow(i);
                if (row == null) continue;

                var cellValue = row.GetCell(0)?.ToString();
                
                if(cellValue == "Tarih/Saat")
                {
                    transactionRow = i+1;
                    break;
                }
            }

            while(transactionRow <= sheet.LastRowNum){

                var row = sheet.GetRow(transactionRow);
                if (row == null) break;
                else if (row.GetCell(0) == null) break;

                if(DateTime.TryParseExact(row.GetCell(0)?.ToString(), "dd/MM/yyyy-HH:mm:ss", 
                culture, DateTimeStyles.None, out DateTime dtLocal))
                {
                    dtLocal = DateTime.SpecifyKind(dtLocal, DateTimeKind.Unspecified);

                    date = TimeZoneInfo.ConvertTimeToUtc(dtLocal, turkeyTimezone);
                }
                else return null!;

                if(newestTransactionDate != default && oldestTransactionDate != default)
                {
                    if(date <= newestTransactionDate && date >= oldestTransactionDate)
                    {
                        transactionRow++;
                        continue;
                    }
                }

                if(date == previousDate) order++;
                else{
                    order = 0;
                    previousDate = date;
                }
                
                amount = Convert.ToDecimal(row.GetCell(3)?.ToString());
                description = row.GetCell(8)?.ToString()!;
                balance = Convert.ToDecimal(row.GetCell(4)?.ToString());

                parsed.Add(new FileParseResponse{
                    Amount = amount,
                    Balance = balance,
                    DateTime = date,
                    Desc = description,
                    Order = order
                });
                    
                transactionRow++;
            }
        }

        return parsed;
    }
}
