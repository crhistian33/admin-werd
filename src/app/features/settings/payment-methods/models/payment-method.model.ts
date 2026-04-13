// Define los tipos de pago según tu Enum de Prisma
export type PaymentMethodType =
  | 'card'
  | 'wallet'
  | 'cash_code'
  | 'cash_on_delivery';

// Define las estructuras posibles para el campo JSON 'config'
export interface PaymentMethodConfig {
  // Configuración para pasarelas (Culqi, Niubiz, etc.)
  publicKey?: string;
  privateKey?: string;
  environment?: 'test' | 'production';

  // Configuración para pagos manuales (Yape, Plin, Transferencia)
  phoneNumber?: string;
  ownerName?: string;
  bankName?: string;
  accountNumber?: string;
  cci?: string;

  // Configuración para efectivo/códigos (PagoEfectivo)
  merchantId?: string;
  expirationHours?: number;

  // Permite cualquier otra propiedad dinámica
  [key: string]: any;
}

export interface PaymentMethod {
  id: string;
  code: string; // Ej: 'CULQI', 'YAPE_DIRECTO', 'CASH_DELIVERY'
  name: string; // Ej: 'Tarjeta de Crédito', 'Yape / Plin'
  type: PaymentMethodType;
  config: PaymentMethodConfig;
  instructions?: string | null;
  isActive: boolean;
  sortOrder: number;

  // Metadatos (Opcionales en el front si no los necesitas mostrar)
  createdAt?: Date | string;
  updatedAt?: Date | string;
  createdById?: string | null;
  updatedById?: string | null;
}

// Interfaz para el DTO de creación/actualización
export interface PaymentMethodPayload extends Partial<
  Omit<PaymentMethod, 'id'>
> {
  // Aquí puedes definir campos específicos que el backend espera si difieren
}
