/**NOTE:
 * -Pada berkas ini kita akan membuat consumer dari queue
 * -serta di berkas ini juga kita akan mengatur segala dependencies yang sudah dibuat sebelumnya
 */

//[1]
require('dotenv').config()
const amqp = require('amqplib')
const NotesService = require('./NotesService')
const MailSender = require('./MailSender')
const Listener = require('./listener')

//[2]
const init = async () => {
    // [3]
    const notesService = new NotesService()
    const mailSender = new MailSender()
    const listener = new Listener(notesService, mailSender)

    const connection = await amqp.connect(process.env.RABBITMQ_SERVER) // [4]
    const channel = await connection.createChannel() // [5]

    await channel.assertQueue('export:notes', {
        durable: true,
    })

    channel.consume('export:notes', listener.listen, { noAck: true }) // [7]
}

init()

/**NOTE:
 * [1] impor nilai-nilai dari berkas-berkas yang sudah kita buat sebelumnya. Jangan lupa impor juga amqp karena kita akan menggunakannya di sin
 * [2] init untuk menampung jalannya program consumer
 * [3] kita awali dengan membuat instance dari NotesService, MailSender, dan Listener
 * [4] buat koneksi dengan server RabbitMQ
 * [5] uat channel menggunakan fungsi connection.createChannel
 * [6] pastikan queue dengan nama export:notes telah terbuat menggunakan fungsi channel.assertQueue
 * [7] consume queue export:notes dengan menetapkan listener.listen sebagai fungsi callback-nya
 *
 * [selesai]
 * - test : node src/consumer.js
 * - Jika semuanya berjalan dengan normal dan di RabbitMQ server terdapat satu pesan yang pending di queue export:notes,
 * - ita bisa cek juga halaman Inboxes pada dashboard Mailtrap. Seharusnya email yang dikirim berhasil masuk dengan membawa lampiran data notes
 *
 */
