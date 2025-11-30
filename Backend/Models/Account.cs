using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.AspNetCore.Identity;

namespace Backend;

public class Account
{
    public string Id { get; set; } = Guid.NewGuid().ToString();
    public string Name { get; set; } = String.Empty;

    public string UserId { get; set; } = String.Empty;

    public IdentityUser User {get;set;} = null!;
    public int AccountCategoryId { get; set; }

    public AccountCategory Category {get;set;} = null!;
    public int CurrencyId { get; set; }

    public Currency Currency {get;set;} = null!;

}
