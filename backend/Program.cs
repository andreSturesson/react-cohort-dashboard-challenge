

using backend.Controller;
using backend.Db;
using backend.Model;
using backend.Repository;
using Swashbuckle.AspNetCore.Filters;
using Microsoft.OpenApi.Models;

namespace NoteHarbor
{
  public class Program
  {
    public static void Main(string[] args)
    {
      var builder = WebApplication.CreateBuilder(args);

      builder.Services.AddCors(options =>
      {
        options.AddPolicy("AllowAll",
                  builder =>
                  {
                    builder
                          .WithOrigins("http://localhost:5173", "http://localhost:5111") // Add your allowed origins here
                          .AllowAnyMethod()
                          .AllowAnyHeader()
                          .AllowCredentials();
                  });
      });

      builder.Services.AddAuthorization();
      builder.Services.AddIdentityApiEndpoints<Account>()
          .AddEntityFrameworkStores<PostContext>();

      builder.Services.AddEndpointsApiExplorer();
      builder.Services.AddSwaggerGen(options =>
      {
        options.SwaggerDoc("v1", new OpenApiInfo { Title = "Posts - API", Version = "v1" });
        options.AddSecurityDefinition("oauth2", new OpenApiSecurityScheme
        {
          In = ParameterLocation.Header,
          Name = "Authorization",
          Type = SecuritySchemeType.ApiKey
        });
        options.OperationFilter<SecurityRequirementsOperationFilter>();
      });
      builder.Services.AddDbContext<PostContext>();
      builder.Services.AddScoped<IAccountRepository, AccountRepository>();
      builder.Services.AddScoped<IPostRepository, PostRepository>();
      builder.Services.AddScoped<ICommentRepository, CommentRepository>();

      var app = builder.Build();

      // Configure the HTTP request pipeline.
      if (app.Environment.IsDevelopment())
      {
        app.UseSwagger();
        app.UseSwaggerUI();
      }

      app.UseCors("AllowAll");

      app.MapIdentityApi<Account>();

      app.UseHttpsRedirection();
      app.ConfigureAccountController();
      app.ConfigurePostController();
      app.ConfigureCommentController();
      app.Run();
    }
  }
}