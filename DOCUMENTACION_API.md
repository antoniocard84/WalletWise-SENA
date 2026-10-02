# Documentación de Servicios Web / API REST - WalletWise
**Evidencia:** GA7-220501096-AA5-EV03  
**Aprendiz:** Antony Arango Cardona  

---

## 1. Especificación de Endpoints

### A. Autenticación de Usuarios
* **Endpoint:** `/api/v1/auth/login`
* **Método HTTP:** `POST`
* **Descripción:** Valida credenciales de usuario.
* **Cuerpo de la Petición (JSON):**
```json
{
  "correo": "antony@walletwise.com",
  "password": "123"
}
B. Gestión de Transacciones
Endpoint: /api/v1/transactions

Método HTTP: GET

Descripción: Obtiene la lista de ingresos y gastos.

Endpoint: /api/v1/transactions

Método HTTP: POST

Descripción: Registra un nuevo ingreso o gasto.

Cuerpo de la Petición (JSON):
{
  "monto": 50000,
  "tipo": "gasto",
  "categoria": "Alimentación",
  "descripcion": "Compra del mes"
}
C. Sistema de Alerta de Presupuesto
Endpoint: /api/v1/budget/limit

Método HTTP: POST

Descripción: Establece el límite de gasto y evalúa si el presupuesto fue superado.
