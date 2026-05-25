import { DefaultEntity } from '@sharedModule/persistence/typeorm/entity/default.entity';
import { Exclude } from 'class-transformer';
import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity({ name: 'User' })
export class User extends DefaultEntity<User> {
  @PrimaryColumn()
  id: string;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column({ unique: true })
  email: string;

  @Exclude()
  @Column()
  password: string;
}
