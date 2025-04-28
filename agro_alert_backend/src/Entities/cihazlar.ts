import { Field, Int, ObjectType } from "@nestjs/graphql"
import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, OneToOne, DeleteDateColumn, BeforeInsert, BeforeUpdate, ManyToOne, OneToMany } from "typeorm";


import { CihazKullanici } from "./cihaz_kullanici";
import { Gozlemler } from "./gozlemler";


@Entity({ name: 'cihazlar' })
@ObjectType()
export class Cihazlar {
    @PrimaryGeneratedColumn()
    @Field((type) => Int)
    id: number

    @Column({ unique: true }) // Seri no genellikle unique olur
    @Field()
    cihaz_seri_no: string

    @Column({ type: 'text', nullable: true }) // Notlar uzun olabilir
    @Field({ nullable: true })
    notlar: string

    @Column({ nullable: true })
    @Field({ nullable: true })
    isim: string

    @Column()
    @Field()
    durum: string // Öneri: Enum kullanabilirsiniz ('aktif', 'pasif', 'bakimda', 'cevrimdisi')

    @Column({ type: 'decimal', precision: 10, scale: 8, nullable: true }) // Daha hassas tip
    @Field({ nullable: true })
    konum_enlem: number


    @Column({ type: 'decimal', precision: 11, scale: 8, nullable: true }) // Daha hassas tip
    @Field({ nullable: true })
    konum_boylam: number


    @Column({ nullable: true })
    @Field({ nullable: true })
    son_gorulme: Date


    @CreateDateColumn() 
    @Field()
    created_at: Date

    @UpdateDateColumn() 
    @Field()
    updated_at: Date


    @DeleteDateColumn({ nullable: true }) 
    @Field({ nullable: true })
    delete_at: Date

    @ManyToOne(() => CihazKullanici, (cihaz_kullanici) => cihaz_kullanici.cihazlar)
    @Field(() => CihazKullanici, { nullable: true }) 
    cihaz_kullanici: CihazKullanici; 
    @OneToMany(() => Gozlemler, (gozlemler) => gozlemler.cihaz, { onDelete: 'SET NULL', cascade: true }) // onDelete davranışını gözden geçirin
    @Field(() => [Gozlemler])
    gozlemler: Gozlemler[] 

}