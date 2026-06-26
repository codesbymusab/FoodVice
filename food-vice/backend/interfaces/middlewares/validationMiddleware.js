const z = require('zod')

exports.validateRequest = (schema) => (req, res, next) => {

    const result = schema.safeParse(req.body)

    if (result.success) {

        req.body = result.body
        next()
    }
    else {
    
        return res.status(400).json({ success: false, message: 'Validation Failed', errors: result.error.flatten()})
    }

}