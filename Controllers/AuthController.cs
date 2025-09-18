using AutoMapper;
using LoginDemo.Data;
using LoginDemo.Dtos;
using LoginDemo.Models;
using Microsoft.AspNetCore.Mvc;

namespace LoginDemo.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly AppDbContext _appDbContext;
        private readonly IMapper _mapper;

        public AuthController(AppDbContext appDbContext, IMapper mapper)
        {
            this._appDbContext = appDbContext;
            this._mapper = mapper;
        }

        [HttpPost("register")]
        public IActionResult Register([FromBody] CreateUserDto createUser)
        {
            var entity = _mapper.Map<User>(createUser);
            if (_appDbContext.Users.Any(u => u.Email == entity.Email))
            {
                return BadRequest(new { success = false, message = "Username already exists" });
            }

            _appDbContext.Users.Add(entity);
            _appDbContext.SaveChanges();

            return Ok(new { success = true, message = "Registration successful! You can now login." });
        }
    }
}
