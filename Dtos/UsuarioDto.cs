namespace GastosPersonalesApi.Dtos
{
    public class UsuarioDto
    {
        public int Id { get; set; }
        public string Nombre { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;

        // Listas de IDs de gastos e ingresos opcionales
        public List<int> GastosIds { get; set; } = new();
        public List<int> IngresosIds { get; set; } = new();
    }
}