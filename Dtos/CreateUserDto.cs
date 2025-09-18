namespace LoginDemo.Dtos
{
    public class CreateUserDto
    {
        public string Username { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty; // later: store hashed
        public string Role { get; set; } = "User";
    }
}
