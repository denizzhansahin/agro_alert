import { Field, Int, ObjectType } from "@nestjs/graphql"
import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, OneToOne, DeleteDateColumn, JoinColumn, ManyToOne, OneToMany } from "typeorm";
import { Kullanici } from "./kullanici";
import { Cihazlar } from "./cihazlar";
import { Gozlemler } from "./gozlemler";


@Entity({ name: 'cihaz_kullanici' })
@ObjectType()
export class CihazKullanici {

    @PrimaryGeneratedColumn()
    @Field((type) => Int)
    id: number

    @CreateDateColumn() 
    @Field()
    created_at: Date

    @UpdateDateColumn() 
    @Field()
    updated_at: Date

    @DeleteDateColumn({ nullable: true }) 
    @Field({ nullable: true })
    delete_at: Date

    @OneToOne(() => Kullanici, kullanici => kullanici.cihaz_kullanici)
    @JoinColumn({ name: 'kullaniciId' })
    @Field(() => Kullanici)
    kullanici: Kullanici;

    @OneToMany(() => Cihazlar, (cihazlar) => cihazlar.cihaz_kullanici, { onDelete: 'SET NULL', cascade: true })
    @Field(() => [Cihazlar],{ nullable: true })
    cihazlar : Cihazlar[] |null

    @OneToMany(() => Gozlemler, (gozlemler) => gozlemler.cihaz_kullanici, { onDelete: 'SET NULL', cascade: true }) // onDelete davranışını gözden geçirin
    @Field(() => [Gozlemler],{ nullable: true })
    gozlemler: Gozlemler[] |null

}