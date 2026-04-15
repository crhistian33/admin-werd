import { Validators } from '@angular/forms';
import { FormStepConfig } from '@shared/types/form-dynamic.type';

/**
 * Configuración del formulario para Zonas de Envío.
 * Divide la configuración en 3 pasos: información general, áreas geográficas y tarifas.
 */
export function buildShippingZoneFormConfig(): FormStepConfig[] {
  return [
    {
      title: 'Información general',
      fields: [
        {
          key: 'name',
          label: 'Nombre de la zona',
          type: 'text',
          placeholder: 'Ej: Lima Metropolitana o Envío Nacional',
          validators: [Validators.required, Validators.minLength(3)],
          cols: 3,
        },
        {
          key: 'description',
          label: 'Descripción',
          type: 'textarea',
          placeholder:
            'Opcional: Detalles adicionales sobre la cobertura de esta zona...',
          cols: 4,
        },
        {
          key: 'isActive',
          label: 'Activo',
          type: 'switch',
          showOnCreate: false,
          cols: 1,
        },
      ],
    },
    {
      title: 'Tarifas de envío',
      fields: [
        {
          key: 'rates',
          label: 'Tarifas de envío',
          type: 'shipping-rates',
          isArray: true,
          template: {
            name: ['', [Validators.required, Validators.minLength(2)]],
            price: [null, [Validators.required, Validators.min(0)]],
            minOrderAmount: [null],
            freeShippingThreshold: [null],
            estimatedMin: [null, [Validators.required]],
            estimatedMax: [null],
            estimatedUnit: [null, [Validators.required]],
            sortOrder: [null, [Validators.required, Validators.min(0)]],
          },
          validators: [Validators.required, Validators.minLength(1)],
          cols: 4,
        },
      ],
    },
    {
      title: 'Áreas de envío',
      fields: [
        {
          key: 'areas',
          label: 'Cobertura geográfica',
          type: 'shipping-areas',
          hint: 'Selecciona los departamentos, provincias o distritos que conforman esta zona de envío.',
          isArray: true,
          template: {
            departmentId: ['', [Validators.required]],
            provinceId: [null],
            districtId: [null],
          },
          validators: [Validators.required, Validators.minLength(1)],
          cols: 4,
        },
      ],
    },
  ];
}
