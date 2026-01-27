using SMT.Back.Comissoes.Data;

namespace SMT.Back.Comissoes.Repositories.Interfaces
{
    public class AuthRepository : IAuthRepository
    {
        private readonly DbContextClass _context;

        public AuthRepository(DbContextClass context)
        {
            _context = context;
        }

    }
}
