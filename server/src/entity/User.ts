import { Entity, PrimaryGeneratedColumn, Column, BaseEntity } from 'typeorm';
import { ObjectType, Field, Int } from 'type-graphql';

@ObjectType() // Convert this as a graphql query type
@Entity('users') // Database name
export class User extends BaseEntity {
  @Field(() => Int)
  @PrimaryGeneratedColumn()
  id: number;

  @Field() // We can choose what field we want to expose to graphql
  @Column()
  email: string;

  @Column('text') // infiere el tipo pero se puede indicar de manera explícita
  password: string;
}
