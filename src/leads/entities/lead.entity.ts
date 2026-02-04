import { Service } from 'src/services/entities/service.entity';
import { User } from 'src/users/entities/user.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity('leads')
export class Lead {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  customerName: string;

  @Column()
  email: string;

  @Column()
  phone: string;

  @Column({ default: 'NEW' })
  status: string;

  @ManyToOne(() => User, (user) => user.leads, {
    nullable: true,
  })
  assignedTo: User;

  @ManyToOne(() => Service, (service) => service.leads, {
    nullable: false,
  })
  service: Service;
}
