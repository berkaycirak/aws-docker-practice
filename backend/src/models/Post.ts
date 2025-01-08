import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne } from "typeorm";
import { User } from "./User";

@Entity("posts")
export class Post {
	@PrimaryGeneratedColumn("uuid")
	id!: string;

	@Column()
	imageUrl!: string;

	@Column()
	description!: string;

	@ManyToOne(() => User, (user) => user.id)
	user!: User;

	@CreateDateColumn()
	createdAt!: Date;

	@UpdateDateColumn()
	updatedAt!: Date;
}
