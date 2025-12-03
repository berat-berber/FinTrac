using System.Collections;
using System.Globalization;
using System.Security.Claims;
using System.Text;
using ClosedXML.Excel;
using Microsoft.EntityFrameworkCore;
using NPOI.HSSF.UserModel;
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

    public async Task<List<Transaction>> ZiraatBankParser(string filePath, string accountName, string userId)
    {
        decimal amount;
        string description;
        decimal balance;
        int transactionCategoryId = 0;
        int order = 0;
        DateTime date = DateTime.Now;
        DateTime previousDate = DateTime.Now;

        var workbook = new XLWorkbook(filePath);
        var worksheet = workbook.Worksheet(1);

        int headerRow = 0;

        var transactions = new List<Transaction>(){};

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

            var accountId = await _context.Accounts
                .Where(a => a.Name == accountName && a.UserId == userId)
                .Select(a => a.Id)
                .FirstOrDefaultAsync();

            if(DateTime.TryParseExact(row.Cell(1).Value.ToString(), "dd.MM.yyyy", culture,
            DateTimeStyles.None, out DateTime dt))
            {
                date = dt;
            }
            else return null!;

            if(date.CompareTo(previousDate) == 0) order++;
            else
            {
                order = 0;
                previousDate = date;
            }

            amount = Convert.ToDecimal(row.Cell(4).Value.ToString());
            description = row.Cell(3).Value.ToString();
            balance = Convert.ToDecimal(row.Cell(5).Value.ToString());
        
            transactions.Add(new Transaction
            {
                AccountId = accountId!,
                Amount = amount,
                Balance = balance,
                DateTime = date,
                Description = description,
                TransactionCategoryId = transactionCategoryId,
                Order = order
            });

            transactionRow++;
        }

        return transactions;
    }

    public async Task<List<Transaction>> IsBankParser(IFormFile file, string accountName, string userId)
    {
        decimal amount;
        string description;
        decimal balance;
        int transactionCategoryId = 0;
        int order = 0;
        DateTime date;
        DateTime previousDate = DateTime.Now;

        var accountId = await _context.Accounts
            .Where(a => a.Name == accountName && a.UserId == userId)
            .Select(a => a.Id)
            .FirstOrDefaultAsync();

        var transactions = new List<Transaction>(){};

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
                
                
                amount = Convert.ToDecimal(row.GetCell(3)?.ToString());
                description = row.GetCell(8)?.ToString()!;
                balance = Convert.ToDecimal(row.GetCell(4)?.ToString());

                if(DateTime.TryParseExact(row.GetCell(0)?.ToString(), "dd/MM/yyyy-HH:mm:ss", 
                culture, DateTimeStyles.None, out DateTime dt))
                {
                    date = dt;
                }
                else return null!;

                if(date.CompareTo(previousDate) == 0) order++;
                else
                {
                    order = 0;
                    previousDate = date;
                }

                transactions.Add(new Transaction
                {
                    AccountId = accountId!,
                    Amount = amount,
                    Balance = balance,
                    DateTime = date,
                    Description = description,
                    TransactionCategoryId = transactionCategoryId,
                    Order = order
                });
                    
                transactionRow++;
            }
        }

        return transactions;
    }
}
