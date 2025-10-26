namespace GastosPersonalesApi.Models
{
    public class Gasto
    {
        public int Id { get; set; }
        public int UsuarioId { get; set; }
        public decimal Monto { get; set; }
        public string Categoria { get; set; } = string.Empty;
        public DateTime Fecha { get; set; }
        public string? Descripcion { get; set; }
    }
}