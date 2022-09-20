// Di berkas ini kita akan menuliskan callback function yang akan dijalankan setiap kali ada consumer menerima pesan dari queue

class Listener {
    constructor(notesService, mailSender) {
        this._notesService = notesService
        this._mailSender = mailSender

        this.listen = this.listen.bind(this)
    }

    async listen(message) {
        try {
            const { userId, targetEmail } = JSON.parse(message.content.toString())

            const notes = await this._notesService.getNotes(userId)
            const result = await this._mailSender.sendEmail(targetEmail, JSON.stringify(notes))
            console.log(result)
        } catch (error) {
            console.error(error)
        }
    }
}

module.exports = Listener
