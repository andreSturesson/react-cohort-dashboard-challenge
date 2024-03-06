
using backend.Model;

namespace backend.Repository
{
  public class AccountRepository : IAccountRepository
  {
    public Task<Freind> AddFriend(int id, Freind friend)
    {
      throw new NotImplementedException();
    }

    public Task<Account> CreateAccount(Account account)
    {
      throw new NotImplementedException();
    }

    public Task<Account> DeleteAccount(string id)
    {
      throw new NotImplementedException();
    }

    public Task<Account> GetAccount(string id)
    {
      throw new NotImplementedException();
    }

    public Task<IEnumerable<Account>> GetAccounts()
    {
      throw new NotImplementedException();
    }

    public Task<Freind> GetFriend(int id)
    {
      throw new NotImplementedException();
    }

    public Task<IEnumerable<Freind>> GetFriends(string id)
    {
      throw new NotImplementedException();
    }

    public Task<Account> UpdateAccount(Account account)
    {
      throw new NotImplementedException();
    }
  }
}