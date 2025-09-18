using AutoMapper;
using LoginDemo.Data;
using LoginDemo.Dtos;
using Microsoft.AspNetCore.Mvc;

namespace LoginDemo.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class LoginController : ControllerBase
    {
        private readonly AppDbContext _appDbContext;
        private readonly IMapper _mapper;

        public LoginController(AppDbContext appDbContext, IMapper mapper)
        {
            this._appDbContext = appDbContext;
            this._mapper = mapper;
        }

        [HttpPost("Login")]
        public IActionResult Login([FromBody] LoginRequest request)
        {
            var user = _appDbContext.Users
                .FirstOrDefault(u => u.Username == request.Username && u.Password == request.Password);

            if (user == null)
            {
                return Unauthorized(new { success = false, message = "Invalid credentials! Please try again." });
            }

            return Ok(new
            {
                success = true,
                username = user.Username,
                role = user.Role,
                redirectUrl = "/html/dashboard.html"
            });
        }
    }


}