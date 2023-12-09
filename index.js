/* Bot pengubah gambar menjadi sticker WhatsApp */
/* Buat ngetroll temen:v  */

// import the required package, make sure to npm install them
const qrcode = require('qrcode-terminal');
const { Client, LocalAuth } = require('whatsapp-web.js');

const prefix = "!"; // command prefix e.g !sticker
const client = new Client({  // create client object
	authStrategy: new LocalAuth(),
	puppeteer: {headless: true, args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-extensions']}
});

client.on('qr', (qr) => {
  console.log('QR RECEIVED! Please SCAN them on your WhatsApp link device.');
  qrcode.generate(qr, {small: true});
});

client.on('ready', async () => {
	console.log('im fully ready!');
});

client.on('authenticated', (session) => {
	console.log('successfully logged in.');
});

client.on('message_create', async (message) => {
	if (!message.body.startsWith(prefix)) return; // check if the received message starts with the prefix(!), if not do not respond
	const args = message.body.slice(prefix.length).trim().split(/ +/g); // tokenize the message
	const command_name = args.shift().toLowerCase(); // get the command name after prefix(!)
	const supportedMime = ["image/jpeg", "image/png", "image/jpg"];
	
	// command logic now
	switch (command_name) {
		case "sticker":
			// check if the user provides an image or not, if not then warn them
			if (!message.hasMedia) return message.reply(`Perintah untuk mengubah gambar menjadi sticker.\n\nCara menggunakannya:\n${prefix}{command_name} (nama sticker) (nama pembuat sticker)\n*contoh:* ${prefix}${command_name} apaaja akudeh\n\nSertakan gambar yang ingin diubah menjadi sticker dan jangan menggunakan spasi dibagian nama sticker dan pembuat sticker!`);
			const download_media = await message.downloadMedia(); // download the image
			
			// now check the media type, only accept image format like jpeg or png
			if (!supportedMime.includes(download_media.mimetype)) return message.reply("Harus berupa gambar!");
			const author = await message.getContact(); // get sender information
			
			const stickerAuthor = args[1] ?? author.pushname ?? "tidak diketahui";
			const stickerName = args[0] ?? "apaajaboleh";
			
			// send back the image to the user
			return message.reply(download_media, message.from, {
				sendMediaAsSticker: true, // but instead of as image we send it as sticker
				stickerAuthor,
				stickerName
			});
	}
});

client.initialize(); // run the client