using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace Backend;

public class AppDbContext : IdentityDbContext<IdentityUser>
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) {}

    public DbSet<Account> Accounts {get;set;}
    public DbSet<Transaction> Transactions {get;set;}
    public DbSet<AccountCategory> AccountCategories {get;set;}
    public DbSet<TransactionCategory> TransactionCategories {get;set;}
    public DbSet<Currency> Currencies {get;set;}
}
