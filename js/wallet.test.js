// js/wallet.test.js

// 1. Funciones de lógica, simuladas a partir de app.js y apiService.js :)
function evaluarLimitePresupuesto(limite, totalGastos) {
  if (isNaN(limite) || limite <= 0) {
    return "Límite no válido";
  }
  const excedido = totalGastos > limite;
  return {
    excedido: excedido,
    alerta: excedido ? "¡Límite Superado!" : "Dentro del límite"
  };
}

function calcularBalance(ingresos, gastos) {
  if (ingresos < 0 || gastos < 0) {
    throw new Error("Los valores deben ser positivos");
  }
  return ingresos - gastos;
}

function validarTransaccion(monto, tipo) {
  if (!monto || isNaN(monto) || monto <= 0) {
    return false;
  }
  if (!tipo || !['ingreso', 'gasto'].includes(tipo.toLowerCase())) {
    return false;
  }
  return true;
}

// 2. Bloque principal de pruebas (4 pruebas unitarias estructuradas
describe('Pruebas del Módulo Financiero - WalletWise', () => {

  // Test 1: Límite no superado
  test('Prueba 1: Debe detectar cuando los gastos NO superan el límite configurado', () => {
    const resultado = evaluarLimitePresupuesto(500, 300);
    expect(resultado.excedido).toBe(false);
    expect(resultado.alerta).toBe("Dentro del límite");
  });

  // Test 2: Alerta por límite superado
  test('Prueba 2: Debe activar la alerta cuando los gastos SUPERAN el límite configurado', () => {
    const resultado = evaluarLimitePresupuesto(500, 650);
    expect(resultado.excedido).toBe(true);
    expect(resultado.alerta).toBe("¡Límite Superado!");
  });

  // Test 3: Cálculo del balance total (Ingresos - Gastos)
  test('Prueba 3: Debe calcular correctamente el balance final disponible', () => {
    const balance = calcularBalance(1500, 400);
    expect(balance).toBe(1100);
  });

  // Test 4: Validación de datos al crear transacción
  test('Prueba 4: Debe rechazar transacciones con montos negativos o tipos inválidos', () => {
    const transaccionInvalida = validarTransaccion(-50, 'gasto');
    const tipoInvalido = validarTransaccion(100, 'inversion');
    
    expect(transaccionInvalida).toBe(false);
    expect(tipoInvalido).toBe(false);
  });
});