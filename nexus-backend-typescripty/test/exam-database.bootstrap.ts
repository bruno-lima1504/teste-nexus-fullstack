import { Knex } from 'knex';

export async function bootstrapExamTestSchema(client: Knex) {
  await client.raw('CREATE SCHEMA IF NOT EXISTS central_teste');
  await client.raw(`
    CREATE TABLE IF NOT EXISTS central_teste.base_geral (
      id integer PRIMARY KEY,
      ticket varchar,
      solicitante varchar,
      data_solicitacao date,
      etapa_atual varchar,
      status varchar,
      nome_colaborador varchar,
      tipo_exame varchar,
      data_exame date,
      unidade_preferencial varchar,
      agendamento_encaminhamento_aso varchar,
      possui_formulario_aso varchar,
      possui_exames_complementares varchar,
      data_conclusao_dia date,
      status_da_agendamento varchar,
      data_ultima_alteracao date,
      status_agendamento_tipo_solicitacao varchar
    )
  `);
}
