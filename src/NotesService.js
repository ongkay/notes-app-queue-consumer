const { Pool } = require('pg')

class NotesService {
    constructor() {
        this._pool = new Pool()
    }

    // [1]
    async getNotes(userId) {
        const query = {
            text: `SELECT notes.* FROM notes
            LEFT JOIN collaborations ON collaborations.note_id = notes.id
            WHERE notes.owner = $1 OR collaborations.user_id = $1
            GROUP BY notes.id`,
            values: [userId],
        }
        const result = await this._pool.query(query)
        return result.rows
    }
}

module.exports = NotesService

/**NOTE:
 * [1] di dalam fungsi getNotes tuliskan kode untuk mendapatkan seluruh catatan yang dimiliki atau dapat dikolaborasikan oleh userId
 *  - Kode dalam fungsi ini serupa dengan fungsi getNotes yang ada di Notes API
 *
 *
 *
 */
