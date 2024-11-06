const User = require("../model/User");
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
require("dotenv").config()


exports.signup = async(req,res)=>{
    try{
        //get input data 
        const {name,email,password} = req.body 
        //check if user exist
        const existingUser = await User.findOne({email})
        if(existingUser){
            return res.status(400).json({
                success:false,
                message:"User Already Exist",
            })
        }

        //secure password
        let hashedPassword;
        try{
            hashedPassword = await bcrypt.hash(password,10)
        }
        catch(err)
        {
            return res.status(500).json({
                success:false,
                message:"Error in Hashing Password",
            })
        }
        //save data with hashed password in db

        const user = await User.create({
            name,email,password:hashedPassword
        })

        return res.status(200).json({
            success:true,
            message:"User Created Successfully"
        })

    }
    catch(err){
        console.log(err)
        res.status(500)
        .json({
            success:false,
            data:"internal server error User cannot registered try again later",
            message:err.message
        })
    }
}



exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validation for email and password
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please fill in all the details",
      });
    }

    // Check if the user exists
    let user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "User not found. Please sign up first.",
      });
    }

    // Verify password and generate JWT token if valid
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (isPasswordValid) {
      const payload = { email: user.email, id: user._id };
      const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "2h" });

      user = user.toObject();
      user.token = token;
      user.password = undefined;
      const options = {
        expires: new Date(Date.now()+3*24*60*60*1000),
        httpOnly:true
      }
      res.cookie("token",token,options)
      
      // Send token and user data in the response
      return res.status(200).json({
        success: true,
        token,
        user: { id: user._id, email: user.email, name: user.name },
        message: "User logged in successfully",
      });
    } else {
      return res.status(403).json({
        success: false,
        message: "Incorrect password",
      });
    }
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: err.message,
    });
  }
};

exports.getUser = async (req, res) => {
  try {
    // You can access user data from req.user set in the auth middleware
    const userId = req.user.id;
    const email = req.user.email;

    // Example: Fetch data for the authenticated user
    const protectedData = {
      message: "This is protected data",
      user: {
        id: userId,
        email: email,
      },
      extraInfo: "Only accessible with a valid token",
    };

    res.status(200).json({
      success: true,
      data: protectedData,
    });
  } catch (error) {
    console.error("Error fetching protected data:", error);
    res.status(500).json({
      success: false,
      message: "Could not retrieve protected data",
    });
  }
};