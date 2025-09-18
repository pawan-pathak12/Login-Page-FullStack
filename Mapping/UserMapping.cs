using AutoMapper;
using LoginDemo.Dtos;
using LoginDemo.Models;

namespace LoginDemo.Mapping
{
    public class UserMapping : Profile
    {
        public UserMapping()
        {
            CreateMap<User, CreateUserDto>().ReverseMap();
            CreateMap<User, LoginRequest>().ReverseMap();
        }
    }
}
