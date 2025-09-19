using System.ComponentModel.DataAnnotations;

namespace LoginDemo.Dtos
{
    public class LoginRequest
    {
        [EmailAddress(ErrorMessage = "Please emter email adress in right format ")]
        [Required]
        public string Email { get; set; } = string.Empty;
        [Required(ErrorMessage = "Please enter password")]
        public string Password { get; set; } = string.Empty;

    }
}
