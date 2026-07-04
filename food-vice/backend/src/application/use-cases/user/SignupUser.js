const bcrypt=require('bcrypt')

class SignupUser {
  constructor(userRepo) {
    this.userRepo = userRepo;
  }

  async execute(data) {
    
    if (!data.email) {
      throw new Error("Email required");
    }


    if (!data.password) {
      throw new Error("Password required");
    }

    if (!data.confirmPassword) {
      throw new Error("Confirm password required");
    }

    if (data.password !== data.confirmPassword) {
      throw new Error("Password not matched");
    }

    if (!data.name) {
      throw new Error("Name required");
    }
    
    if (!data.username) {
      throw new Error("UserName required");
    }

    const {email,password}=data
          
    const hashedPassword = await bcrypt.hash(password, 10);

    
    return await this.userRepo.create({
      ...data,
      password: hashedPassword,
      provider:'local'
    });
  }
}

module.exports = SignupUser;