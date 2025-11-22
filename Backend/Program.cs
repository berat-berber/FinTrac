using System.Text;
using Backend;
using FluentValidation;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization.Infrastructure;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using Scalar.AspNetCore;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllers();

// Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
builder.Services.AddOpenApi();

// Get connection string from .net user secrets
var ConnectionString = builder.Configuration.GetConnectionString("ConnectionString");

// Set up PostgreSQL database connection
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseNpgsql(ConnectionString));

// Add identity service
builder.Services.AddIdentity<User, IdentityRole>()
    .AddEntityFrameworkStores<AppDbContext>()
    .AddDefaultTokenProviders();

// Add Fluent Validation service
builder.Services.AddValidatorsFromAssembly(typeof(Program).Assembly);

// Add JWT authentication
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters{
            ValidateAudience = true,
            ValidateIssuer = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = builder.Configuration["JWTConfig:Issuer"], // Get Issuer from .net user secrets
            ValidAudience = builder.Configuration["JWTConfig:Audience"], // Get Audience from .net user secrets
            IssuerSigningKey = 
                new SymmetricSecurityKey(Encoding.UTF8.GetBytes(builder.Configuration["JWTConfig:Key"]!)), // Get Key from .net user secrets
            ValidateLifetime = true
        };
    }
    );

// Add authorization service
builder.Services.AddAuthorization();

// Services Dependency Injection
builder.Services.AddScoped<IAuthService, AuthService>();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
    app.MapScalarApiReference();

}

// Create roles
using (var scope = app.Services.CreateScope())
{
    var roleManager = scope.ServiceProvider.GetRequiredService<RoleManager<IdentityRole>>();

    if (!await roleManager.RoleExistsAsync("Admin"))
        await roleManager.CreateAsync(new IdentityRole("Admin"));

    if (!await roleManager.RoleExistsAsync("User"))
        await roleManager.CreateAsync(new IdentityRole("User"));
}

//app.UseHttpsRedirection();

app.Use(async (context, next) =>
{
    Console.WriteLine($"Request to: {context.Request.Path}");
    Console.WriteLine($"Auth header: {context.Request.Headers["Authorization"]}");
    await next();
});

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.Run();
