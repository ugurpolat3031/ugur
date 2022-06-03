const Discord = require("discord.js");
const db = require("croxydb");
const ayarlar = require("../config.json");
const moment = require("moment");
moment.locale("tr");
const { MessageActionRow, MessageButton } = require('discord.js');
module.exports = {
	name: 'kayıt',
	description: 'kayıt et.',
	aliases: ['k'],
	usage: 'kayıt etiket/id isim/yaş',
    cooldown: 5,
    /**@param {Discord.Message} messageCreate
     * @param {Array} args
     * @param {Discord.Client} client
     */
	execute(message, args, client) {
       const cross = db.fetch("cross")
       const cross2 = db.fetch("cross2")
       const mark = db.fetch("mark")
       const crown = db.fetch("crown")
       ////////////////////////////////////////////////////
       if(!message.member.permissions.has("ADMINISTRATOR") && !message.member.roles.cache.has(ayarlar.yetkili)){
        message.channel.send(`${cross} ${message.author} İşlemi gerçekleştirmek için gerekli yetkiye sahip değilsin!`)
        message.react(cross2)
        return
      }
      //////////////////////////////////////////////////////
      const row = new MessageActionRow()
			.addComponents(
				new MessageButton()
					.setCustomId('MAN')
					.setLabel('Erkek')
					.setStyle('SUCCESS'),
                    new MessageButton()
					.setCustomId('WOMAN')
					.setLabel('Kadın')
					.setStyle('PRIMARY'),
                    new MessageButton()
					.setCustomId('CANCEL')
					.setLabel('İptal')
					.setStyle('DANGER'),
                    );
                    const man2 = new MessageActionRow()
                    .addComponents(
                        new MessageButton()
                            .setCustomId('MAN')
                            .setLabel('Erkek')
                            .setDisabled(true)
                            .setStyle('SUCCESS'),
                            new MessageButton()
                            .setCustomId('WOMAN')
                            .setLabel('Kadın')
                            .setDisabled(true)
                            .setStyle('PRIMARY'),
                            new MessageButton()
                            .setCustomId('CANCEL')
                            .setLabel('İptal')
                            .setDisabled(true)
                            .setStyle('DANGER'),
                            );
              
      

      //////////////////////////////////////////////////////
      let isim = args[1]
      let yaş = args[2]
       let member = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
       if(!isim || !yaş || !member){
        message.channel.send(`${cross} ${message.author}, Lütfen komutu uygun şekilde kullanın. \n Örnek kullanım: **${ayarlar.prefix}kayıt etiket/id İsim Yaş**`)
        message.react(cross2) 
        return
    }
    if(isNaN(yaş)) return message.channel.send(`${cross} ${message.author}, Yaş sadece sayılardan oluşabilir.`)
   const nick = `${ayarlar.tagisim} ${isim} | ${yaş}`
   const isimler = db.get(`isimler_${member.id}`) 
   member.setNickname(nick)
   const kardox = new Discord.MessageEmbed()
   .setTitle("Kayıt İşlemi")
   .setDescription(`Kullanıcının ismi \`${nick}\` olarak değiştirildi lütfen aşşağıdaki uygun butonlara basarak kayıt işlemini tamamlayın!
   
   Kullanıcı daha önce kayıt olduğu isimleri görmek için \`isimler etiket/id\` komutunu kullanabilirsin.
   
   `)
   .setAuthor(message.guild.name, message.guild.iconURL({ dynamic: true, size: 2048 }))
   .setColor("RANDOM")
   .setFooter(ayarlar.footer)
    let msg = message.channel.send({ embeds: [kardox], components: [row]})

    const filter = i => i.user.id === message.author.id


    const collector = message.channel.createMessageComponentCollector({ filter, time: 50000 });

      collector.on("collect", async i => {

        
if(i.customId === "MAN") {
    db.add(`kayıtoplam_${message.author.id}`, 1)
    db.add(`kayıte_${message.author.id}`, 1)
    db.push(`kayıterkek_${message.author.id}`, member.id)
    db.push(`isimler_${member.id}`, `\`${isim} | ${yaş}\` **Kayıt [E]**`)
    db.push(`kayıtcı_${member.id}`, `${message.author} \`${moment(Date.now()).format("LLL")}\` [<@&${ayarlar.erkek.join(">-<@&")}>]`)
    let topteyit = db.fetch(`kayıtoplam_${message.author.id}`)
const kardoxa = new Discord.MessageEmbed()
.setTitle("Başarılı!")
.setDescription(`Kullanıcının ismi \`${nick}\` olarak değiştirildi ve **Erkek** olarak kayıt edildi!

${message.author} yetkilisinin toplam teyit sayısı **${topteyit}** olarak güncellendi!
`)
.setAuthor(message.guild.name, message.guild.iconURL({ dynamic: true, size: 2048 }))
   .setColor("RANDOM")
   .setFooter(ayarlar.footer)
member.roles.add(ayarlar.erkek)
member.roles.remove(ayarlar.unreg)
await i.deferUpdate();
i.editReply({ components: [man2], embeds: [kardoxa]})


      }
      if(i.customId === "WOMAN") {
        db.add(`kayıtoplam_${message.author.id}`, 1)
        db.add(`kayıtk_${message.author.id}`, 1)
        db.push(`kayıtkız_${message.author.id}`, member.id)
        db.push(`isimler_${member.id}`, `\`${isim} | ${yaş}\` **Kayıt [K]**`)
        db.push(`kayıtcı_${member.id}`, `${message.author} \`${moment(Date.now()).format("LLL")}\` [<@&${ayarlar.kız.join(">-<@&")}>]`)
        let topteyit = db.fetch(`kayıtoplam_${message.author.id}`)
    const kardoxa = new Discord.MessageEmbed()
    .setTitle("Başarılı!")
    .setDescription(`Kullanıcının ismi \`${nick}\` olarak değiştirildi ve **Kadın** olarak kayıt edildi!
    
    ${message.author} yetkilisinin toplam teyit sayısı **${topteyit}** olarak güncellendi!
    `)
    .setAuthor(message.guild.name, message.guild.iconURL({ dynamic: true, size: 2048 }))
       .setColor("RANDOM")
       .setFooter(ayarlar.footer)
    member.roles.add(ayarlar.kız)
    member.roles.remove(ayarlar.unreg)
    await i.deferUpdate();
    i.editReply({ components: [man2], embeds: [kardoxa]})
    
    
          }
          if(i.customId === "CANCEL") {
        const kardoxa = new Discord.MessageEmbed()
        .setTitle("İşlem iptal edildi!")
        .setDescription(`Kullanıcının ismi \`İsim Yaş\` olarak değiştirildi ve işlem iptal edildi!
        `)
        .setAuthor(message.guild.name, message.guild.iconURL({ dynamic: true, size: 2048 }))
           .setColor("RANDOM")
           .setFooter(ayarlar.footer)
           member.setNickname("İsim Yaş")
           await i.deferUpdate();
        i.editReply({ components: [man2], embeds: [kardoxa]})
        
        
              }
            })
},
};