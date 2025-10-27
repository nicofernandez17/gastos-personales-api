using Microsoft.EntityFrameworkCore;
using GastosPersonalesApi.Models;

namespace GastosPersonalesApi.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

        public DbSet<Usuario> Usuarios { get; set; } = null!;
        public DbSet<Gasto> Gastos { get; set; } = null!;
        public DbSet<Ingreso> Ingresos { get; set; } = null!;
    }
}