import {Field,Int, ObjectType} from "@nestjs/graphql"
import { IsBase64 } from "class-validator";
import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, OneToOne, DeleteDateColumn, BeforeInsert, BeforeUpdate } from "typeorm";

import * as bcrypt from 'bcrypt';
import { CihazKullanici } from "./cihaz_kullanici";


@Entity({name:'kullanici'})
@ObjectType()
export class Kullanici {
    @PrimaryGeneratedColumn()
    @Field((type)=>Int)
    id:number

    @Column()
    @Field()
    nickname:string

    @Column()
    @Field()
    isim:string

    @Column()
    @Field()
    soyisim:string


    @Column()
    @Field()
    sehir:string

    @Column()
    @Field()
    ilce:string


    @Column()
    @Field()
    tam_adres: string


    @Column()
    @Field()
    tel_no:string


    @Column({ type: 'text', nullable: true }) 
    @Field({ nullable: true })
    @IsBase64()
    profil_foto_base64: string

    @Column()
    @Field()
    eposta:string

    @Column()
    @Field()
    sifre:string

    @Column()
    @Field()
    role:string 

    @OneToOne(() => CihazKullanici, cihaz_kullanici => cihaz_kullanici.kullanici)
    @Field(() => CihazKullanici, { nullable: true })
    cihaz_kullanici: CihazKullanici;

    @CreateDateColumn()
    @Field()
    created_at:Date

    @UpdateDateColumn({ nullable: true })
    @Field({ nullable: true })
    updated_at:Date


    @DeleteDateColumn({ nullable: true }) 
    @Field({ nullable: true })
    delete_at:Date


    @BeforeInsert()
    @BeforeUpdate()
    async hashPassword() {
      if (this.sifre && this.sifre.length < 60) {
        this.sifre = await bcrypt.hash(this.sifre, 10);
      }
    }

}