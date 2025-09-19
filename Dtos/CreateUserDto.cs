using System.ComponentModel.DataAnnotations;

namespace LoginDemo.Dtos
{
    public class CreateUserDto
    {
        [Required(ErrorMessage = "PLease Enter Email Address")]
        [EmailAddress(ErrorMessage = "Please Enter Email in right format ")]
        public string Email { get; set; } = string.Empty;
        [Required(ErrorMessage = "Password is Required")]
        [MinLength(8, ErrorMessage = "Passeord Length Should be greater than 8 words")]
        public string Password { get; set; } = string.Empty; // later: store hashed
    }
}
