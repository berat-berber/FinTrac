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

    // Seeding Categories into database on creation
    protected override void OnModelCreating(ModelBuilder builder)
    {
        base.OnModelCreating(builder);

        builder.Entity<AccountCategory>().HasData(
            new AccountCategory { Id = 1, Name = "Checking"}
        );

        builder.Entity<Currency>().HasData(
            new Currency { Id = 1, Symbol = "₺"},
            new Currency { Id = 2, Symbol = "$"},
            new Currency { Id = 3, Symbol = "€"}
        );

        builder.Entity<TransactionCategory>().HasData(
            new TransactionCategory { Id = 1, Name = "Other"}
        );
    }
}
