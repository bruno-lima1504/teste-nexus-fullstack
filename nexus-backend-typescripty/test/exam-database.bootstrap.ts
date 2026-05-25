import { Knex } from 'knex';

export async function bootstrapExamTestSchema(client: Knex) {
  await client.raw('CREATE SCHEMA IF NOT EXISTS central_teste');
  await client.raw('DROP TABLE IF EXISTS central_teste.base_geral');
  await client.raw(`
    CREATE TABLE central_teste.base_geral (
      id integer PRIMARY KEY,
      ticket integer,
      solicitante text,
      data_solicitacao date,
      etapa_atual text,
      status text,
      nome_colaborador text,
      tipo_exame text,
      data_exame date,
      cidade_preferencia text,
      agendar_enquadramento_pcd text,
      possui_formulario_rac text,
      possui_exames_complementares text,
      data_conclusao_dia date,
      status_sla_agendamento text,
      data_ultima_alteracao date,
      dados_agendamento_tipo_solicitacao text
    )
  `);
}
