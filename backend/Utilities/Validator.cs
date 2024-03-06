

using System.Text.RegularExpressions;

namespace backend.Utilities.DTOs
{


  public static class Validator
  {
    public static bool IsEmail(string email)
    {
      return new System.ComponentModel.DataAnnotations.EmailAddressAttribute().IsValid(email);
    }

    public static bool IsPassword(string password)
    {
      return password.Length >= 8;
    }

    public static bool IsUsername(string username)
    {
      return username.Length >= 3;
    }

    public static bool IsText(string text)
    {
      return text.Length >= 3;
    }

    public static bool IsTitle(string title)
    {
      return title.Length >= 3;
    }

    public static bool IsProfilePicture(string profilePicture)
    {
      string pattern = @"^(https?|ftp)://[^\s/$.?#].[^\s]*$";
      return Regex.IsMatch(profilePicture, pattern);
    }
  }
}