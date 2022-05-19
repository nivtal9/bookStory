module.exports = {
    //if logged out, the user can type ../dashboard and get to the dashboard. 
    //this function ensure that ../dashboard cannot be accessed  
    ensureAuth: function (req, res, next) {
        if(req.isAuthenticated()){
            return next()
        }
        else{
            res.redirect('/')
        }
    },
    //if logged in succeed, the user needs to go to dashboard rather then the login again
    ensureGuest: function (req, res, next) {
        if(req.isAuthenticated()){
            res.redirect('/dashboard')
        }
        else{
            return next()
        }
    }
}