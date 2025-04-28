import { SetMetadata } from "@nestjs/common"



export const IS_PUBLIC_KEY = 'IS_PUBLIC'
export const Public = () => SetMetadata(IS_PUBLIC_KEY,true)


//şimdi globalde auth.module içinde yer alan tüm alanlar kapatıldı
//ama logini serbest bırakmak için özel yazdık