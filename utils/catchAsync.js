// define async wrapper to reduce try / catch blocks 
module.exports = function wrapAsync(actualMiddleware) {
    return function (req, res, next) {
        actualMiddleware(req, res, next).catch(e => next(e))
    }
}