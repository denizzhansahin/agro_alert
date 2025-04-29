import { Field, Int, ObjectType } from "@nestjs/graphql"
import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, OneToOne, DeleteDateColumn, BeforeInsert, BeforeUpdate, ManyToOne, OneToMany } from "typeorm";
import { Tespitler } from "./tespitler";
import { CihazKullanici } from "./cihaz_kullanici";


@Entity({ name: 'gozlemler' })
@ObjectType()
export class Gozlemler {
    @PrimaryGeneratedColumn()
    @Field((type) => Int)
    id: number

    @ManyToOne(() => CihazKullanici, (cihaz_kullanici) => cihaz_kullanici.gozlemler)
    @Field(() => CihazKullanici, { nullable: false })
    cihaz_kullanici: CihazKullanici; 

    @OneToMany(() => Tespitler, (tespitler) => tespitler.gozlem, { onDelete: 'SET NULL', cascade: true })
    @Field(() => [Tespitler])
    tespitler: Tespitler[] 

    

    @Column()
    @Field()
    gozlem_tipi: string

    @Column({ nullable: true })
    @Field({ nullable: true })
    sayisal_deger: number

    @Column({ nullable: true })
    @Field({ nullable: true })
    metin_deger: string

    @Column({ nullable: true })
    @Field({ nullable: true })
    resim_base64: string

    @Column({ nullable: true })
    @Field({ nullable: true })
    gps_enlem: number 

    @Column({ nullable: true })
    @Field({ nullable: true })
    gps_boylam: number 


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