
using System.Collections;

namespace backend.Utilities.Error
{
  public enum Status
  {
    BadRequest = 400,
    Unauthorized = 401,
    Forbidden = 403,
    NotFound = 404,
    InternalServerError = 500,
    Ok = 200,
  }
  public class Error
  {
    public Status Status { get; set; }
    public ICollection<string> Message { get; set; }

    public Error(Status statusCode, ICollection<string> message)
    {
      Status = statusCode;
      Message = message;
    }

    public Error(Status statusCode, string message)
    {
      Status = statusCode;
      Message = new string[] { message };
    }
  }
}