const authServices = require("../services/authService")

const cookieOptions = { 
    httpOnly : true, 
    secure : true, 
    sameStrict : "lax", 
maxAge : 7 * 24 * 60 * 60 * 1000 , 
path : "api/auth"
}

class AuthControllers { 
    static async register (req, res) { 
        const result = await authServices.register(req.body) ; 
        res.cookie("refreshToken", result.refreshToken, cookieOptions)
        res.status(201).json({
success : true, 
user : result.user, 
accessToken : result.accessToken 
 

        })
    } 

    static async login(req , res) { 
        const r
    }

}