# Documentación de Servicios Web / API REST - WalletWise
**Evidencia:** GA7-220501096-AA5-EV03  
**Aprendiz:** Antony Arango Cardona  

---

## 1. Especificación de Endpoints y JSON Schemas

### A. Autenticación de Usuarios
* **Endpoint:** `/api/v1/auth/login`
* **Método HTTP:** `POST`
* **Descripción:** Valida credenciales de usuario.
* **Request Body (JSON):**
```json
{
  "correo": "antony@walletwise.com",
  "password": "123"
}
Gestión de Transacciones
Endpoint: /api/v1/transactions

Método HTTP: GET

Descripción: Obtiene la lista de ingresos y gastos.

Endpoint: /api/v1/transactions

Método HTTP: POST

Descripción: Registra un nuevo ingreso o gasto.

Request Body (Petición)
{
  "usuarioId": "antony@walletwise.com",
  "monto": 45000.00,
  "tipo": "gasto",
  "categoria": "Alimentación",
  "descripcion": "Compra de víveres",
  "fecha": "2026-10-02"
}
Response 201 Created (Respuesta exitosa)
{
  "status": "success",
  "code": 201,
  "message": "Transacción registrada exitosamente",
  "data": {
    "id": "txn_982341",
    "monto": 45000.00,
    "tipo": "gasto",
    "alertaPresupuesto": false
  }
}
Sistema de Alerta de Presupuesto
Endpoint: /api/v1/budget/limit

Método HTTP: POST

Descripción: Establece el límite de gasto y evalúa si el presupuesto fue superado.

Request Body (Petición)
{
  "usuarioId": "antony@walletwise.com",
  "limitePresupuesto": 500000.00
}
Response 200 OK (Respuesta exitosa con validación de alerta)
{
  "status": "success",
  "code": 200,
  "message": "Límite de presupuesto actualizado",
  "data": {
    "limite": 500000.00,
    "totalGastosActual": 520000.00,
    "excedido": true,
    "alerta": "¡Atención! Has superado el límite de gasto configurado."
  }
}