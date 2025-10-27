using GastosPersonalesApi.Models;
using GastosPersonalesApi.Dtos;

namespace GastosPersonalesApi.Mappers
{
    public static class DtoMapper
    {
        // Usuario -> UsuarioDto
        public static UsuarioDto ToDto(Usuario usuario)
        {
            return new UsuarioDto
            {
                Id = usuario.Id,
                Nombre = usuario.Nombre,
                Email = usuario.Email,
                GastosIds = usuario.Gastos.Select(g => g.Id).ToList(),
                IngresosIds = usuario.Ingresos.Select(i => i.Id).ToList()
            };
        }

        // Gasto -> GastoDto
        public static GastoDto ToDto(Gasto gasto)
        {
            return new GastoDto
            {
                Id = gasto.Id,
                Descripcion = gasto.Descripcion,
                Monto = gasto.Monto,
                UsuarioId = gasto.UsuarioId
            };
        }

        // Ingreso -> IngresoDto
        public static IngresoDto ToDto(Ingreso ingreso)
        {
            return new IngresoDto
            {
                Id = ingreso.Id,
                Descripcion = ingreso.Descripcion,
                Monto = ingreso.Monto,
                UsuarioId = ingreso.UsuarioId
            };
        }

        // DTO -> Usuario (para POST/PUT)
        public static Usuario ToEntity(UsuarioDto dto)
        {
            return new Usuario
            {
                Id = dto.Id,
                Nombre = dto.Nombre,
                Email = dto.Email
                // Los Gastos/Ingresos se agregan aparte
            };
        }

        // DTO -> Gasto
        public static Gasto ToEntity(GastoDto dto)
        {
            return new Gasto
            {
                Id = dto.Id,
                Descripcion = dto.Descripcion,
                Monto = dto.Monto,
                UsuarioId = dto.UsuarioId
            };
        }

        // DTO -> Ingreso
        public static Ingreso ToEntity(IngresoDto dto)
        {
            return new Ingreso
            {
                Id = dto.Id,
                Descripcion = dto.Descripcion,
                Monto = dto.Monto,
                UsuarioId = dto.UsuarioId
            };
        }
    }
}