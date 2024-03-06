
using backend.Model;

public interface IAccountRepository
{
    Task<Account> CreateAccount(Account account);
    Task<Account> GetAccount(string id);
    Task<Account> UpdateAccount(Account account);
    Task<Account> DeleteAccount(string id);
    Task<IEnumerable<Account>> GetAccounts();
    Task<IEnumerable<Freind>> GetFriends(string id);
    Task<Freind> AddFriend(int id, Freind friend);
    Task<Freind> GetFriend(int id);
}
