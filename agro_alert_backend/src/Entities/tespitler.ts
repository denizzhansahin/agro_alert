import { Field, Int, ObjectType } from "@nestjs/graphql"
import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, OneToOne, DeleteDateColumn, BeforeInsert, BeforeUpdate, ManyToOne, OneToMany, JoinColumn } from "typeorm";
import { Gozlemler } from "./gozlemler";
import { Uyarilar } from "./uyarilar";


@Entity({ name: 'tespitler' })
@ObjectType()
export class Tespitler {
    @PrimaryGeneratedColumn()
    @Field((type) => Int)
    id: number

    @ManyToOne(() => Gozlemler, (gozlem) => gozlem.tespitler) 
    @Field(() => Gozlemler, { nullable: true })
    gozlem: Gozlemler; 


    @OneToOne(() => Uyarilar, uyarilar => uyarilar.tespit, { cascade: true, onDelete: 'CASCADE' }) 
    @Field(() => Uyarilar, { nullable: true }) 
    uyari: Uyarilar | null; 

    @Column()
    @Field()
    tespit_tipi: string 

    @Column({ type: 'float', nullable: true })
    @Field({ nullable: true })
    guven_skoru: number

    @Column({ type: 'text', nullable: true }) 
    @Field({ nullable: true })
    sinirlayici_kutu_verisi: string 


    @CreateDateColumn() 
    @Field()
    created_at: Date

    @UpdateDateColumn()
    @Field()
    updated_at: Date


    @DeleteDateColumn({ nullable: true })
    @Field({ nullable: true })
    delete_at: Date


}