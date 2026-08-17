export const usersListSchema = {
  type: 'object',
  required: ['quantidade', 'usuarios'],
  additionalProperties: false,
  properties: {
    quantidade: {
      type: 'integer',
      minimum: 0,
    },
    usuarios: {
      type: 'array',
      items: {
        type: 'object',
        required: [
          'nome',
          'email',
          'password',
          'administrador',
          '_id',
        ],
        additionalProperties: false,
        properties: {
          nome: {
            type: 'string',
          },
          email: {
            type: 'string',
          },
          password: {
            type: 'string',
          },
          administrador: {
            type: 'string',
          },
          _id: {
            type: 'string',
          },
        },
      },
    },
  },
} as const;
