/**
 * WalletWise - Módulo de Servicios Web / API REST (Versión Pro)
 * Evidencia: GA7-220501096-AA5-EV03
 * Aprendiz: Antony Arango Cardona
 */

const APIService = {
  // Simulación de latencia de red (Server Latency de 300ms)
  _delay: (ms = 300) => new Promise(resolve => setTimeout(resolve, ms)),

  /**
   * Helper para construir respuestas HTTP estandarizadas
   */
  _buildResponse(status, ok, message, data = null) {
    return {
      status,
      ok,
      message,
      timestamp: new Date().toISOString(),
      data
    };
  },

  /**
   * GET /api/v1/transactions
   * Obtiene el historial de transacciones de un usuario
   */
  async getTransactions(usuarioId) {
    await this._delay();
    try {
      if (!usuarioId) {
        return this._buildResponse(400, false, "El campo usuarioId es requerido.");
      }

      const storageKey = `transacciones_${usuarioId}`;
      const data = JSON.parse(localStorage.getItem(storageKey)) || [];

      return this._buildResponse(200, true, "Transacciones obtenidas correctamente", data);
    } catch (error) {
      return this._buildResponse(500, false, "Error interno del servidor", error.message);
    }
  },

  /**
   * POST /api/v1/transactions
   * Registra una nueva transacción validando los campos obligatorios
   */
  async createTransaction(usuarioId, nuevaTransaccion) {
    await this._delay();
    try {
      if (!usuarioId) {
        return this._buildResponse(400, false, "El parámetro usuarioId es obligatorio.");
      }

      const { monto, tipo, categoria, descripcion } = nuevaTransaccion || {};

      // Validaciones de negocio
      if (!monto || isNaN(monto) || parseFloat(monto) <= 0) {
        return this._buildResponse(400, false, "El monto debe ser un número positivo válido.");
      }
      if (!tipo || !['ingreso', 'gasto'].includes(tipo.toLowerCase())) {
        return this._buildResponse(400, false, "El tipo debe ser 'ingreso' o 'gasto'.");
      }

      const storageKey = `transacciones_${usuarioId}`;
      const transacciones = JSON.parse(localStorage.getItem(storageKey)) || [];

      const txn = {
        id: `txn_${Date.now()}`,
        monto: parseFloat(monto),
        tipo: tipo.toLowerCase(),
        categoria: categoria || "General",
        descripcion: descripcion || "Sin descripción",
        fechaCreacion: new Date().toISOString()
      };

      transacciones.push(txn);
      localStorage.setItem(storageKey, JSON.stringify(transacciones));

      return this._buildResponse(201, true, "Transacción registrada exitosamente", txn);
    } catch (error) {
      return this._buildResponse(500, false, "Error al guardar la transacción", error.message);
    }
  },

  /**
   * POST /api/v1/budget/limit
   * Establece un límite de gasto y evalúa si fue sobrepasado
   */
  async setBudgetLimit(usuarioId, limite) {
    await this._delay();
    try {
      if (!usuarioId) {
        return this._buildResponse(400, false, "El parámetro usuarioId es obligatorio.");
      }

      const limiteNum = parseFloat(limite);
      if (isNaN(limiteNum) || limiteNum <= 0) {
        return this._buildResponse(400, false, "El límite de presupuesto debe ser un número positivo mayor a 0.");
      }

      localStorage.setItem(`limite_${usuarioId}`, limiteNum);

      // Obtener total de gastos acumulados
      const storageKey = `transacciones_${usuarioId}`;
      const transacciones = JSON.parse(localStorage.getItem(storageKey)) || [];
      const totalGastos = transacciones
        .filter(t => t.tipo === 'gasto')
        .reduce((sum, t) => sum + parseFloat(t.monto || 0), 0);

      const excedido = totalGastos > limiteNum;

      return this._buildResponse(200, true, "Límite de presupuesto actualizado", {
        limite: limiteNum,
        totalGastosActual: totalGastos,
        excedido,
        alerta: excedido 
          ? "¡Atención! Has superado el límite de gasto configurado." 
          : "El gasto actual se encuentra dentro del límite establecido."
      });
    } catch (error) {
      return this._buildResponse(500, false, "Error al actualizar el límite de presupuesto", error.message);
    }
  }
};

// Exportar servicio para disponibilidad global
window.APIService = APIService;