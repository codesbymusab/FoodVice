
const base64 = require('base64url')

exports.encodeCursor = (obj) => {
    try {
        console.log(obj)
        return base64(JSON.stringify(obj))
    }
    catch (e) {
        console.log(e)
        throw new Error('Failed to encode cursor')
    }
}

exports.decodeCursor = (cursor) => {
    try {
        const decoded=JSON.parse(base64.decode(cursor))
        console.log(decoded)
        return decoded
    }
    catch (e) {
        console.log(e)
        throw new Error('Failed to decode cursor')
    }
}

exports.cursorPaginateRest = (data, limit = 5) => {

    if (data.length === limit + 1) {
        const cursorObj = { _id: data[limit]._id.toString(), avgOverall: data[limit].avgOverall.toFixed(2) }
        return {

            data: data.slice(0, limit),
            pagination: {
                type: 'cursor',
                hasMore: true,
                cursor: this.encodeCursor(cursorObj),
                limit
            }

        }
    }

    return {

        data,
        pagination: {
            type: 'cursor',
            hasMore: false,
            cursor: null,
            limit
        }

    }
}
    exports.cursorPaginateReels = (data, limit = 5) => {
   
    if (data.length === limit + 1) {
        const cursorObj = { createdAt: new Date(data[limit].createdAt).getTime()}
        return {

            data: data.slice(0, limit),
            pagination: {
                type: 'cursor',
                hasMore: true,
                cursor: this.encodeCursor(cursorObj),
                limit
            }

        }
    }

    return {

        data,
        pagination: {
            type: 'cursor',
            hasMore: false,
            cursor: null,
            limit
        }

    }



}