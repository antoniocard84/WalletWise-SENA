const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// Base de datos temporal en memoria
let transacciones = [];
let limites = {};

// 1. POST /api/v1/auth/login
app.post('/api/v1/auth/login', (req, res) => {
    const { correo, password } = req.body;
    if (!correo || !password) {
        return res.status(400).json({ ok: false, message: "Correo y contraseña requeridos" });
    }
    return res.status(200).json({
        status: 200,
        ok: true,
        message: "Inicio de sesión exitoso",
        data: { usuario: correo, token: "jwt_token_simulado_12345" }
    });
});

// 2. GET /api/v1/transactions
app.get('/api/v1/transactions', (req, res) => {
    const { usuarioId } = req.query;
    if (!usuarioId) {
        return res.status(400).json({ ok: false, message: "El parámetro usuarioId es obligatorio" });
    }
    const filtradas = transacciones.filter(t => t.usuarioId === usuarioId);
    return res.status(200).json({ status: 200, ok: true, data: filtradas });
});

// 3. POST /api/v1/transactions
app.post('/api/v1/transactions', (req, res) => {
    const { usuarioId, monto, tipo, categoria, descripcion } = req.body;
    if (!usuarioId || !monto || !tipo) {
        return res.status(400).json({ ok: false, message: "Campos incompletos" });
    }
    const nuevaTxn = {
        id: `txn_${Date.now()}`,
        usuarioId,
        monto: parseFloat(monto),
        tipo,
        categoria: categoria || "General",
        descripcion: descripcion || "Sin descripción",
        fecha: new Date().toISOString()
    };
    transacciones.push(nuevaTxn);
    return res.status(201).json({ status: 201, ok: true, message: "Transacción registrada", data: nuevaTxn });
});

// 4. POST /api/v1/budget/limit
app.post('/api/v1/budget/limit', (req, res) => {
    const { usuarioId, limite } = req.body;
    if (!usuarioId || !limite) {
        return res.status(400).json({ ok: false, message: "Campos incompletos" });
    }
    const limiteNum = parseFloat(limite);
    limites[usuarioId] = limiteNum;

    const totalGastos = transacciones
        .filter(t => t.usuarioId === usuarioId && t.tipo === 'gasto')
        .reduce((sum, t) => sum + t.monto, 0);

    const excedido = totalGastos > limiteNum;

    return res.status(200).json({
        status: 200,
        ok: true,
        data: {
            limite: limiteNum,
            totalGastosActual: totalGastos,
            excedido,
            alerta: excedido ? "¡Atención! Presupuesto superado." : "Gastos dentro del límite."
        }
    });
});

const PORT = 3000;
app.listen(PORT, () => console.log(`Servidor API corriendo en http://localhost:${PORT}`));