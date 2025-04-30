import { Field, Int, ObjectType } from "@nestjs/graphql"
import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, OneToOne, DeleteDateColumn, BeforeInsert, BeforeUpdate, ManyToOne, OneToMany, JoinColumn } from "typeorm";
import { Tespitler } from "./tespitler";
import { Kullanici } from "./kullanici"; // Kullanıcıya da bağlanmalı
import { Gozlemler } from "./gozlemler"; // Gözleme de bağlanabilir


@Entity({ name: 'uyarilar' })
@ObjectType()
export class Uyarilar {
    @PrimaryGeneratedColumn()
    @Field((type) => Int)
    id: number

    // Uyarının hangi tespitten tetiklendiği (OneToOne ilişki Tespitler'den kuruldu)
    @OneToOne(() => Tespitler, tespit => tespit.uyari)
    @JoinColumn({ name: 'tespitId' }) // İlişkiyi kuran FK sütunu (tespitId)
    @Field(() => Tespitler, { nullable: true }) // Tespit silinirse null olabilir veya cascade ile uyarı da silinir (Tespitler entity'sinde ayarlanır)
    tespit: Tespitler | null // Nullable olmalı, çünkü tespit silinirse uyarı kalabilir;


    @Column()
    @Field()
    uyari_seviyesi: string // 'tespit_tipi' yerine 'uyari_seviyesi' olmalı ('bilgi', 'uyari', 'kritik') - Enum kullanın

    @Column({ type: 'text' })
    @Field()
    mesaj: string


    @Column()
    @Field()
    durum: string // ('gonderildi', 'goruldu', 'cozuldu') - Enum kullanın


    @CreateDateColumn() // @Column() dekoratörü gereksiz
    @Field()
    created_at: Date

    @UpdateDateColumn() // @Column() dekoratörü gereksiz
    @Field()
    updated_at: Date


    @DeleteDateColumn({ nullable: true }) // @Column() dekoratörü gereksiz, nullable olabilir
    @Field({ nullable: true })
    delete_at: Date

}