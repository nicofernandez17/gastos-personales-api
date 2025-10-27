namespace GastosPersonalesApi.Models
{
    public class Usuario
    {
        public int Id { get; set; }
        public string Nombre { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;

        // Relaciones
        public List<Gasto> Gastos { get; set; } = new();
        public List<Ingreso> Ingresos { get; set; } = new();
    }
}