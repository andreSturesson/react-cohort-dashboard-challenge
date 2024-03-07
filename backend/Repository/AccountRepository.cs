
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using backend.Model;
using Microsoft.IdentityModel.Tokens;

namespace backend.Repository
{
  public class AccountRepository
  {
    private readonly IConfiguration _configuration;
    public AccountRepository(IConfiguration configuration)
    {
      _configuration = configuration;
    }

    public string GenerateJwtToken()
    {
      var tokenHandler = new JwtSecurityTokenHandler();
      var key = Encoding.ASCII.GetBytes(_configuration["Jwt:Key"]);

      var tokenDescriptor = new SecurityTokenDescriptor
      {
        Expires = DateTime.UtcNow.AddDays(7),
        SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
      };
      var token = tokenHandler.CreateToken(tokenDescriptor);
      return tokenHandler.WriteToken(token);
    }

    public string GenerateRefreshToken()
    {
      var randomNumber = new byte[32];
      using var rng = RandomNumberGenerator.Create();
      rng.GetBytes(randomNumber);
      return Convert.ToBase64String(randomNumber);
    }
  }
}