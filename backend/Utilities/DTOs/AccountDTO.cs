

namespace backend.Utilities.DTOs
{
  using System;
  using System.Collections.Generic;
  using System.ComponentModel.DataAnnotations;
  using backend.Model;

  public class AccountDTO
  {
    public string Id { get; set; } = null!;
    [Required]
    public string Email { get; set; }
    public string? FirstName { get; set; }
    public string? LastName { get; set; }
    public string? ProfilePicture { get; set; }
    public DateTime Created { get; set; }
    public DateTime LastModified { get; set; }

    public AccountDTO(Account account)
    {
      Id = account.Id;
      Email = account.Email;
      FirstName = account.FirstName;
      LastName = account.LastName;
      ProfilePicture = account.ProfilePicture;
      Created = account.Created;
    }
  }
}