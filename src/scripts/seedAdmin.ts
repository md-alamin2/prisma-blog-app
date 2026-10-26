import { prisma } from "../lib/prisma";
import { UserRole } from "../middleware/verifyRole";

async function seedAdmin() {
  try {
    console.log("starting the admin creation")
    const adminData = {
      name: process.env.NAME,
      email: process.env.EMAIL,
      role: UserRole.ADMIN,
      password: process.env.PASSWORD,
    };

    // check if user exist
    const existingUser = await prisma.user.findUnique({
      where: {
        email: adminData.email as string,
      },
    });

    if(existingUser){
        throw new Error("User already exists!!")
    }

    console.log("creating the user")
    const signUpAdmin = await fetch("http://localhost:5000/api/auth/sign-up/email", {
        method: "POST",
        headers:{
            "content-type": "application/json",
            Origin: "http://localhost:4000",
        },
        body: JSON.stringify(adminData)
    })

    if(signUpAdmin.ok){
        console.log("User created successfully")
        await prisma.user.update({
            where:{
                email: adminData.email as string
            },
            data:{
                emailVerified: true
            }
        })
    }
    console.log("Admin created successfully")
  } catch (error) {
    console.log(error);
  }
}


seedAdmin()