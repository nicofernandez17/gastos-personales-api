namespace GastosPersonalesApi.Models
{
    public class Gasto
    {
        public int Id { get; set; }
        public string Descripcion { get; set; } = string.Empty;
        public decimal Monto { get; set; }
        public DateTime Fecha { get; set; } = DateTime.Now;
        public CategoriaGasto Categoria { get; set; }

        // Relación con Usuario
        public int UsuarioId { get; set; }
        public Usuario? Usuario { get; set; }
    }
}