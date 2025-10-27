namespace GastosPersonalesApi.Models
{
    public class Ingreso
    {
        public int Id { get; set; }
        public string Descripcion { get; set; } = string.Empty;
        public decimal Monto { get; set; }
        public DateTime Fecha { get; set; } = DateTime.Now;

        // Relación con Usuario
        public int UsuarioId { get; set; }
        public Usuario? Usuario { get; set; }
    }
}