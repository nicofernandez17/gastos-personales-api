namespace GastosPersonalesApi.Dtos
{
    public class IngresoDto
    {
        public int Id { get; set; }
        public string Descripcion { get; set; } = string.Empty;
        public decimal Monto { get; set; }
        public int UsuarioId { get; set; }
    }
}