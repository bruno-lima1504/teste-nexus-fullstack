import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity({ name: 'base_geral', schema: 'central_teste' })
export class BaseGeral {
  @PrimaryColumn()
  id: number;

  @Column({ nullable: true })
  ticket?: string;

  @Column({ nullable: true })
  solicitante?: string;

  @Column({ name: 'data_solicitacao', type: 'date', nullable: true })
  dataSolicitacao?: string;

  @Column({ name: 'etapa_atual', nullable: true })
  etapaAtual?: string;

  @Column({ nullable: true })
  status?: string;

  @Column({ name: 'nome_colaborador', nullable: true })
  nomeColaborador?: string;

  @Column({ name: 'tipo_exame', nullable: true })
  tipoExame?: string;

  @Column({ name: 'data_exame', type: 'date', nullable: true })
  dataExame?: string;

  @Column({ name: 'cidade_preferencia', nullable: true })
  cidadePreferencia?: string;

  @Column({ name: 'agendar_enquadramento_pcd', nullable: true })
  agendarEnquadramentoPcd?: string;

  @Column({ name: 'possui_formulario_rac', nullable: true })
  possuiFormularioRac?: string;

  @Column({ name: 'possui_exames_complementares', nullable: true })
  possuiExamesComplementares?: string;

  @Column({ name: 'data_conclusao_dia', type: 'date', nullable: true })
  dataConclusaoDia?: string;

  @Column({ name: 'status_sla_agendamento', nullable: true })
  statusSlaAgendamento?: string;

  @Column({ name: 'data_ultima_alteracao', type: 'date', nullable: true })
  dataUltimaAlteracao?: string;

  @Column({ name: 'dados_agendamento_tipo_solicitacao', nullable: true })
  dadosAgendamentoTipoSolicitacao?: string;
}
