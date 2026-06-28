const z = require('zod')

exports.validateRequest = (schema) => (req, res, next) => {

    let result = undefined
  
    if (req.file) {
        result = schema.safeParse({ ...req.body, file: req.file })
    }
    else if (req.files) {
        result = schema.safeParse({ ...req.body, files: req.files })
    } else {
        result = schema.safeParse(req.body)
    }


    if (result.success) {

        req.body = result.data

        next()
    }
    else {

        return res.status(400).json({ success: false, message: 'Validation Failed', errors: result.error.flatten() })
    }

}