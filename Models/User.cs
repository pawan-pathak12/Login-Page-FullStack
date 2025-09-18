namespace LoginDemo.Models
{
    public class User
    {
        public int Id { get; set; }
        public string Username { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty; // later: store hashed
        public string Role { get; set; } = "Standard User";
    }


}
