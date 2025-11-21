using FluentValidation;

namespace Backend;

public class UpdateUserRequestValidator : AbstractValidator<UpdateUserRequest>
{
    public UpdateUserRequestValidator()
    {
        RuleFor(x => x.Email)
            .EmailAddress()
            .NotNull()
            .MaximumLength(128)
            .WithMessage("Email Should Be 0 to 128 Characters");
    
        RuleFor(x => x.Password)
            .NotNull()
            .WithMessage("Empty Password");

    }
}
