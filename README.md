# Gastos Personales API

API REST para manejar **usuarios, gastos e ingresos**, construida en **C# (.NET 9)** con **SQLite** como base de datos persistente.  

Cuenta con **DTOs** para evitar ciclos en JSON y un **Mapper** para convertir entre entidades y DTOs.

---

## 🔹 Características

- CRUD completo para **Usuarios, Gastos e Ingresos**.  
- Persistencia en **SQLite (`gastos.db`)**.   
- Filtros opcionales por usuario:  
  - `/api/gastos?usuarioId=1`  
  - `/api/ingresos?usuarioId=1`  
- Swagger para probar endpoints automáticamente.  

---

## 🔹 Requisitos

- [.NET 9 SDK](https://dotnet.microsoft.com/en-us/download/dotnet/9.0)  
- Visual Studio Code o IDE similar  
- Git (opcional)

---

## 🔹 Instalación

1. Clonar el repositorio:

```bash
git clone https://github.com/tuusuario/gastos-personales-api.git
cd gastos-personales-api
```

2. Restaurar paquetes

```bash
dotnet restore
```

3. Ejecutar la aplicacion

```bash
dotnet run
```

La API correrá en: http://localhost:5235

Swagger: http://localhost:5235/swagger/index.html

