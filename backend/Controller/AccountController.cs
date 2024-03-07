
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using backend.Model;
using backend.Repository;
using backend.Utilities.Error;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;

namespace backend.Controller
{
  public static class AccountController
  {
    public static void ConfigureAccountController(this WebApplication app)
    {
      app.MapGroup("/user");
      app.MapPost("/user/register", Register);
      app.MapGet("/user", GetUser);
      app.MapPost("/user/updateUser", UpdateUser);
      app.MapGet("/user/{id}", GetUserById);
    }

    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public static async Task<IResult> Register(AccountRepository repository, [FromServices] UserManager<Account> userManager, RegisterPayload payload)
    {

      if (string.IsNullOrEmpty(payload.Email))
      {
        return Results.BadRequest(new { Error = "Email is required" });
      }

      if (string.IsNullOrEmpty(payload.Password))
      {
        return Results.BadRequest(new { Error = "Password is required" });
      }

      var user = new Account
      {
        Email = payload.Email,
        UserName = payload.Email,
        FirstName = payload.FirstName,
        LastName = payload.LastName,
        ProfilePicture = payload.ProfilePicture,
        Created = DateTime.UtcNow,
      };

      var result = await userManager.CreateAsync(user, payload.Password);

      if (result.Succeeded)
      {
        return Results.Ok(new Error(Status.Ok, "Created"));
      }

      return Results.BadRequest(result.Errors.Select(e => e.Description).ToList());
    }


    [Authorize]
    public static async Task<IResult> GetUserById([FromServices] UserManager<Account> userManager, int id)
    {
      var user = await userManager.FindByIdAsync(id.ToString());
      if (user == null)
      {
        return Results.NotFound(new Error(Status.NotFound, "User not found"));
      }
      return Results.Ok(new
      {
        user.Id,
        user.Email,
        user.FirstName,
        user.LastName,
        user.ProfilePicture
      });
    }

    [ProducesResponseType(StatusCodes.Status200OK)]
    [Authorize]
    public static async Task<IResult> GetUser([FromServices] UserManager<Account> userManager, [FromServices] IHttpContextAccessor httpContext)
    {
      var user = await userManager.GetUserAsync(httpContext.HttpContext.User);
      return Results.Ok(new
      {
        user.Id,
        user.Email,
        user.FirstName,
        user.LastName,
        user.ProfilePicture
      });
    }

    [ProducesResponseType(StatusCodes.Status200OK)]
    [Authorize]
    public static async Task<IResult> UpdateUser([FromServices] UserManager<Account> userManager, [FromServices] IHttpContextAccessor httpContext, UpdateUserPayload payload)
    {
      var user = await userManager.GetUserAsync(httpContext.HttpContext.User);

      if (!string.IsNullOrEmpty(payload.FirstName))
      {
        user.FirstName = payload.FirstName;
      }

      if (!string.IsNullOrEmpty(payload.LastName))
      {
        user.LastName = payload.LastName;
      }

      if (!string.IsNullOrEmpty(payload.ProfilePicture))
      {
        user.ProfilePicture = payload.ProfilePicture;
      }

      await userManager.UpdateAsync(user);
      return Results.Ok("User updated successfully!");
    }
  }
}