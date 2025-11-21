using FluentValidation;

namespace Backend;

public class CreateUserRequestValidator : AbstractValidator<CreateUserRequest>
{
    public CreateUserRequestValidator()
    {
        RuleFor(x => x.Email)
            .EmailAddress()
            .NotNull()
            .MaximumLength(128)
            .WithMessage("Email Should Be 0 to 128 Characters");
    
        RuleFor(x => x.Password)
            .NotNull()
            .WithMessage("Empty Password");

        RuleFor(x => x.Role)
            .NotNull()
            .Must(r => r == "Admin" || r == "User")
            .WithMessage("Role Should be Admin or User");
    }
}
